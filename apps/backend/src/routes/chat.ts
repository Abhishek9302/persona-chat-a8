import { Router, Response } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { MODEL_ID, HUGGINGFACE_TOKEN, LLM_PROVIDER } from "../config";

const router = Router();

const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";

router.post(
  "/",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    if (LLM_PROVIDER !== "huggingface" || !HUGGINGFACE_TOKEN) {
      return res
        .status(503)
        .json({ error: "Hugging Face inference is not configured" });
    }

    try {
      const hfRes = await fetch(HF_CHAT_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [{ role: "user", content: message }],
          max_tokens: 512,
        }),
      });

      if (!hfRes.ok) {
        const detail = await hfRes.text();
        return res.status(502).json({
          error: "Hugging Face inference failed",
          detail,
        });
      }

      const data = (await hfRes.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) {
        return res.status(502).json({
          error: "Hugging Face inference returned empty response",
        });
      }

      return res.json({ reply });
    } catch (err) {
      console.error("chat inference error", err);
      return res.status(500).json({ error: "inference error" });
    }
  }
);

export default router;
