# 🔌 Infrastructure Integration Guide

This guide explains how to integrate external services (like MinIO, GarageHQ, Stripe) into the `InfrastructureModule`.

## 🏗️ Architecture
The `InfrastructureModule` (`apps/api/src/modules/infrastructure`) is the **single point of entry** for all external technology adapters. It is a `@Global()` module, meaning its exports are available application-wide without repeated imports.

### Directory Structure
```
apps/api/src/modules/infrastructure/
├── infrastructure.module.ts  # Main module ref
├── prisma/                   # DB Adapter
├── redis/                    # Cache Adapter
└── <your-service>/           # New Service
    ├── <service>.module.ts
    └── <service>.service.ts
```

## 🚀 How to Add a New Service

### Step 1: Create Directory
Create a folder for your service in `apps/api/src/modules/infrastructure/`.
*Example: `minio`*

### Step 2: Implement Module & Service
Define your module. If it needs to be available everywhere, you can make it Global or export it via `InfrastructureModule`.

```typescript
// apps/api/src/modules/infrastructure/minio/minio.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class MinioService {
    uploadFile(file: any) {
        // Implementation
    }
}
```

```typescript
// apps/api/src/modules/infrastructure/minio/minio.module.ts
import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';

@Module({
    providers: [MinioService],
    exports: [MinioService], // Export so InfrastructureModule can re-export
})
export class MinioModule {}
```

### Step 3: Register in InfrastructureModule
Import your module into `infrastructure.module.ts` and export it (or its service).

```typescript
// apps/api/src/modules/infrastructure/infrastructure.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RedisModule } from './redis/redis.module';
import { MinioModule } from './minio/minio.module'; // Import

@Global()
@Module({
    imports: [RedisModule, MinioModule], // Import
    providers: [PrismaService],
    exports: [PrismaService, RedisModule, MinioModule], // Re-export
})
export class InfrastructureModule {}
```

### Step 4: Configuration
Ensure you use `@repo/config` to access environment variables. Do NOT hardcode credentials.

## 🤝 Example: GarageHQ Integration
1. Create `garage-hq` folder.
2. Create `GarageHQService` to wrap their API.
3. Use `HttpModule` (from `@nestjs/axios`) inside `GarageHQModule`.
4. Register in `InfrastructureModule`.

## 🎯 Best Practices
- **Abstraction**: Don't expose strict implementation details if possible. Return standard DTOs.
- **Error Handling**: Catch external errors and throw application-specific exceptions (e.g., `ServiceUnavailableException`).
- **Interfaces**: For complex services (like Storage), define an interface so you can swap S3 for MinIO easily.
