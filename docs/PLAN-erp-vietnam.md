# Implementation Plan - ERP & Inventory System (Vietnam)

## Goal
Build a scalable, multi-warehouse ERP & Inventory Management System tailored for Vietnam, adhering to **VAS (Vietnamese Accounting Standards)** and enabling **E-Invoice integration**.

## Tech Stack
- **Monorepo**: Turborepo
- **Frontend**: Next.js (App Router), React, Zustand, Tanstack Query, ShadCN UI, Framer Motion, Three.js/R3F (for 3D viz).
- **Backend**: NestJS (Modular Monolith), Fastify adapter (optional).
- **Database**: PostgreSQL (Prisma ORM).
- **Cache/Queue**: Redis.
- **Infrastructure**: Docker Compose.

## Architecture Guidelines
- **Domain-Driven Design (DDD)**: Clear separation of bounded contexts (Inventory, Accounting, IAM).
- **Clean Architecture**: Application Core independent of frameworks.
- **Modules**:
    - `IAM`: Auth, Users, Roles (RBAC).
    - `Catalog`: Products, Variants, UOM.
    - `Inventory`: Stock, Warehouses, Movements, Lots/Batches.
    - `Accounting`: COA (VAS 200), Journals, Posting Rules.
    - `Invoicing`: E-Invoice connectors.

## User Review Required
> [!IMPORTANT]
> **Database Choice**: Defaulting to **PostgreSQL** due to strong relational data requirements for Accounting/ERP.
> **VAS Compliance**: The system will default to **Circular 200** (Enterprise) Chart of Accounts.

## Proposed Changes

### Phase 1: Foundation (Infrastructure)

#### [NEW] [apps/api]
- Initialize NestJS application.
- Set up **ConfigModule** and **PrismaModule**.
- Set up **Swagger** content.

#### [NEW] [packages/database]
- Create shared Prisma library.
- Define initial `schema.prisma` with User/Tenant models.

#### [NEW] [docker-compose.yml]
- Postgres 16 container.
- Redis 7 container.

### Phase 2: Core Domain - Inventory

#### [MODIFY] [packages/database/schema.prisma]
- Add models: `Product`, `Variant`, `UOM`, `Warehouse`, `Location`, `Stock`, `StockMovement`, `Batch`.

#### [NEW] [apps/api/src/modules/inventory]
- Services for inbound/outbound operations.
- FIFO/LIFO costing logic hooks.

### Phase 3: Core Domain - Accounting (VAS)

#### [NEW] [apps/api/src/modules/accounting]
- **ChartOfAccounts**: Seed data for Circular 200.
- **JournalEntry**: Double-entry bookkeeping engine.
- **GlPostingService**: Event listener to auto-post from Inventory events (e.g., Goods Receipt -> Dr Inventory / Cr Clearing).

### Phase 4: Frontend (Web)

#### [MODIFY] [apps/web]
- Install `shadcn/ui`, `framer-motion`, `zustand`.
- Create Layouts: `DashboardLayout`, `AuthLayout`.
- Implement `Tanstack Query` provider.

#### [NEW] [apps/web/features/dashboard]
- Widgets for "Low Stock", "Pending Orders".

#### [NEW] [apps/web/features/3d-viz]
- R3F Canvas for 3D Landing Page / Warehouse demo.

## Verification Plan

### Automated Tests
- **Unit Tests**: Jest for NestJS services (Accounting logic is critical).
- **Integration Tests**: Supertest for API endpoints.
- **E2E Tests**: Playwright for critical user flows (Create Order -> Check Stock -> Generate Invoice).

### Manual Verification
1. **Docker Up**: Run `docker-compose up -d` and ensure DB/Redis connect.
2. **Auth Flow**: Register/Login and get JWT.
3. **Inventory Flow**: Create Product -> Receipt Goods -> Check Stock Level.
4. **Accounting Check**: Verify Journal Entry created for Goods Receipt.
5. **3D Demo**: Check landing page renders 3D element.
