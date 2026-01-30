# 📋 Plan: Vertical Slice (Inventory & Products)

## 🎯 Goal
Implement an end-to-end flow where **Employees** can manage stock (Inbound/Outbound) and **Customers** can view available products.

## 🏗️ 1. Architecture & Shared (@repo/dto)
- [ ] **Define DTOs**
    - `ProductDto`, `ProductVariantDto`, `CreateProductDto`
    - `WarehouseDto`, `CreateWarehouseDto`
    - `StockMovementDto`, `CreateMovementDto` (with items and batches)
    - `StockLevelDto` (Aggregated quantity)
    - Ensure strict typing (e.g. `MovementType` enum).

## 🔌 2. Backend (API)
- [ ] **Inventory Module**
    - **Service**: `ProductService` (CRUD for products/variants).
    - **Service**: `WarehouseService` (Manage locations).
    - **Service**: `StockMovementService`
        - Implement `createMovement(dto)` with Prisma transaction.
        - Handle `INBOUND` (Increase stock) and `OUTBOUND` (Decrease stock).
        - Update `Stock` records dynamically.
- [ ] **Controllers**
    - `ProductController`: Public `GET /products`, Secure `POST /products`.
    - `WarehouseController`: Secure `GET /warehouses`.
    - `StockMovementController`: Secure `POST /movements` (Employee), `GET /movements` (History).

## 🖥️ 3. Frontend (Web)
- [ ] **Data Access**
    - `use-inventory.ts` hook (TanStack Query mutations/queries).
- [ ] **Employee Portal (`/employee`)**
    - **Page: Stock Management (`/stock`)**
        - Selector: Choose Warehouse.
        - List: Current Stock Levels (Table).
        - Action: **Inbound Stock** (Modal/Form).
            - Select Product Variant.
            - Enter Quantity & Batch Code.
            - Submit -> API.
- [ ] **Customer Portal (`/customer`)**
    - **Page: Products (`/products`)**
        - Grid view of `ProductDto`.
        - Show "Available" if stock > 0.
        - Filter by Category (if applicable) or Search by Name.

## 🧪 4. Verification
- [ ] **Seed Data**: Run `pnpm seed` to ensure baseline warehouses/products.
- [ ] **E2E Test Flow**:
    1. Employee adds 10 units of Item A to Warehouse 1.
    2. Customer views Item A (sees "In Stock").
    3. Employee moves 10 units OUT.
    4. Customer views Item A (sees "Out of Stock").
