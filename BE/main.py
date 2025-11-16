from fastapi import FastAPI
from localLLM import localRouter

app = FastAPI()

app.include_router(localRouter)

@app.get("/")
async def root():
    return {"message": "Hello World"}