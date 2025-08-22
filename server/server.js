import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://vibe-code-ai-three.vercel.app/", // replace with your real Vercel domain
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";


app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await axios.post(
      `${BASE_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );
    res.json({text:response.data.candidates[0].content.parts[0].text});
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})
