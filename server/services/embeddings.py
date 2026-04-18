import httpx

EMBED_MODEL = "embed-english-light-v3.0"
EMBED_DIM = 384
COHERE_EMBED_URL = "https://api.cohere.ai/v1/embed"


def embed_texts(texts: list[str], api_key: str) -> list[list[float]]:
    resp = httpx.post(
        COHERE_EMBED_URL,
        headers={"Authorization": f"Bearer {api_key}"},
        json={"texts": texts, "model": EMBED_MODEL, "input_type": "search_document"},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["embeddings"]


def embed_query(query: str, api_key: str) -> list[float]:
    resp = httpx.post(
        COHERE_EMBED_URL,
        headers={"Authorization": f"Bearer {api_key}"},
        json={"texts": [query], "model": EMBED_MODEL, "input_type": "search_query"},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["embeddings"][0]
