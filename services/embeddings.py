import httpx

EMBED_MODEL = "text-embedding-004"
EMBED_DIM = 768
EMBED_URL = "https://generativelanguage.googleapis.com/v1/models/text-embedding-004:batchEmbedContents"
CHAT_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"


def embed_texts(texts: list[str], api_key: str) -> list[list[float]]:
    payload = {
        "requests": [
            {
                "model": f"models/{EMBED_MODEL}",
                "content": {"parts": [{"text": t}]},
                "taskType": "RETRIEVAL_DOCUMENT",
            }
            for t in texts
        ]
    }
    resp = httpx.post(f"{EMBED_URL}?key={api_key}", json=payload, timeout=60)
    resp.raise_for_status()
    return [e["values"] for e in resp.json()["embeddings"]]


def embed_query(query: str, api_key: str) -> list[float]:
    payload = {
        "requests": [
            {
                "model": f"models/{EMBED_MODEL}",
                "content": {"parts": [{"text": query}]},
                "taskType": "RETRIEVAL_QUERY",
            }
        ]
    }
    resp = httpx.post(f"{EMBED_URL}?key={api_key}", json=payload, timeout=60)
    resp.raise_for_status()
    return resp.json()["embeddings"][0]["values"]
