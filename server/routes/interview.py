import pdfplumber #type: ignore
import re
import requests
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from tempfile import NamedTemporaryFile
from core.security import get_current_user
from models.user import User
from models.interview_qna import ResumeInterviewQA, QA
from core.config import settings
from beanie import PydanticObjectId #type: ignore


router = APIRouter(prefix="/interview", tags=["interview"])

# Securely stored HF token
HF_TOKEN = settings.hf_token

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts text from a PDF file using pdfplumber.
    """
    full_text = ""
    with pdfplumber.open(file_path) as pdf:
        for i, page in enumerate(pdf.pages):
            page_text = page.extract_text()
            if page_text:
                full_text += f"\n--- Page {page.page_number} ---\n" + page_text + "\n"
    return full_text.strip()

def call_mistral_api(resume_text: str):
    """
    Sends resume content to the Mistral model via Hugging Face Inference API.
    """
    API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    prompt = f"""
You are a technical interviewer. Based on the following resume content, generate 20 interview questions. For each question, also provide the ideal answer.

Resume:
\"\"\"
{resume_text}
\"\"\"
"""
    response = requests.post(API_URL, headers=headers, json={"inputs": prompt})
    return response

def parse_qna_response(text: str):
    """
    Extracts Q&A pairs from the model's response using regex.
    """
    matches = re.findall(
        r"\d+\.\s*Question:\s*(.+?)\s*Answer:\s*(.+?)(?=\n\d+\.|$)",
        text,
        re.DOTALL,
    )
    return [QA(question_no=i + 1, question=q.strip(), ideal_answer=a.strip()) for i, (q, a) in enumerate(matches)]

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Accepts a resume PDF, extracts text, queries Mistral API, stores Q&A in MongoDB.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Save uploaded file temporarily
    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
        contents = await file.read()
        temp.write(contents)
        temp_path = temp.name

    # Extract text from PDF
    text = extract_text_from_pdf(temp_path)

    # Call Mistral API
    response = call_mistral_api(text)

    # Detailed error message from API if failed
    if response.status_code != 200:
        error_detail = response.text
        raise HTTPException(status_code=500, detail=f"Mistral API failed: {error_detail}")

    # Parse model output
    try:
        data = response.json()
        raw_text = data[0]["generated_text"]
        qna_list = parse_qna_response(raw_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing error: {str(e)}")

    # Save to MongoDB
    record = ResumeInterviewQA(
        user_id=str(current_user.id),
        resume_filename=file.filename,
        questions=qna_list
    )
    await record.insert()

    return {
        "message": "Questions generated and stored successfully.",
        "question_count": len(qna_list)
    }

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

    return {"interview_id": str(interview_id), "questions": record.questions}