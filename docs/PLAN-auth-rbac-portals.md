# PLAN: Auth + RBAC + Role-Based Portals

> Created: 2026-01-30 | Status: **Pending Approval**

---

## Overview

Implement robust authentication with:
- **Hybrid JWT + Redis Blacklist** (Option C approved)
- **Sliding window refresh tokens**
- **RBAC with 4 portal UIs**

---

## Phase 1: Authentication Backend

### 1.1 Token Infrastructure

| File | Changes |
|------|---------|
| `schema.prisma` | Add `RefreshToken` model |
| `auth.service.ts` | Implement token pair generation |
| `auth.controller.ts` | Add `/refresh`, `/logout` endpoints |

**RefreshToken Model:**
```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
  revokedAt DateTime?
}
```

**Token Flow:**
1. Login → Access (15min) + Refresh (7d in HttpOnly cookie)
2. API call → Check blacklist in Redis, validate JWT
3. Refresh → Rotate tokens, extend TTL (sliding window)
4. Logout → Blacklist access token, revoke refresh token

### 1.2 Redis Integration

| Component | Purpose |
|-----------|---------|
| `redis.module.ts` | Redis client singleton |
| `token-blacklist.service.ts` | Store revoked JWTs |
| Token TTL | Match access token lifetime (15min) |

### 1.3 Guards & Decorators

| Guard/Decorator | Purpose |
|-----------------|---------|
| `@Roles(Role.ADMIN)` | Require specific role(s) |
| `RolesGuard` | Check user role from JWT |
| `JwtAuthGuard` | Validate + check blacklist |

---

## Phase 2: Schema Update

### 2.1 Role Expansion

```prisma
enum Role {
  CUSTOMER        // View products, orders
  EMPLOYEE        // Manage stock (was WAREHOUSE_KEEPER)
  MANAGER         // Manage accounts, warehouses
  ADMIN           // System admin
  ACCOUNTANT      // Keep for backward compat
}
```

### 2.2 User Model Update

Add refresh token relation:
```prisma
model User {
  // ... existing fields
  refreshTokens RefreshToken[]
}
```

---

## Phase 3: Role-Based UI Routes

### Route Structure

```
apps/web/app/
├── (public)/           # No auth required
│   ├── page.tsx        # Landing
│   └── login/
├── (auth)/             # Auth required, route groups
│   ├── customer/       # CUSTOMER role
│   │   ├── layout.tsx
│   │   ├── page.tsx    # Dashboard
│   │   ├── products/
│   │   └── orders/
│   ├── employee/       # EMPLOYEE role
│   │   ├── layout.tsx
│   │   ├── page.tsx    # Dashboard
│   │   ├── stock/
│   │   └── movements/
│   └── manager/        # MANAGER role
│       ├── layout.tsx
│       ├── page.tsx    # Dashboard
│       ├── warehouses/
│       └── accounts/
└── admin/              # ADMIN role (existing)
```

### 3.1 Customer Portal `/customer`

| Page | Features |
|------|----------|
| Dashboard | Welcome, recent orders, quick stats |
| Products | Product catalog, search, filter |
| Orders | Order history, status tracking |
| Profile | Account settings |

### 3.2 Employee Portal `/employee`

| Page | Features |
|------|----------|
| Dashboard | Quick stats, pending tasks |
| Stock | View stock levels by warehouse |
| Movements | Create/view stock movements |
| Batches | Batch tracking, expiry alerts |

### 3.3 Manager Portal `/manager`

| Page | Features |
|------|----------|
| Dashboard | Overview, KPIs |
| Warehouses | CRUD warehouses |
| Accounts | User management (employees) |
| Reports | Stock reports, movement logs |

---

## Phase 4: Auth Middleware (Frontend)

### 4.1 Auth Context

```typescript
// contexts/auth-context.tsx
- User state (from JWT)
- Login/logout functions
- Token refresh (automatic)
- Role checking helpers
```

### 4.2 Route Protection

```typescript
// middleware.ts
- Check auth token
- Redirect by role:
  - CUSTOMER → /customer
  - EMPLOYEE → /employee
  - MANAGER → /manager
  - ADMIN → /admin
- Unauthenticated → /login
```

---

## Phase 5: Dark Mode Enhancement (Next Iteration)

> Planned for next session

- [ ] Persistent theme (localStorage)
- [ ] System preference detection
- [ ] WCAG AA text contrast
- [ ] Glass card light mode fixes

---

## File Changes Summary

### API (`apps/api`)

| Action | File |
|--------|------|
| MODIFY | `prisma/schema.prisma` |
| NEW | `src/redis/redis.module.ts` |
| NEW | `src/redis/token-blacklist.service.ts` |
| MODIFY | `src/modules/auth/auth.service.ts` |
| MODIFY | `src/modules/auth/auth.controller.ts` |
| NEW | `src/modules/auth/decorators/roles.decorator.ts` |
| NEW | `src/modules/auth/guards/roles.guard.ts` |

### Web (`apps/web`)

| Action | File |
|--------|------|
| NEW | `app/(auth)/customer/layout.tsx` |
| NEW | `app/(auth)/customer/page.tsx` |
| NEW | `app/(auth)/employee/layout.tsx` |
| NEW | `app/(auth)/employee/page.tsx` |
| NEW | `app/(auth)/manager/layout.tsx` |
| NEW | `app/(auth)/manager/page.tsx` |
| NEW | `contexts/auth-context.tsx` |
| NEW | `middleware.ts` |
| MODIFY | `app/globals.css` (dark mode fixes) |

---

## Verification Checklist

### Auth Backend
- [ ] Login returns access + refresh tokens
- [ ] Refresh endpoint rotates tokens
- [ ] Logout blacklists access token
- [ ] Redis blacklist checked on each request
- [ ] Sliding window extends refresh TTL

### RBAC
- [ ] @Roles decorator works
- [ ] RolesGuard rejects unauthorized
- [ ] Role-specific endpoints protected

### UI Portals
- [ ] Customer portal accessible to CUSTOMER
- [ ] Employee portal accessible to EMPLOYEE
- [ ] Manager portal accessible to MANAGER
- [ ] Cross-role access blocked
- [ ] Redirect to correct portal after login

---

## Estimated Effort

| Phase | Time |
|-------|------|
| Auth Backend | 2 hours |
| Schema + Migration | 30 min |
| 3 Portals (basic) | 3 hours |
| Auth Frontend | 1 hour |
| **Total** | ~6-7 hours |
