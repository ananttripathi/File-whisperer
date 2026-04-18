from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from services.embeddings import embed_query
from services import vector_store
import httpx

router = APIRouter()

CHAT_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

SYSTEM_PROMPT = """You are a helpful assistant that answers questions strictly based on the provided document excerpts.
If the answer is not found in the excerpts, say "I couldn't find that in the document."
Always be concise and cite relevant information from the excerpts."""


class ChatRequest(BaseModel):
    document_id: str
    question: str
    history: list[dict] = []


class Source(BaseModel):
    content: str
    chunk_index: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]


@router.post("/chat", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    x_api_key: str = Header(..., alias="x-api-key"),
):
    if not req.question.strip():
        raise HTTPException(400, "Question cannot be empty.")

    try:
        query_embedding = embed_query(req.question, x_api_key)
    except Exception as e:
        raise HTTPException(502, f"Embedding failed: {e}")

    matches = vector_store.similarity_search(req.document_id, query_embedding, top_k=5)
    if not matches:
        raise HTTPException(404, "Document not found or no relevant content.")

    context = "\n\n---\n\n".join(
        f"[Excerpt {i+1}]:\n{m['content']}" for i, m in enumerate(matches)
    )

    prompt = f"{SYSTEM_PROMPT}\n\nDocument excerpts:\n\n{context}\n\nQuestion: {req.question}"

    try:
        payload = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}]
        }
        resp = httpx.post(
            f"{CHAT_URL}?key={x_api_key}",
            json=payload,
            timeout=60,
        )
        resp.raise_for_status()
        answer = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        raise HTTPException(502, f"LLM request failed: {e}")

    sources = [
        Source(content=m["content"], chunk_index=m["chunk_index"]) for m in matches
    ]

    return ChatResponse(answer=answer, sources=sources)
