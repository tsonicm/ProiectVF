from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from toolsSuggest import router as toolsRouter
from toolsStore import router as storeRouter
from localLLM import localRouter
from onlineLLM import onlineRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(localRouter)
app.include_router(onlineRouter)
app.include_router(toolsRouter)
app.include_router(storeRouter)

@app.get("/")
async def root():
    return {"message": "Hello World"}
