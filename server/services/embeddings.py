import httpx

EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBED_DIM = 384
HF_EMBED_URL = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{EMBED_MODEL}"


def embed_texts(texts: list[str], api_key: str) -> list[list[float]]:
    resp = httpx.post(
        HF_EMBED_URL,
        headers={"Authorization": f"Bearer {api_key}"},
        json={"inputs": texts},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()


def embed_query(query: str, api_key: str) -> list[float]:
    resp = httpx.post(
        HF_EMBED_URL,
        headers={"Authorization": f"Bearer {api_key}"},
        json={"inputs": [query]},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()[0]
