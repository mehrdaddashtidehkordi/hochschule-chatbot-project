import fs from "fs";
import path from "path";
import axios from "axios";
import pg from "pg";

const { Client } = pg;

const DB_CONFIG = {
  host: "localhost",     
  port: 5432,
  user: "***",
  password: "***",
  database: "***",
};

const EMBEDDING_SERVICE_URL = "http://localhost:9000/embed"; 

async function main() {
  const client = new Client(DB_CONFIG);
  await client.connect();
  console.log("Connected to PostgreSQL");

  const filePath = path.join(process.cwd(), "faqs.json");
  const raw = fs.readFileSync(filePath, "utf8");
  const faqs = JSON.parse(raw);

  console.log(`Loaded ${faqs.length} FAQs from faqs.json`);

  await client.query("DELETE FROM faq;");
  console.log("Cleared existing rows from faq table");

  for (const [index, faq] of faqs.entries()) {
    const { question, answer } = faq;

    const embedResponse = await axios.post(EMBEDDING_SERVICE_URL, {
      texts: question,
    });

    const embedding = embedResponse.data.embeddings[0]; 

    const embeddingString = `[${embedding.join(",")}]`;
 	
    const insertQuery = `
      INSERT INTO faq (question, answer, embedding)
      VALUES ($1, $2, $3::vector)
      RETURNING id;
    `;

    const result = await client.query(insertQuery, [
      question,
      answer,
      embeddingString,
    ]);

    console.log(`Inserted FAQ #${index + 1} with id=${result.rows[0].id}`);
  }

  await client.end();
  console.log("Done. Connection closed.");
}

main().catch((err) => {
  console.error("Error in import-faq:", err);
  process.exit(1);
});