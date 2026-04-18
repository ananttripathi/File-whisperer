print("==> importing fastapi")
from fastapi import FastAPI
print("==> importing cors")
from fastapi.middleware.cors import CORSMiddleware
print("==> importing dotenv")
from dotenv import load_dotenv
print("==> importing routers")
from routers import upload, chat
print("==> all imports done")

load_dotenv()

app = FastAPI(title="File Whisperer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(chat.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
