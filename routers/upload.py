from fastapi import APIRouter, UploadFile, File, Header, HTTPException
from langchain_text_splitters import RecursiveCharacterTextSplitter
from services.parser import parse_file
from services.embeddings import embed_texts
from services import vector_store
import uuid

router = APIRouter()

splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)

ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}
ALLOWED_EXTS = {".pdf", ".docx", ".txt"}


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    x_api_key: str = Header(..., alias="x-api-key"),
):
    from pathlib import Path

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTS:
        raise HTTPException(400, f"Unsupported file type. Allowed: PDF, DOCX, TXT")

    contents = await file.read()
    if len(contents) > 20 * 1024 * 1024:
        raise HTTPException(400, "File too large. Max 20MB.")

    try:
        text = parse_file(contents, file.filename)
    except Exception as e:
        raise HTTPException(422, f"Could not parse file: {e}")

    if not text.strip():
        raise HTTPException(422, "File appears to be empty or unreadable.")

    chunks = splitter.split_text(text)
    if not chunks:
        raise HTTPException(422, "No content extracted from file.")

    try:
        embeddings = embed_texts(chunks, x_api_key)
    except Exception as e:
        raise HTTPException(502, f"Embedding failed: {e}")

    document_id = str(uuid.uuid4())

    try:
        vector_store.upsert_chunks(document_id, file.filename, chunks, embeddings)
    except Exception as e:
        raise HTTPException(502, f"Failed to store document: {e}")

    return {"document_id": document_id, "filename": file.filename, "chunks": len(chunks)}
