export const PORT = Number(process.env.PORT || "8080");
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .filter(Boolean);
export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
export const LLM_PROVIDER = process.env.LLM_PROVIDER || "huggingface";
export const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN || "";
export const FINE_TUNED_MODEL_ID = process.env.FINE_TUNED_MODEL_ID;
export const HF_MODEL_ID = process.env.HF_MODEL_ID;
export const MODEL_ID =
  FINE_TUNED_MODEL_ID || HF_MODEL_ID || "meta-llama/Llama-3.1-8B-Instruct";
