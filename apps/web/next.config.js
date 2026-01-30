import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
    transpilePackages: ["@repo/ui", "@repo/dto"],
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@nestjs/swagger': path.resolve(__dirname, '../../packages/dto/src/shim.ts'),
        };
        return config;
    },
};

export default nextConfig;
