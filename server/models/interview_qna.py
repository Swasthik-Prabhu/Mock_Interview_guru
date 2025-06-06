from typing import List
from beanie import Document
from pydantic import BaseModel

class QA(BaseModel):
    question_no: int
    question: str
    ideal_answer: str

class ResumeInterviewQA(Document):
    user_id: str
    resume_filename: str
    questions: List[QA]
class Settings:
        name = "resume_interview_qna"