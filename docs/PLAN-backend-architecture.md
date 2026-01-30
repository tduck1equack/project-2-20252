# 🏗️ Plan: Backend Architecture Refactor & Enhancement

## 🎯 Goals
1.  **Centralize Infrastructure**: Move external services (Prisma, Redis) to `InfrastructureModule`.
2.  **Standardize Integration**: Guide for adding new services (GarageHQ, MinIO).
3.  **Architecture Upgrade**: Proposal for Repository & UseCase patterns.
4.  **UX Enhancement**: Live Monitor (Real-time).

---

## 📦 Phase 1: Infrastructure Refactor (Immediate)
**Goal:** Clean up `providers` and `redis` folders into a cohesive module.

- [ ] **Create `InfrastructureModule`** (`apps/api/src/modules/infrastructure`)
- [ ] **Migrate Prisma**
    - Move `providers/prisma.service.ts` -> `modules/infrastructure/prisma/prisma.service.ts`
    - Update all imports.
- [ ] **Migrate Redis**
    - Move `redis/*` -> `modules/infrastructure/redis/`
    - Update all imports.
- [ ] **Documentation**
    - Create `docs/INTEGRATION-GUIDE.md`: How to add generic external services.

## 🏛️ Phase 2: Repository & UseCase Pattern (Proposal)
**Goal:** Decouple Business Logic from ORM.

- [ ] **Abstract Repositories**
    - Create `ProductRepository` interface.
    - Implement `PrismaProductRepository`.
    - Update `InventoryModule` to use Repository.
- [ ] **UseCase Pattern**
    - Implement `CreateStockMovementUseCase`.
    - Isolate logic from Controller.

## ⚡ Phase 3: Real-Time & UX (Proposal)
**Goal:** Immediate feedback for Inventory changes.

- [ ] **WebSocket Gateway**
    - Create `InventoryGateway` (Socket.io).
    - Events: `stock:updated`, `movement:created`.
- [ ] **Live Monitor Service**
    - Emit events when `StockService` updates data.
- [ ] **Frontend Subscription**
    - `useStockSocket()` hook.
    - Toast notifications or Auto-refresh React Query.

---

## 📝 Execution Strategy
1.  **Execute Phase 1** (Refactor).
2.  **Execute Phase 2** (POC on Inventory).
3.  **Execute Phase 3** (POC on Stock Updates).

**Do you approve implementing Phase 1 immediately? And should we proceed with Phase 2/3?**
