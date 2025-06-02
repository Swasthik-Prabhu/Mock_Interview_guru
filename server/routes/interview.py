




# import pdfplumber  # type: ignore
# import re
# import requests
# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
# from tempfile import NamedTemporaryFile
# from core.security import get_current_user
# from models.user import User
# from models.interview_qna import ResumeInterviewQA, QA
# from core.config import settings
# from beanie import PydanticObjectId  # type: ignore
# from typing import List

# router = APIRouter(prefix="/interview", tags=["interview"])

# # Hugging Face Token
# HF_TOKEN = settings.hf_token

# def extract_text_from_pdf(file_path: str) -> str:
#     full_text = ""
#     with pdfplumber.open(file_path) as pdf:
#         for page in pdf.pages:
#             page_text = page.extract_text()
#             if page_text:
#                 full_text += f"\n--- Page {page.page_number} ---\n{page_text}\n"
#     return full_text.strip()

# def call_mistral_api(resume_text: str):
#     API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
#     headers = {"Authorization": f"Bearer {HF_TOKEN}"}
#     prompt = f"""
# You are a technical interviewer. Based on the following resume content, generate 20 interview questions. For each question, also provide the ideal answer.

# Resume:
# \"\"\"{resume_text}\"\"\"
# """
#     return requests.post(API_URL, headers=headers, json={"inputs": prompt})

# def parse_qna_response(text: str) -> List[QA]:
#     pattern = r"\d+\.\s*Question:\s*(.+?)\s*Answer:\s*(.+?)(?=\n\d+\.|\Z)"
#     matches = re.findall(pattern, text, re.DOTALL)

#     return [
#         QA(
#             question_no=i + 1,
#             question=q.strip(),
#             ideal_answer=a.strip()
#         ) for i, (q, a) in enumerate(matches)
#     ]

# @router.post("/upload-resume")
# async def upload_resume(
#     file: UploadFile = File(...),
#     current_user: User = Depends(get_current_user)
# ):
#     if file.content_type != "application/pdf":
#         raise HTTPException(status_code=400, detail="Only PDF files are supported")

#     with NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
#         contents = await file.read()
#         temp.write(contents)
#         temp_path = temp.name

#     text = extract_text_from_pdf(temp_path)
#     response = call_mistral_api(text)

#     if response.status_code != 200:
#         raise HTTPException(status_code=500, detail=f"Mistral API error: {response.text}")

#     try:
#         data = response.json()
#         raw_text = data[0]["generated_text"]
#         print("\n--- MODEL RAW OUTPUT ---\n", raw_text)
#         qna_list = parse_qna_response(raw_text)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Parse error: {str(e)}")

#     try:
#         record = ResumeInterviewQA(
#             user_id=str(current_user.id),
#             resume_filename=file.filename,
#             questions=qna_list
#         )
#         await record.insert()
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database insert error: {str(e)}")

#     return {
#         "message": "Questions generated and stored successfully.",
#         "question_count": len(qna_list),
#         "interview_id": str(record.id)
#     }

# @router.get("/questions/{interview_id}")
# async def get_interview_questions(
#     interview_id: PydanticObjectId,
#     current_user: User = Depends(get_current_user)
# ):
#     record = await ResumeInterviewQA.get(interview_id)
#     if not record:
#         raise HTTPException(status_code=404, detail="Interview record not found")

#     if str(record.user_id) != str(current_user.id):
#         raise HTTPException(status_code=403, detail="Not authorized to view this interview")

#     return {
#         "interview_id": str(interview_id),
#         "questions": record.questions
#     }



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

router = APIRouter(prefix="/interview", tags=["interview"])

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
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
        contents = await file.read()
        temp.write(contents)
        temp_path = temp.name

    text = extract_text_from_pdf(temp_path)

    response = call_mistral_api(text)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Mistral API failed: {response.text}")

    try:
        data = response.json()
        raw_text = data[0]["generated_text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse Mistral API response JSON: {str(e)}")

    qna_list = parse_qna_response(raw_text)

    if not qna_list:
        raise HTTPException(status_code=500, detail="No questions parsed from model output.")

    try:
        record = ResumeInterviewQA(
            user_id=str(current_user.id),
            resume_filename=file.filename,
            questions=qna_list
        )
        await record.insert()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store questions in DB: {str(e)}")

    return {
        "message": "Questions generated and stored successfully.",
        "question_count": len(qna_list),
        "interview_id": str(record.id)
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

    return {
        "interview_id": str(interview_id),
        "questions": record.questions
    }
