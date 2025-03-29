import os
import pandas as pd
import chromadb
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI,GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

app = FastAPI()
load_dotenv()
# Load Books Data
BOOKS_CSV = "books_cleaned.csv"  # Ensure the file is in the same directory
books_df = pd.read_csv(BOOKS_CSV)

# Initialize ChromaDB
DB_PATH = "../chroma_storage"
chroma_client = chromadb.PersistentClient(path=DB_PATH)
collection = chroma_client.get_or_create_collection(name="books_collection")

# Google Gemini API Model
llm = ChatGoogleGenerativeAI(
    temperature=0.5,
    model="gemini-2.0-flash-lite-preview-02-05"
)

# Define API request schema
class QueryRequest(BaseModel):
    query: str
    top_k: int = 5


# Function to retrieve books from ChromaDB
def retrieve_semantic_recommendation(query: str, top_k: int = 5) -> pd.DataFrame:
    """Fetch the most relevant books using ChromaDB similarity search"""
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vectorstore = Chroma(
        collection_name="books_collection",
        embedding_function=embeddings,
        persist_directory=DB_PATH,
    )
    
    recs = vectorstore.similarity_search(query, k=top_k)
    
    books_list = []
    for rec in recs:
        books_list.append(int(rec.page_content.strip('"').split()[0]))

    return books_df[books_df["isbn13"].isin(books_list)].head(top_k)


# Function to format books for LLM
def retrieve_books_for_llm(query: str, top_k: int = 5):
    retrieved_books = retrieve_semantic_recommendation(query, top_k)
    books_list = []

    for _, row in retrieved_books.iterrows():
        books_list.append(f"Title: {row['title']}, {row['tagged_description']}")

    return books_list


# Function to generate response using LLM
def generate_response(query: str):
    retrieved_books = retrieve_semantic_recommendation(query, top_k=5)

    prompt = PromptTemplate.from_template("""
    You are a knowledgeable and friendly book recommendation assistant. 
    Your goal is to help users find books they'll love based on their preferences. 
    Don't directly mention the books. Be like a bookworm—give users the experience of talking to a fellow book lover. 
    Also, provide a link to purchase each recommended book.

    **User Query:** {query}
    
    **Available Book Information:**
    {retrieved_books}

    Provide details on:
    - Title and Author
    - A brief reason why it matches their request
    - Key themes or features
    """)

    chain = prompt | llm

    response = chain.invoke({
        "retrieved_books": retrieved_books,
        "query": query
    })
    
    return response.content


# API Endpoint for Book Recommendations
@app.post("/recommend-books")
def recommend_books(request: QueryRequest):
    response = generate_response(request.query)
    return {"recommendations": response}
