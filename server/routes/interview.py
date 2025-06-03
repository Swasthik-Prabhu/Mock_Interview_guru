import pdfplumber  # type: ignore
import re
import requests
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from tempfile import NamedTemporaryFile
from core.security import get_current_user
from models.user import User
from models.interview_qna import ResumeInterviewQA, QA
from core.config import settings
from beanie import PydanticObjectId  # type: ignore
from typing import List
import uuid
import os
from datetime import datetime
import PyPDF2
import spacy
from pydantic import BaseModel

router = APIRouter(prefix="/interview", tags=["interview"])

# Load spaCy model for text analysis
nlp = spacy.load("en_core_web_sm")

# Storage for resumes (in-memory for demo, use proper storage in production)
RESUMES = {}

class Resume(BaseModel):
    interview_id: str
    filename: str
    upload_date: str
    status: str

class SkillAnalysis(BaseModel):
    name: str
    level: int

class ResumeAnalysis(BaseModel):
    skills: List[SkillAnalysis]
    suggestions: List[str]
    score: int

HF_TOKEN = settings.hf_token

def extract_text_from_pdf(file_path: str) -> str:
    full_text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                full_text += f"\n--- Page {page.page_number} ---\n{page_text}\n"
    return full_text.strip()

def call_mistral_api(resume_text: str):
    API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    prompt = f"""
You are a technical interviewer. Based on the following resume content, generate 20 interview questions. For each question, also provide the ideal answer.

Resume:
\"\"\"{resume_text}\"\"\"
"""
    response = requests.post(API_URL, headers=headers, json={"inputs": prompt})
    return response

def parse_qna_response(text: str) -> List[QA]:
    pattern = r"\d+\.\s*Question:\s*(.+?)\s*Answer:\s*(.+?)(?=\n\d+\.|\Z)"
    matches = re.findall(pattern, text, re.DOTALL)
    return [QA(question_no=i + 1, question=q.strip(), ideal_answer=a.strip()) for i, (q, a) in enumerate(matches)]

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Generate unique interview ID
        interview_id = str(uuid.uuid4())
        
        # Save file
        file_path = f"uploads/{interview_id}.pdf"
        os.makedirs("uploads", exist_ok=True)
        
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        # Extract text and generate questions
        text = extract_text_from_pdf(file_path)
        response = call_mistral_api(text)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Mistral API failed: {response.text}")

        try:
            data = response.json()
            raw_text = data[0]["generated_text"]
            qna_list = parse_qna_response(raw_text)

            if not qna_list:
                raise HTTPException(status_code=500, detail="No questions parsed from model output.")

            # Store in database
            record = ResumeInterviewQA(
                user_id=str(current_user.id),
                resume_filename=file.filename,
                questions=qna_list
            )
            await record.insert()

            # Store resume info in memory
            RESUMES[interview_id] = {
                "interview_id": interview_id,
                "filename": file.filename,
                "upload_date": datetime.now().isoformat(),
                "status": "analyzed"
            }

            return {
                "interview_id": interview_id,
                "message": "Resume uploaded and analyzed successfully",
                "question_count": len(qna_list)
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/resumes")
async def get_resumes():
    return {
        "resumes": [
            Resume(**resume_data) for resume_data in RESUMES.values()
        ]
    }

@router.get("/analysis/{interview_id}")
async def get_resume_analysis(interview_id: str):
    if interview_id not in RESUMES:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    try:
        # Read PDF content
        file_path = f"uploads/{interview_id}.pdf"
        text = ""
        with open(file_path, "rb") as f:
            pdf_reader = PyPDF2.PdfReader(f)
            for page in pdf_reader.pages:
                text += page.extract_text()
        
        # Analyze text using spaCy
        doc = nlp(text)
        
        # Extract skills (simplified example)
        skills = [
            {"name": ent.text, "level": 75}
            for ent in doc.ents
            if ent.label_ in ["ORG", "PRODUCT"]
        ][:5]  # Limit to top 5 skills
        
        # Generate suggestions
        suggestions = [
            "Consider adding more quantifiable achievements",
            "Include relevant certifications",
            "Highlight leadership experience"
        ]
        
        # Calculate score (simplified)
        score = min(len(skills) * 15, 100)
        
        return ResumeAnalysis(
            skills=skills,
            suggestions=suggestions,
            score=score
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/questions/{interview_id}")
async def get_interview_questions(
    interview_id: PydanticObjectId,
    current_user: User = Depends(get_current_user)
):
    record = await ResumeInterviewQA.get(interview_id)
    if not record:
        raise HTTPException(status_code=404, detail="Interview record not found")

    if str(record.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view this interview")

    return {
        "interview_id": str(interview_id),
        "questions": record.questions
    }
