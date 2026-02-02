# 📅 Project Timeline & Plan

> Last Updated: 2026-02-01

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

### ✅ Phase 4: Customer Experience (Completed: 2026-01-31)
- **Goal**: Transform the Customer Portal into a functional ordering system.
- **Delivered**:
  - **Product Catalog**: Grid view with images, price, availability.
  - **Shopping Cart**: Client-side (Zustand + LocalStorage).
  - **Checkout Flow**: Order creation with `SalesOrder` schema.
  - **Order History**: Customer can view past orders.
  - **Manager Order Fulfillment**: List + Status Update endpoints.

### ✅ Phase 5: Reporting, Polish & Testing Foundation (Completed: 2026-01-31)
- **Goal**: Analytics, demo data, and E2E testing.
- **Delivered**:
  - **Reporting**: `/reports/stock-velocity`, `/reports/sales-summary` endpoints.
  - **Manager Reports Dashboard**: Interactive charts.
  - **Seed Script**: Demo Products, Users, Orders.
  - **Playwright E2E Tests**: Auth Flow, Checkout Flow.

### ✅ Phase 6: Repository & UseCase Pattern Refactoring (Completed: 2026-01-31)
- **Goal**: Clean architecture with Repository pattern across all modules.
- **Delivered**:
  - **Auth Module**: `UserRepository`, `RefreshTokenRepository`.
  - **Sales Module**: `OrderRepository` with refactored UseCases.
  - **Accounting Module**: `AccountRepository`, `JournalRepository`.

### ✅ Phase 7: API Response Standardization (Completed: 2026-01-31)
- **Goal**: Consistent API response format across all endpoints.
- **Delivered**:
  - **Enhanced `ApiResponseDto`**: Added `timestamp`, `statusCode` fields.
  - **Audited Controllers**: Auth, Product, Sales, Accounting, Reports.

### ✅ Phase 8: UI Enhancement - Dark Mode & i18n (Completed: 2026-02-01)
- **Goal**: Persistent dark mode and localization support.
- **Delivered**:
  - **Dark Mode**: `next-themes` integration, `ThemeToggle` component.
  - **Localization**: `next-intl` with EN/VI translations (120+ keys).
  - **GlobalToolbar**: Reusable theme + language switcher component.
  - **ShadCN CSS Variables**: Full variable set for component theming.
  - **Layouts Updated**: Manager, Employee, Customer, Admin, Login.

### ✅ Phase 9: i18n Translations & ShadCN Components (Completed: 2026-02-01)
- **Goal**: Full i18n integration and enhanced UI components.
- **Delivered**:
  - **ShadCN Components**: Sonner (toasts), Tooltip.
  - **`NextIntlClientProvider`**: Root layout wrapping for client translations.
  - **Translated Layouts**: All navigation items and tooltips localized.

---

## 📊 Current Project Status

### 🏗️ Tech Stack
| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS v4, ShadCN UI |
| **Backend** | NestJS 10, Prisma 6, Socket.io |
| **Database** | PostgreSQL |
| **Cache** | Redis |
| **Auth** | JWT (Access + Refresh), Redis Blacklist |
| **i18n** | next-intl (EN/VI) |
| **Testing** | Playwright (E2E) |
| **Monorepo** | Turborepo |

### 📁 Codebase Statistics
| Component | Count |
|-----------|-------|
| **API Modules** | 12 (auth, catalog, inventory, sales, accounting, einvoice, reports, etc.) |
| **API Files** | 66+ TypeScript files |
| **Web Pages** | 26 TSX pages |
| **Shared Packages** | 3 (dto, database, ui) |
| **Translation Keys** | 120+ per language |

### ✅ Implemented Features

#### 🔐 Authentication & Authorization
- [x] Login/Register with Zod validation
- [x] JWT Access/Refresh token flow
- [x] Redis token blacklist
- [x] Role-based guards (Admin, Manager, Employee, Customer)
- [x] Protected routes (middleware + frontend guards)

#### 📦 Inventory Management
- [x] Product CRUD with variants
- [x] Stock levels by warehouse
- [x] Stock movements (inbound/outbound)
- [x] Real-time WebSocket updates
- [x] Warehouse management

#### 🛒 E-commerce
- [x] Product catalog with pricing
- [x] Shopping cart (Zustand + persistence)
- [x] Checkout flow
- [x] Order history (customer)
- [x] Order fulfillment (manager)

#### 📊 Reporting & Analytics
- [x] Stock velocity reports
- [x] Sales summary reports
- [x] Manager dashboard with charts

#### 🏢 VAS Accounting
- [x] Chart of Accounts (COA)
- [x] Journal entries
- [x] Account/Journal repositories

#### 🧾 E-Invoice
- [x] Mock e-invoice provider
- [x] Integration with order fulfillment

#### 🌐 UI/UX
- [x] OLED Dark Mode (system/manual toggle)
- [x] Glassmorphism design system
- [x] i18n (English + Vietnamese)
- [x] ShadCN UI components (Button, Card, Dropdown, Tooltip, Toast)
- [x] GlobalToolbar for settings

---

## 🔮 Future Roadmap

### Phase 10: Advanced Features
- [ ] **Customer Management**: Customer profiles, addresses.
- [ ] **Inventory Alerts**: Low stock notifications.
- [ ] **Batch Tracking**: Full batch/lot management.

### Phase 11: Production Readiness
- [ ] **CI/CD Pipelines**: GitHub Actions.
- [ ] **Extended E2E Tests**: Full user journey coverage.
- [ ] **Performance Optimization**: Bundle analysis, caching.
- [ ] **Error Monitoring**: Sentry integration.

### Phase 12: Scale & Extend
- [ ] **Multi-tenancy**: Organization support.
- [ ] **Payment Integration**: Stripe/PayPal.
- [ ] **Email Notifications**: Transactional emails.
