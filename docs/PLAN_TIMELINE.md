# 📅 Project Timeline & Plan

> Last Updated: 2026-01-31

## 📜 History & Milestones

### ✅ Phase 1: Foundation, Auth & UI (Completed)
- **Goal**: Establish core architecture, secure RBAC, and UI Design System.
- **Delivered**:
  - **Core**: Turborepo, NestJS, Prisma, Redis, Docker structure.
  - **Auth**: JWT Access/Refresh setup, Redis Blacklist.
  - **RBAC**: Guards & Roles (Admin, Manager, Employee, Customer).
  - **UI**: Tailwind Design System (OLED Dark Mode), Glassmorphism Components, Dashboard Layouts.
  - **Docs**: OpenAPI/Swagger setup.

### ✅ Phase 2: Inventory Architecture Refactor (Completed: 2026-01-31)
- **Goal**: Decouple modules using Repository Pattern & clean dependencies.
- **Delivered**:
  - `ProductRepository`, `StockRepository` (Explicit Interfaces).
  - `CreateStockMovementUseCase` (Transaction support).
  - Decoupled `PrismaService` from Controllers.
  - Fixed Dependencies (Removed `@prisma/client` from API).

### ✅ Phase 3: Real-time Features (Completed: 2026-01-31)
- **Goal**: Instant inventory updates via WebSockets.
- **Delivered**:
  - **Infrastructure**: Socket.io Gateway, WsAuthGuard.
  - **Flow**: `CreateStockMovementUseCase` emits `stock.updated`.
  - **UI**: `SocketProvider` & `useInventorySocket` (Auto-invalidates React Query).

---

## 📍 Current Status: Phase 4 (Customer Experience)

**Goal**: Transform the Customer Portal into a functional ordering system.

### 📋 Checklist
- [ ] **Data Access**
  - [ ] `ProductQueryRepository`: Optimized read-only queries for catalog.
- [ ] **Frontend (Customer)**
  - [ ] **Product Catalog**: Grid view with images, price, availability.
  - [ ] **Shopping Cart**: Client-side (Zustand + LocalStorage).
  - [ ] **Checkout Flow**: 
    - [ ] Review Items.
    - [ ] Submit Order (Create `SalesOrder`).
- [ ] **Backend**
  - [ ] `SalesOrder` Schema & Service.
  - [ ] `CreateOrderUseCase` (Reduces Stock? Or reserves?).

---

## 🔮 Future Roadmap

### Phase 5: Reporting & Analytics
- [ ] Stock Velocity Reports.
- [ ] Financial Reports (VAS Accounting).

### Phase 6: Production Readiness
- [ ] CI/CD Pipelines.
- [ ] E2E Testing Suite (Playwright).
