import httpx

EMBED_MODEL = "embedding-001"
EMBED_DIM = 768
BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent"


def _embed_single(text: str, task_type: str, api_key: str) -> list[float]:
    payload = {
        "model": "models/embedding-001",
        "content": {"parts": [{"text": text}]},
        "taskType": task_type,
    }
    resp = httpx.post(f"{BASE_URL}?key={api_key}", json=payload, timeout=60)
    resp.raise_for_status()
    return resp.json()["embedding"]["values"]


def embed_texts(texts: list[str], api_key: str) -> list[list[float]]:
    return [_embed_single(t, "RETRIEVAL_DOCUMENT", api_key) for t in texts]


def embed_query(query: str, api_key: str) -> list[float]:
    return _embed_single(query, "RETRIEVAL_QUERY", api_key)
