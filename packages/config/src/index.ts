import { z } from "zod";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const server = z.object({
    // Database
    DATABASE_URL: z.string().url(),
    POSTGRES_USER: z.string().default("postgres"),
    POSTGRES_PASSWORD: z.string().default("postgres"),
    POSTGRES_DB: z.string().default("project_2"),
    POSTGRES_PORT: z.coerce.number().default(5432),

    // Application Ports
    API_PORT: z.coerce.number().default(3002),
    WEB_PORT: z.coerce.number().default(3000),
    DOCS_PORT: z.coerce.number().default(3001),

    // Environment
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    // Security
    JWT_SECRET: z.string().min(1).default("super-secret"),

    // Redis
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().default(6379),
});

const client = z.object({
    // Add NEXT_PUBLIC_ variables here
});

const processEnv = {
    DATABASE_URL: process.env.DATABASE_URL,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    API_PORT: process.env.API_PORT,
    WEB_PORT: process.env.WEB_PORT,
    DOCS_PORT: process.env.DOCS_PORT,
    NODE_ENV: process.env.NODE_ENV,
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
