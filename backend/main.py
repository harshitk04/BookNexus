import os
import pandas as pd
import chromadb
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI,GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import re
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
load_dotenv()

BOOKS_CSV = "books_cleaned.csv"  
books_df = pd.read_csv(BOOKS_CSV)

DB_PATH = "../chroma_storage"
chroma_client = chromadb.PersistentClient(path=DB_PATH)
collection = chroma_client.get_or_create_collection(name="books_collection")

llm = ChatGoogleGenerativeAI(
    temperature=0.5,
    model="gemini-2.0-flash-lite-preview-02-05"
)

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5


def retrieve_semantic_recommendation(query: str, top_k: int = 5) -> pd.DataFrame:
    """Fetch the most relevant books using ChromaDB similarity search"""
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vectorstore =  Chroma(
        persist_directory="../chroma_db_book", 
        embedding_function=embeddings
        )
    
    recs = vectorstore.similarity_search(query, k=top_k)
    
    books_list = []
    for rec in recs:
        books_list.append(int(rec.page_content.strip('"').split()[0]))

    return books_df[books_df["isbn13"].isin(books_list)].head(top_k)


# Function to format books for LLM
def retrieve_books_for_llm(query: str, top_k: int = 5):
    a = retrieve_semantic_recommendation(query, top_k)
    books_list = []
    for i in range(len(a)):
        book_info = {
            "title": a.iloc[i]["title"],
            "description": a.iloc[i]["tagged_description"],
            "thumbnail": a.iloc[i]["thumbnail"]  # Add thumbnail URL
        }
        books_list.append(book_info)
    return books_list


# Function to generate response using LLM
def generate_response(query: str):
    retrieved_books = retrieve_books_for_llm(query, top_k=5)
    
    # Prepare text for LLM
    books_text = "\n\n".join([
        f"TITLE OF THE BOOK IS: {book['title']}, "
        f"AND NOW ITS THE DESCRIPTION: {book['description']}"
        for book in retrieved_books
    ])

    prompt = PromptTemplate.from_template("""
    You are a knowledgeable and friendly book recommendation assistant. 
    Your goal is to help users find books they'll love based on their preferences. 
    Be like a bookworm—give users the experience of talking to a fellow book lover. 
    Do not provide a link to purchase.

    **User Query:** {query}
    
    **Available Book Information:**
    **RECOMMENDED BOOKS**
    {retrieved_books}
    
    Strictly tell the user the title of the book and the description of the book. 
    Be creative in your recommendations - don't print ISBN numbers and make the description unique through your style.
    
    The format should be strictly like this only:
    TITLE: [book title]
    DESCRIPTION: [your creative description] Strictly be creative like a bookworm
    """)

    chain = prompt | llm

    response = chain.invoke({
        "retrieved_books": books_text,
        "query": query
    })
    
    return {
        "text_response": response.content,
        "books": retrieved_books  
    }

import re

def clean_text(text):
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'^\s*\*+', '', text, flags=re.MULTILINE)
    return text

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/recommend-books")
def recommend_books(request: QueryRequest):
    response = generate_response(request.query)
    formatted_text = clean_text(response["text_response"])
    
    return {
        "recommendations": formatted_text,
        "books": [
            {
                "title": book["title"],
                "thumbnail": book["thumbnail"],
                "original_description": book["description"]
            }
            for book in response["books"]
        ]
    }


@app.post("/generate-description")
def generate_description(request: QueryRequest):
    description = request.query
    
    prompt = PromptTemplate.from_template("""
    Rewrite the following book description to make it more captivating and vivid, 
    while preserving the original meaning. Use a {style} style and {tone} tone. Enhance it significantly:
    Original Description:
    {description}
    
    Enhanced Description:
    """)


    chain = prompt | llm

    response = chain.invoke({
        "description": description,
        "style": "descriptive", 
        "tone": "poetic"        
    })
    
    formatted_text = clean_text(response.content)

    return {
        "enhanced": formatted_text
    }
    
    
@app.post("/recommendation_on_bookid")  
def recommend_books_on_bookid(request: QueryRequest):
    """Get book recommendations based on a book description"""
    try:
        prompt = PromptTemplate.from_template("""
        Only single query should be given, no other options
        Convert the following book description into a short, concise query
        suitable for a book recommendation system. Focus on the key themes, 
        genres, or elements that would help find similar books. 
        
        Original Description:
        {description}
        
        Recommendation Query:
        """)
        
        chain = prompt | llm
        response = chain.invoke({
            "description": request.query,
        })
        search_query = clean_text(response.content)
        recommendations = retrieve_semantic_recommendation(search_query, request.top_k)
        recommended_books = []
        
        # Use enumerate to get both index and row
        for index, (_, row) in enumerate(recommendations.iterrows(), start=1):
            recommended_books.append({
                "book_id": index,  # Now using the proper index
                "title": row["title"],
                "author": row["authors"] if "authors" in row else "Unknown",
                "thumbnail": row["thumbnail"],
                "genres": row["genres"].split("|") if "genres" in row and pd.notna(row["genres"]) else [],
            })
        
        return {
            "search_query": search_query,
            "recommendations": recommended_books,
            "count": len(recommended_books)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating recommendations: {str(e)}"
        )