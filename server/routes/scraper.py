from fastapi import APIRouter, Query
from typing import List
from schemas.scraper_schema import Article
from services.scraper_service import scrap_medium

router = APIRouter()

@router.get("/scrape", response_model=List[Article])
def scrape(query: str = Query(..., description="Topic to search on Medium")):
    return scrap_medium(query)
