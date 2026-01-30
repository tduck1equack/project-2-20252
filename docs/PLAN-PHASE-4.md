# 🛒 Phase 4: Customer Experience (E-commerce)

> **Objective**: Transform the Customer Portal into a functional ordering system with Cart, Checkout, and Order Management.

## 🏗️ Architecture Design

### 1. Database Schema Changes
We need to introduce "Commercial" aspects to the ERP.
- **`ProductVariant`**: Add `price` (Decimal/Float).
- **`SalesOrder`**: New model to track customer orders.
- **`SalesOrderItem`**: Line items for orders.

```prisma
model ProductVariant {
  // ... existing
  price Decimal @default(0) @db.Decimal(10, 2)
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  CANCELLED
}

model SalesOrder {
  id String @id @default(uuid())
  code String @unique // SO-2024-001
  
  tenantId String
  customerId String // User.id

  status OrderStatus @default(PENDING)
  totalAmount Decimal @db.Decimal(12, 2)

  items SalesOrderItem[]
  
  // Link to StockMovement?
  // When confirmed, we generate a StockMovement (OUTBOUND)
  movementId String?
  movement StockMovement? @relation(fields: [movementId], references: [id])
}

model SalesOrderItem {
  id String @id @default(uuid())
  orderId String
  productVariantId String
  quantity Float
  unitPrice Decimal @db.Decimal(10, 2)
  totalPrice Decimal @db.Decimal(12, 2)
}
```

### 2. Backend (New `SalesModule`)
- **`SalesController`**:
  - `POST /orders`: Create order (Validation -> Stock Check -> Create Order -> Create StockMovement).
  - `GET /orders`: List my orders.
- **`CreateOrderUseCase`**:
  - Validates stock availability.
  - Creates `SalesOrder`.
  - Creates `StockMovement` (Type: OUTBOUND, Status: COMPLETED) to immediately deduct stock (MVP approach).
  - Emits `order.created` event.

### 3. Frontend (Customer Portal)
- **State Management**: `useCartStore` (Zustand + `persist` middleware).
  - Actions: `addItem`, `removeItem`, `clearCart`.
  - Selectors: `totalItems`, `totalPrice`.
- **UI Components**:
  - `ProductCard`: Add Price & "Add to Cart" button.
  - `CartDrawer` (or Page): List items, Update Qty.
  - `CheckoutPage`: Review & Submit.
  - `OrderSuccessPage`: Show Order #.

---

## 📅 Implementation Steps

### Step 1: Database & Seed (Foundation)
- [ ] Modify `schema.prisma` (Add `SalesOrder`, Update `ProductVariant`).
- [ ] Run `prisma migrate`.
- [ ] Update `seed.ts` to add prices to existing variants.

### Step 2: Backend Logic
- [ ] Create `SalesModule`.
- [ ] Implement `CreateOrderUseCase` (Integrated with `InventoryModule` via `StockService` or events?).
  - *Decision*: Direct call to `StockRepository` or `InventoryService` to ensure consistency.

### Step 3: Frontend - Cart
- [ ] Implement `useCartStore`.
- [ ] Update `ProductCard` to show Price.
- [ ] implement "Add to Cart" interaction (Toast notification).

### Step 4: Frontend - Checkout
- [ ] Create `/customer/cart` page.
- [ ] Create `/customer/checkout` page (Submit Order).
- [ ] Connect to `POST /orders`.

### Step 5: Verification
- [ ] Customer places order -> Stock decreases in Employee View (Real-time!).
