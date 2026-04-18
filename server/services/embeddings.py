from google import genai
from google.genai import types

EMBED_MODEL = "text-embedding-004"
EMBED_DIM = 768


def _client(api_key: str):
    return genai.Client(api_key=api_key)


def embed_texts(texts: list[str], api_key: str) -> list[list[float]]:
    client = _client(api_key)
    result = client.models.embed_content(
        model=EMBED_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT"),
    )
    return [e.values for e in result.embeddings]


def embed_query(query: str, api_key: str) -> list[float]:
    client = _client(api_key)
    result = client.models.embed_content(
        model=EMBED_MODEL,
        contents=[query],
        config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY"),
    )
    return result.embeddings[0].values
