CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS faq (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    embedding vector(384)
);

CREATE INDEX IF NOT EXISTS idx_faq_embedding
ON faq
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);