import os
from google import genai
from openai import OpenAI
from fastapi import APIRouter
from models import Query
from dotenv import load_dotenv

load_dotenv()

onlineRouter = APIRouter(
    prefix="/api",
    tags=["gemini", "openai"]
)

geminiKey = os.getenv("GEMINI_API_KEY", "")
geminiModel = os.getenv("GEMINI_MODEL", "")
googleClient = genai.Client(api_key=geminiKey)

openaiKey = os.getenv("OPENAI_API_KEY", "")
openaiModel = os.getenv("OPENAI_MODEL", "")
openaiClient = OpenAI(api_key=openaiKey)

@onlineRouter.get("/gemini/test")
async def testGemini():
    response = googleClient.models.generate_content(
        model=geminiModel,
        contents="Respond with the following: Successfully connected to Gemini!"
    )
    return {
        "message": response.text
    }

@onlineRouter.post("/gemini/chat")
async def chatGemini(query: Query):
    response = googleClient.models.generate_content(
        model=geminiModel,
        contents=query.message
    )
    return {
        "message": response.text
    }

@onlineRouter.get("/openai/test")
async def testOpenAI():
    response = openaiClient.responses.create(
        model=openaiModel,
        input="Respond with the following: Successfully connected to ChatGPT!"
    )
    return {
        "message": response.text
    }

@onlineRouter.post("/openai/chat")
async def chatOpenAI(query: Query):
    response = openaiClient.responses.create(
        model=openaiModel,
        input=query.message
    )
    return {
        "message": response.text
    }