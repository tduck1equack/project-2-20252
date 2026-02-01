import createNextIntlPlugin from 'next-intl/plugin';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui", "@repo/dto"],

    // Turbopack config (Next.js 16+ default)
    turbopack: {
        resolveAlias: {
            // Relative path from apps/web to packages/dto/src/shim.ts
            '@nestjs/swagger': '../../packages/dto/src/shim.ts',
        },
    },

    // Webpack config (for production builds)
    webpack: (config, { isServer }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@nestjs/swagger': resolve(__dirname, '../../packages/dto/src/shim.ts'),
        };
        return config;
    },
};

export default withNextIntl(nextConfig);
