import express from "express";
import { getEmbedding } from "./embedding.js";
import { findBestAnswer } from "./faqService.js";

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
        answer: "متأسفانه پاسخی پیدا نشد.",
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

app.listen(3000, () => {
  console.log("Chatbot running on http://localhost:3000");
});