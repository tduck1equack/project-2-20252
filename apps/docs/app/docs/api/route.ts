import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
    url: "http://localhost:3002/api-json",
    theme: "kepler" as const,
});
