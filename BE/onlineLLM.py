import os
from fastapi import APIRouter, HTTPException
from models import Query
from dotenv import load_dotenv

load_dotenv()

onlineRouter = APIRouter(prefix="/api", tags=["gemini", "openai"])

geminiKey = os.getenv("GEMINI_API_KEY", "").strip()
geminiModel = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()

openaiKey = os.getenv("OPENAI_API_KEY", "").strip()
openaiModel = os.getenv("OPENAI_MODEL", "gpt-5-nano").strip()


def get_gemini_client():
    if not geminiKey:
        raise HTTPException(
            status_code=400,
            detail="GEMINI_API_KEY is missing. Put it in .env to use Gemini endpoints.",
        )
    from google import genai
    return genai.Client(api_key=geminiKey)


def get_openai_client():
    if not openaiKey:
        raise HTTPException(
            status_code=400,
            detail="OPENAI_API_KEY is missing. Put it in .env to use OpenAI endpoints.",
        )
    from openai import OpenAI
    return OpenAI(api_key=openaiKey)


@onlineRouter.get("/gemini/test")
async def testGemini():
    client = get_gemini_client()
    response = client.models.generate_content(
        model=geminiModel,
        contents="Respond with the following: Successfully connected to Gemini!",
    )
    return {"message": response.text}


@onlineRouter.post("/gemini/chat")
async def chatGemini(query: Query):
    client = get_gemini_client()
    response = client.models.generate_content(model=geminiModel, contents=query.message)
    return {"message": response.text}


@onlineRouter.get("/openai/test")
async def testOpenAI():
    client = get_openai_client()
    response = client.responses.create(
        model=openaiModel,
        input="Respond with the following: Successfully connected to ChatGPT!",
    )
    return {"message": response.text}


@onlineRouter.post("/openai/chat")
async def chatOpenAI(query: Query):
    client = get_openai_client()
    response = client.responses.create(model=openaiModel, input=query.message)
    return {"message": response.text}
