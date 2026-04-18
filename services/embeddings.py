import google.generativeai as genai
import os

EMBED_MODEL = "models/embedding-001"
EMBED_DIM = 768


def configure(api_key: str):
    genai.configure(api_key=api_key)


def embed_texts(texts: list[str], api_key: str) -> list[list[float]]:
    configure(api_key)
    result = genai.embed_content(
        model=EMBED_MODEL,
        content=texts,
        task_type="retrieval_document",
    )
    return result["embedding"] if isinstance(texts, str) else result["embedding"]


def embed_query(query: str, api_key: str) -> list[float]:
    configure(api_key)
    result = genai.embed_content(
        model=EMBED_MODEL,
        content=query,
        task_type="retrieval_query",
    )
    return result["embedding"]
