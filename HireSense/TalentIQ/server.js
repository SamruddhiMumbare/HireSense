/**
 * TalentIQ — Optional Proxy Server
 *
 * Use this if you want to deploy TalentIQ for your HR team
 * without exposing the Groq API key in the browser.
 *
 * Usage:
 *   npm install
 *   cp .env.example .env   (add your Groq key)
 *   node server.js
 *   Open http://localhost:3001
 */
require("dotenv").config();

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Serve the frontend
app.use(express.static(path.join(__dirname)));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// Proxy endpoint — forwards requests to Groq API
app.post("/api/openai", async (req, res) => {
  try {
    const { messages, max_tokens, temperature } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens,
      temperature
    });

    res.json(response);
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: { message: error.message } });
  }
});

app.listen(PORT, () => {
  console.log(`✅ TalentIQ running at http://localhost:${PORT}`);
  console.log(`Model: gpt-4o-mini (OpenAI)`);
});