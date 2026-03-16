import path from "node:path";
import { config } from "dotenv";
import type { NextConfig } from "next";

// Load .env.local so GEMINI_API_KEY is available in API routes
config({ path: path.join(process.cwd(), ".env.local") });

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
