# ✅ Feature Checklist

> comprehensive list of all features and their status.

## 🔐 Authentication & RBAC
- [x] **Login/Register** (Zod Validation)
- [x] **Token Management** (Access/Refresh + Redis Blacklist)
- [x] **Role Guards** (Employee, Manager, Admin, Customer)
- [x] **Route Protection** (Middleware + Frontend Guards)

## 📦 Inventory Management
- [x] **Products**
  - [x] CRUD Operations (API)
  - [x] Variants support
  - [x] Repository Pattern Implementation
- [x] **Stock Control**
  - [x] Stock Levels by Warehouse
  - [x] Inbound/Outbound Movements (Transactional UseCase)
  - [x] **Real-time Updates** (WebSockets Implemented)
- [x] **Warehouses**
  - [x] CRUD Operations
  - [x] Location Management

## 👥 Portals (Frontend)
- [x] **Employee Portal**
  - [x] Dashboard
  - [x] Stock Management (Grid View)
  - [x] Move Stock Action
- [x] **Manager Portal**
  - [x] Dashboard
  - [x] User Accounts Management
- [ ] **Customer Portal (Phase 4)**
  - [x] Dashboard
  - [x] **E-commerce Features**
    - [x] `SalesOrder` Database Schema
    - [x] Product Pricing (`ProductVariant.price`)
    - [x] Shopping Cart (Zustand + Persistence)
    - [x] Checkout Flow (Order Creation)
    - [x] Order History View (Partial - Created via Checkout)

- [/] **Manager Portal (Phase 4.5)**
  - [/] **Order Fulfillment**
    - [x] `GET /sales/orders` (List View)
    - [x] `PATCH /sales/orders/:id/status` (Process Order)
    - [ ] Order Details View (Manager)
    - [x] E-Invoice Generation Mock Integration

## 🛠️ Infrastructure
- [x] **Monorepo Structure** (`apps/web`, `apps/api`, `packages/*`)
- [x] **Database** (Prisma + PostgreSQL)
- [x] **Shared DTOs** (`@repo/dto`)
- [x] **CI/CD** (Linting, Build Scripts)

## 📊 Phase 5: Reporting, Polish & Testing Foundation
- [x] **Reporting & Analytics (Option A)**
  - [x] Backend: `/reports/stock-velocity` endpoint
  - [x] Backend: `/reports/sales-summary` endpoint
  - [x] Frontend: Manager Reports Dashboard with Charts
- [x] **Polish & Demo Mode (Option C)**
  - [x] Seed Script: Demo Products, Users, Orders
  - [x] Customer Order History Page
  - [ ] Error Handling & Loading States (Partial)
- [x] **Testing Foundation (Option B)**
  - [x] Playwright Setup
  - [x] Auth Flow E2E Test
  - [x] Checkout Flow E2E Test

## 🏗️ Phase 6: Repository & UseCase Pattern Refactoring
- [x] **Auth Module**
  - [x] UserRepository
  - [x] RefreshTokenRepository
  - [x] Refactor AuthService
- [x] **Sales Module**
  - [x] OrderRepository
  - [x] Refactor UseCases
- [x] **Accounting Module**
  - [x] AccountRepository
  - [x] JournalRepository

## 📋 Phase 7: E-Invoice & Financial Reports
- [x] **Database Schema Updates**
  - [x] Add `EInvoiceLog` model
  - [x] Add `TaxRate` model
  - [x] Update `SalesOrder` with tax fields
- [x] **VAS Financial Reports**
  - [x] Backend: Balance Sheet (B01-DN) logic
  - [x] Backend: Income Statement (P&L / B02-DN) logic
  - [x] API: Report endpoints
- [x] **E-Invoice Integration**
  - [x] Backend: XML Builder (Decision 1450/QĐ-TCT)
  - [x] Backend: Mock Digital Signer
  - [x] API: Issue Invoice endpoint

## 📈 Phase 13: Advanced Analytics & CMS
- [x] **Foundation**
  - [x] `SystemSetting` Model in Database
  - [x] `SettingsModule` & `AnalyticsModule` (Backend)
  - [x] Fix Backend Import Paths (Refactor)
