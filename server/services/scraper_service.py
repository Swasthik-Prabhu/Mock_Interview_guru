from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import logging
import time
import random
from typing import List
from schemas.scraper_schema import Article

logging.basicConfig(level=logging.INFO)

def init_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
    return webdriver.Chrome(options=options)

def scrap_medium(query: str, max_articles: int = 15) -> List[Article]:
    driver = init_driver()
    results = []

    try:
        driver.get(f"https://medium.com/search?q={query}")
        for _ in range(3):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(random.uniform(2, 4))

        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "article"))
        )

        articles = driver.find_elements(By.TAG_NAME, "article")

        for article in articles[:max_articles]:
            html_content = article.get_attribute("outerHTML")
            soup = BeautifulSoup(html_content, "html.parser")

            title = soup.find("h2")
            description = soup.find("h3")
            link_tag = soup.find("div", attrs={"role": "link"})
            img_tags = soup.find_all("img")

            article_data = Article(
                title=title.get_text(strip=True) if title else "",
                description=description.get_text(strip=True) if description else "",
                image=img_tags[1]["src"] if len(img_tags) > 1 and img_tags[1].has_attr("src") else "",
                link=link_tag["data-href"] if link_tag and link_tag.has_attr("data-href") else ""
            )

            results.append(article_data)

    except Exception as e:
        driver.save_screenshot("screenshot.png")
        logging.error(f"Error scraping Medium for query '{query}': {e}")
    finally:
        driver.quit()

    return results
