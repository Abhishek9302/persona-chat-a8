import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { pool } from "./db";
import { PORT, ALLOWED_ORIGINS } from "./config";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";

const app = express();

app.use(
  cors({
    origin: ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS : true,
    credentials: true,
  })
);
app.use(express.json());

app.use("/", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

async function initSchema() {
  const candidates = [
    path.join(__dirname, "../../database/schema.sql"),
    path.join(__dirname, "../../../database/schema.sql"),
    path.join(process.cwd(), "database/schema.sql"),
  ];

  for (const candidate of candidates) {
    try {
      const sql = await fs.readFile(candidate, "utf8");
      await pool.query(sql);
      console.log(`Applied schema from ${candidate}`);
      return;
    } catch (err: any) {
      if (err.code !== "ENOENT") {
        console.error("Schema init error:", err);
        throw err;
      }
    }
  }

  throw new Error("database/schema.sql not found");
}

async function main() {
  await initSchema();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend listening on 0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
