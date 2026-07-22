import { Router, Request, Response } from "express";
import { pool } from "../db";
import { MODEL_ID } from "../config";

const router = Router();

router.get("/health", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ status: "ok", db: "up", model: MODEL_ID });
  } catch (err) {
    return res.status(503).json({ status: "error", db: "down", model: MODEL_ID });
  }
});

export default router;
