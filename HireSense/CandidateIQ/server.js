import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qdvdjtvscojzamaqteyq.supabase.co",
  "sb_publishable_-bLmVv7f2_FFdStXxsLkgQ_wB2Ulxp-" // keep simple (no service role needed for now)
);

app.post("/chat", async (req, res) => {
  try {
    const { messages, systemPrompt, userId } = req.body;

    // ✅ 1. Fetch resume (simple)
    let resumeText = "";

    if (userId) {
      const { data } = await supabase
        .from("sessions")
		.select("resume_text")
		.eq("candidate_id", userId)
		.order("created_at", { ascending: false })
		.limit(1)
		.maybeSingle();
      resumeText = data?.resume_text || "";
    }

    // ✅ 2. Merge into system prompt
    const finalSystemPrompt = `
${systemPrompt || ""}

${resumeText ? `CANDIDATE RESUME:\n${resumeText}` : "No resume available."}
`;

    // 🔥 Normalize roles
    const safeMessages = (messages || []).map(m => ({
      role: m.role === "ai" ? "assistant" : m.role,
      content: m.content || ""
    }));

    const input = [
      { role: "system", content: finalSystemPrompt },
      ...safeMessages
    ];

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: input
    });

    res.json({
      reply: response.output_text
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));