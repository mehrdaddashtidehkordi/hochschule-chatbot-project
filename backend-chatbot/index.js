import express from "express";
import { getEmbedding } from "./embedd_file.js";
import { findBestAnswer } from "./faqServices.js";

const app = express();
app.use(express.json());

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "question is required" });
    }

    const embedding = await getEmbedding(question);

    const best = await findBestAnswer(embedding);

    if (!best) {
      return res.json({
        answer: "No any answer found",
      });
    }

    res.json({
      question: best.question,
      answer: best.answer,
      id: best.id,
    });
  } catch (err) {
    console.error("Error in /ask:", err);
    res.status(500).json({ error: "internal error" });
  }
});

app.listen(****, () => {
  console.log("Chatbot running on http://localhost:****");
});
