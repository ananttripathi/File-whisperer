-- Run this in your Supabase SQL editor

-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Create chunks table
create table if not exists chunks (
  id          uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  filename    text not null,
  content     text not null,
  embedding   vector(768),
  chunk_index integer not null,
  created_at  timestamptz default now()
);

-- 3. Index for fast vector similarity search
create index if not exists chunks_embedding_idx
  on chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 4. Index for filtering by document
create index if not exists chunks_document_id_idx on chunks (document_id);

-- 5. Similarity search function used by the backend
create or replace function match_chunks(
  query_embedding   vector(768),
  match_document_id uuid,
  match_count       int default 5
)
returns table (
  id          uuid,
  document_id uuid,
  filename    text,
  content     text,
  chunk_index integer,
  similarity  float
)
language sql stable
as $$
  select
    id,
    document_id,
    filename,
    content,
    chunk_index,
    1 - (embedding <=> query_embedding) as similarity
  from chunks
  where document_id = match_document_id
  order by embedding <=> query_embedding
  limit match_count;
$$;
