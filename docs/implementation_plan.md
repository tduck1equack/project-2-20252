# 📅 Phase 13: Advanced Analytics & Deployment

## 1. Objective
Implement "Business Intelligence" features to visualize system data and finalize the project for deployment using Docker.

---

## 2. Analytics (Tiered & Role-Based)

### Backend: `AnalyticsModule`
-   **Endpoints**:
    1.  `GET /analytics/admin`: System Health, Global Revenue, Top Products.
    2.  `GET /analytics/manager`: Branch Performance, Staff Sales.
    3.  `GET /analytics/employee`: Personal Sales, Assigned Tasks.
-   **Security**: Strict RBAC checking.

### Frontend: Dashboards
-   **Admin**: `/admin/dashboard` (Enhanced).
-   **Manager**: `/manager/dashboard` (Enhanced).
-   **Employee**: `/employee/dashboard` (Enhanced).
-   **Components**: `StatCard`, `TrendChart`, `SystemHealthMonitor`.

---

## 3. CMS & Configuration (System Management)

### Database: `SystemSetting`
-   Key-Value store for dynamic config.
-   Model: `key` (id), `value`, `description`.

### Backend: `SettingsModule`
-   `GET /settings`: Public settings (Logo, Title).
-   `PATCH /settings`: Admin only updates.
-   `POST /settings/logo`: File upload (Mock or Local).

### Frontend: Admin Panel
-   Page: `/admin/settings`.
-   Features: Change Site Title, Dark Mode Default, Logo URL.

---

## 4. Deployment (Production Readiness)
-   **Docker**: Ensure `docker-compose.yml` launches API, Web, Postgres, Redis.
-   **Environment**: Create `.env.example` with clear instructions.
-   **Scripts**: `pnpm start:docker`.

---

## 5. Implementation Steps

### Step 5.1: Foundation (DB & Config)
-   [ ] Add `SystemSetting` to Prisma Schema.
-   [ ] Create `SettingsModule` (API).
-   [ ] Update `.env.example` (Done).

### Step 5.2: Analytics Backend
-   [ ] Implement RBAC Service methods.
-   [ ] Aggregate data using Prisma.

### Step 5.3: Frontend Implementation
-   [ ] Admin Settings Page.
-   [ ] Update Dashboards with Charts.

---

## 6. Agent Assignment
-   **Database**: `@database-architect` (Schema).
-   **Backend**: `@backend-specialist` (Modules).
-   **Frontend**: `@frontend-specialist` (UI).

**Do you approve this Phase 13 plan?**