- [x] **Frontend Implementation**
  - [x] `RevenueChart` (Recharts)
  - [x] `AdminDashboard` (Enhanced with real data)
  - [x] `SettingsPage` (CMS)
- [x] **Deployment**
  - [x] Verify `docker-compose.yml` (Infrastructure Verified)
  - [/] Full Docker Build (Deferred per User instruction)

## 🤖 Phase 14: AI Assistant (Option C)
- [ ] **Planning**
  - [x] Create `docs/PHASE_14_AI.md`
  - [ ] User Approval
- [ ] **Backend**
  - [ ] `AiModule` & `AiController`
  - [ ] `AiService` (Gemini Integration)
  - [ ] Tools: `checkStock`, `getRevenue`
- [ ] **Frontend**
  - [ ] Chat Interface (UI)
  - [ ] Integration with Vercel AI SDKontroller

## 📋 Phase 8: API Response Standardization
- [x] **Enhance ApiResponseDto**
  - [x] Add timestamp field
  - [x] Add statusCode field
  - [x] Update helper functions
- [x] **Audit Controllers**
  - [x] Auth Controller
  - [x] Product Controller
  - [x] Sales Controller
  - [x] Accounting Controller
  - [x] Reports Controller

## 📋 Phase 9: UI Enhancement - Dark Mode & i18n
- [x] **Dark Mode Infrastructure**
  - [x] ThemeProvider (next-themes)
  - [x] ThemeToggle component (ShadCN + Lucide)
  - [x] Update root layout with ThemeProvider
- [x] **Localization (i18n)**
  - [x] Install next-intl
  - [x] Create i18n.ts config
  - [x] EN/VI translation files
  - [x] LanguageSwitcher component
  - [x] Update next.config.js with withNextIntl
- [x] **Integrate into Layouts**
  - [x] Manager layout (sidebar)
  - [x] Employee layout (sidebar)
  - [x] Customer layout (navbar)
- [x] **UI Consistency Fixes (Phase 8.2)**
  - [x] Add ShadCN CSS variables (popover, card, ring, etc.)
  - [x] Create reusable GlobalToolbar component
  - [x] Update Admin layout with GlobalToolbar + ShadCN components
  - [x] Replace rgb(var()) with Tailwind color classes
  - [x] Add GlobalToolbar to login page (fixed position)
  - [x] Wrapped `AdminLayout` with `<AuthGuard allowedRoles={['ADMIN']}>`

## 🔔 Phase 11: Notification System (Option A)
- [x] **Backend Infrastructure**
  - [x] Install `@nestjs/bull`, `socket.io`
  - [x] Create `NotificationModule`
  - [x] Implement `EmailService` (Mock) & `NotificationGateway` (Socket)
- [x] **Event-Driven Implementation**
  - [x] `OrderCreatedEvent`
  - [x] `NotificationListener` -> Queue (`notifications`) -> `NotificationProcessor`
- [x] **Frontend Integration**
  - [x] `SocketProvider` (Global Context)
  - [x] `NotificationBell` in GlobalToolbar
  - [x] `useSocket` hookbar + ShadCN components
  - [x] Replace rgb(var()) with Tailwind color classes
  - [x] Add GlobalToolbar to login page (fixed position)

## 💳 Phase 12: Payment System (Strategy Pattern)
- [x] **Backend Infrastructure**
  - [x] `PaymentModule` & `PaymentController`
  - [x] `PaymentProvider` Interface & Strategy Service
  - [x] `VNPayProvider` (with Mock & Hash logic)
- [x] **Frontend Integration**
  - [x] Add "Pay with VNPay" to Checkout
  - [x] Handle Payment Return/Success Page

## 📋 Phase 9: i18n Translations & ShadCN Components
- [x] **ShadCN Components**
  - [x] Add Sonner (toast) component
  - [x] Add Tooltip component
  - [x] Add TooltipProvider to root layout
  - [x] Add Toaster to root layout
- [x] **i18n Infrastructure**
  - [x] Add NextIntlClientProvider to root layout
  - [x] Update EN/VI translation files with new keys
- [x] **Layout Translations**
  - [x] Manager layout with useTranslations + Tooltips
  - [x] Employee layout with useTranslations + Tooltips
  - [x] Customer layout with useTranslations + Tooltips
  - [x] Admin layout with useTranslations + Tooltips
