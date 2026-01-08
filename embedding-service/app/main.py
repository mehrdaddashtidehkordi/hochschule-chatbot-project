from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Union
from sentence_transformers import SentenceTransformer
import os
import sys

# UTF-8 fix for Windows/Docker
sys.stdout.reconfigure(encoding='utf-8')

app = FastAPI()

device = "cpu"

# مسیر مدل از ENV خوانده می‌شود، اگر نبود از مسیر ویندوز استفاده می‌شود
model_path = os.getenv(
    "MODEL_PATH",
    "D:/Projects/sentence_transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

model = SentenceTransformer(model_path, device=device)

class EmbedRequest(BaseModel):
    texts: Union[str, List[str]]

class EmbedResponse(BaseModel):
    embeddings: List[List[float]]

@app.post("/embed", response_model=EmbedResponse)
def embed(request: EmbedRequest):
    texts = [request.texts] if isinstance(request.texts, str) else request.texts
    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
        convert_to_numpy=True
    )
    return EmbedResponse(embeddings=embeddings.tolist())

@app.get("/health")
def health():
    return {"status": "ok", "device": device, "model_path": model_path}