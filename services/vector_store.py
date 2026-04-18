from supabase import create_client, Client
import os


def get_client() -> Client:
    return create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_KEY"],
    )


def upsert_chunks(
    document_id: str,
    filename: str,
    chunks: list[str],
    embeddings: list[list[float]],
):
    client = get_client()
    rows = [
        {
            "document_id": document_id,
            "filename": filename,
            "content": chunk,
            "embedding": embedding,
            "chunk_index": i,
        }
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))
    ]
    client.table("chunks").upsert(rows).execute()


def similarity_search(
    document_id: str,
    query_embedding: list[float],
    top_k: int = 5,
) -> list[dict]:
    client = get_client()
    result = client.rpc(
        "match_chunks",
        {
            "query_embedding": query_embedding,
            "match_document_id": document_id,
            "match_count": top_k,
        },
    ).execute()
    return result.data or []


def delete_document(document_id: str):
    client = get_client()
    client.table("chunks").delete().eq("document_id", document_id).execute()
