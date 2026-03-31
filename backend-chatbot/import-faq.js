import fs from "fs";
import path from "path";
import axios from "axios";
import pg from "pg";

const { Client } = pg;

const DB_CONFIG = {
  host: "",     
  port: ****,
  user: "",
  password: "",
  database: "",
};

const EMBEDDING_SERVICE_URL = "http://localhost:***/embed"; 

async function main() {
  const client = new Client(DB_CONFIG);
  await client.connect();

  const filePath = path.join(process.cwd(), "yourfaqfile.json");
  const raw = fs.readFileSync(filePath, "utf8");
  const faqs = JSON.parse(raw);

  console.log(`Loaded ${faqs.length} FAQs from yourfaqfile.json`);

  await client.query("DELETE FROM faqtable;");

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
