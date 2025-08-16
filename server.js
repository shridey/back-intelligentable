import express from "express";
import cors from "cors";
import { Ollama } from "ollama";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));

app.post("/intelligentable/askAI", async (req, res) => {
  const ollama = new Ollama({ host: "http://127.0.0.1:11434" });

  try {
    const { model, prompt, data } = req.body;

    console.log("Received request:", { model, prompt, data });

    const systemPrompt = `You are a helpful data assistant. Here is the dataset in JSON:
${JSON.stringify(data)}

Question: ${prompt}

Answer clearly and concisely based only on the data.`;

    const response = await ollama.chat({
      model: model || "mistral:7b", // ✅ make sure it matches "ollama list"
      messages: [{ role: "user", content: systemPrompt }],
      stream: false,
    });

    console.log("AI response:", response);

    const answer = response.message.content;

    if (!answer) {
      console.error("No answer provided by AI");
      return res.status(500).json({ error: "AI did not provide an answer" });
    }

    res.json({ answer });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI processing failed" });
  }
});

app.listen(3000, "0.0.0.0", () =>
  console.log("AI backend running on http://0.0.0.0:3000")
);
