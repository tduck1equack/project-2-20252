import { z } from "zod";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const server = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(3001),
    JWT_SECRET: z.string().min(1).default("super-secret"),
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().default(6379),
});

const client = z.object({
    // Add NEXT_PUBLIC_ variables here
});

const processEnv = {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
};

// Validate
const parsedServer = server.safeParse(processEnv);

if (!parsedServer.success) {
    console.error("❌ Invalid environment variables:", parsedServer.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
}

export const env = parsedServer.data;
