import ollama
import os
from fastapi import APIRouter
from models import Query
from dotenv import load_dotenv

load_dotenv()

model = os.getenv('OLLAMA_MODEL', 'gemma3:latest')

localRouter = APIRouter(
    prefix="/api/ollama",
    tags=["ollama"]
)

@localRouter.get("/test")
async def test():
    response: ollama.ChatResponse = ollama.chat(model=model, messages=[{
        'role': 'user',
        'content': 'Respond with the following: LLM is running successfully on Ollama!'
    }])
    return {
        "message": response.message.content
    }

@localRouter.post("/chat")
async def chat(query: Query):
    res: ollama.ChatResponse = ollama.chat(
        model=model,
        messages=[{
            'role': 'user',
            'content': query.message
        }]
    )

    return {
        "message": res.message.content
    }