import express from "express";
import cors from "cors";
import { Ollama } from "ollama";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/intelligentable/askAI", async (req, res) => {
  const ollama = new Ollama({ host: "http://127.0.0.1:11434" });

  try {
    const { model, prompt, data } = req.body;

    const systemPrompt = `You are a helpful data assistant. Here is the dataset in JSON:
${JSON.stringify(data)}

Question: ${prompt}

Answer clearly and concisely based only on the data.`;

    const response = await ollama.chat({
      model: model || "mistral:7b", // ✅ make sure it matches "ollama list"
      messages: [{ role: "user", content: systemPrompt }],
      stream: false,
    });

    const answer = response.message.content;

    res.json({ answer });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI processing failed" });
  }
});

app.listen(3000, () =>
  console.log("AI backend running on http://localhost:3000")
);
