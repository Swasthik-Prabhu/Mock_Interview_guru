from pydantic import BaseModel

class Article(BaseModel):
    title: str
    description: str
    image: str
    link: str
