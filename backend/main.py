from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
import logging
import os

# Initialize logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="BookNexus API",
    description="AI-Powered Book Recommendation System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None
)

logger.info("Loading book data...")
try:
    books = pd.read_csv('books_cleaned_with_categories.csv')
    books['tagged_description'].to_csv('tagged_description.txt', sep="\n", index=False)
    
    raw_documents = TextLoader("tagged_description.txt").load()
    text_splitter = CharacterTextSplitter(chunk_size=0, chunk_overlap=0, separator="\n")
    documents = text_splitter.split_documents(raw_documents)
    
    logger.info(f"Loaded {len(documents)} book descriptions")
    db_books = Chroma.from_documents(
        documents,
        embedding=GoogleGenerativeAIEmbeddings(model="models/embedding-001"),
        persist_directory="./chroma_db"
    )
    logger.info("Vector database initialized successfully")
except Exception as e:
    logger.error(f"Data loading failed: {str(e)}")
    raise

# Pydantic models
class RecommendationRequest(BaseModel):
    query: str
    top_k: int = 5

class BookRecommendation(BaseModel):
    title: str
    author: str
    match_reason: str
    themes: List[str]
    purchase_link: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommendations: List[BookRecommendation]
    original_query: str
    processing_time_ms: float

def retrieve_semantic_recommendation(query: str, top_k: int) -> pd.DataFrame:
    """ Retrieve books using semantic search """
    logger.debug(f"Searching for: '{query}'")
    recs = db_books.similarity_search(query, k=top_k)
    
    if not recs:
        logger.warning(f"No results found for query: '{query}'")
        return pd.DataFrame()
    
    books_list = []
    for doc in recs:
        try:
            isbn = int(doc.page_content.strip('"').split()[0])
            books_list.append(isbn)
        except (IndexError, ValueError) as e:
            logger.warning(f"Failed to parse document: {str(e)}")
            continue
    
    results = books[books["isbn13"].isin(books_list)].head(top_k)
    logger.debug(f"Found {len(results)} matching books")
    return results


@app.post("/recommend", response_model=dict)
async def get_recommendations(request: RecommendationRequest, fastapi_request: Request):
    """Main recommendation endpoint"""
    import time
    start_time = time.time()

    try:
        logger.info(f"Recommendation request: {await fastapi_request.json()}")

        retrieved_books = retrieve_semantic_recommendation(request.query, request.top_k)
        if retrieved_books.empty:
            return JSONResponse(
                content={
                    "recommendations": "Sorry, I couldn't find any relevant books.",
                    "original_query": request.query,
                    "processing_time_ms": (time.time() - start_time) * 1000
                }
            )

        prompt_template = """
        You are a knowledgeable and friendly book recommendation assistant. 
            Your goal is to help users find books they'll love based on their preferences and the available books. Dont directly mention the books. be like a bookworm. give the user the treatment of a bookworm.
            Also provide a link to purchase the book.
            Query: {query}
            
            **Available Book Information:**
            {retrieved_books}
            provide all the books that have been provided to you
            For each recommended book, provide:
        - Title and Author
        - Brief reason why it matches their request
        - Key themes or features 
        """

        prompt = PromptTemplate.from_template(prompt_template)
        llm = ChatGoogleGenerativeAI(
            temperature=0.7,
            model='gemini-2.0-flash-lite-preview-02-05'
        )

        chain = prompt | llm
        response = chain.invoke({
            "query": request.query,
            "retrieved_books": "\n\n".join([
                f"Title: {row['title']}, Author: {row['authors']}, Description: {row['tagged_description']}"
                for _, row in retrieved_books.iterrows()
            ])
        })

        processing_time_ms = (time.time() - start_time) * 1000
        logger.info(f"Request processed in {processing_time_ms:.2f}ms")

        return {
            "recommendations": response.content,  # ✅ Correctly accessing response content
            "original_query": request.query,
            "processing_time_ms": processing_time_ms
        }

    except Exception as e:
        logger.error(f"Recommendation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation processing failed: {str(e)}"
        )
