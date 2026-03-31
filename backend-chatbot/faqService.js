import { db } from "./db1.js";

export async function findBestAnswer(embedding) {
  const embeddingString = `[${embedding.join(",")}]`;

  const query = `
    SELECT id, question, answer
    FROM faq
    ORDER BY embedding <-> $1::vector
    LIMIT 1;
  `;

  const result = await db.query(query, [embeddingString]);

  return result.rows[0];
}
