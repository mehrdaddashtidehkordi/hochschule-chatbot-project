import axios from "axios";

const EMBEDDING_URL = "http://localhost:9000/embed"; // چون پورت 8001 اشغال بود

export async function getEmbedding(text) {
  const res = await axios.post(EMBEDDING_URL, {
    texts: text,
  });

  return res.data.embeddings[0];
}