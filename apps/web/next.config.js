import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const shimPath = path.resolve(__dirname, '../../packages/dto/src/shim.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui", "@repo/dto"],

    // Turbopack config (Next.js 16+ default)
    turbopack: {
        resolveAlias: {
            '@nestjs/swagger': shimPath,
        },
    },

    // Webpack config (for production builds)
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@nestjs/swagger': shimPath,
        };
        return config;
    },
};

export default nextConfig;
