import { Router, Request, Response } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { MODEL_ID, HUGGINGFACE_TOKEN, LLM_PROVIDER } from "../config";

const router = Router();

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
      const hfRes = await fetch(
        `https://api-inference.huggingface.co/models/${MODEL_ID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: message }),
        }
      );

      if (!hfRes.ok) {
        const detail = await hfRes.text();
        return res.status(502).json({
          error: "Hugging Face inference failed",
          detail,
        });
      }

      const data = await hfRes.json();
      let reply = "";

      if (Array.isArray(data)) {
        const first = data[0];
        reply =
          typeof first === "string"
            ? first
            : first?.generated_text || JSON.stringify(first);
      } else if (data && typeof data === "object") {
        reply = data.generated_text || data.text || JSON.stringify(data);
      } else {
        reply = String(data);
      }

      return res.json({ reply });
    } catch (err) {
      console.error("chat inference error", err);
      return res.status(500).json({ error: "inference error" });
    }
  }
);

export default router;
