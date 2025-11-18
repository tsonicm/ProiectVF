from fastapi import FastAPI
from localLLM import localRouter
from onlineLLM import onlineRouter

app = FastAPI()

app.include_router(localRouter)
app.include_router(onlineRouter)

@app.get("/")
async def root():
    return {"message": "Hello World"}