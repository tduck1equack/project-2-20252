# 🏗️ Plan: Inventory Module Refactor (Phase 2)

## 🎯 Goal
Refactor `InventoryModule` to use **Explicit Repository Pattern** and **Use Cases**, decoupling business logic from `PrismaService` and Controllers.

## 📦 Components

### 1. Repositories (`apps/api/src/modules/inventory/repositories/`)
Abstracts Data Access.
- **`ProductRepository`** (Interface)
  - `create(data: CreateProductDto): Promise<Product>`
  - `findAll(params: PaginationDto): Promise<Product[]>`
  - `findById(id: string): Promise<Product | null>`
- **`StockRepository`** (Interface)
  - `findByProductAndWarehouse(productId: string, warehouseId: string): Promise<StockLevel | null>`
  - `update(id: string, quantity: number): Promise<StockLevel>`
  - `createMovement(data: CreateStockMovementDto): Promise<StockMovement>` (Transaction Support?)
  *Note: Transaction support might require a `UnitOfWork` or passing Prisma Transaction Client.*

### 2. Use Cases (`apps/api/src/modules/inventory/use-cases/`)
Encapsulates Business Logic.
- **`CreateStockMovementUseCase`**
  - Input: `CreateStockMovementDto`
  - Logic: Validate Stock -> Calculate New Qty -> Create Movement -> Update/Create Stock Level.
  - Dependencies: `StockRepository`, `ProductRepository`?

### 3. Implementations (`.../repositories/implementations/`)
- `PrismaProductRepository` implements `ProductRepository`.
- `PrismaStockRepository` implements `StockRepository`.

## 📝 Steps
1.  **Define Interfaces**: Create Repository Interfaces.
2.  **Implement Repositories**: Create Prisma implementations using `InfrastructureModule`.
3.  **Create Use Case**: Port logic from `MovementService`.
4.  **Refactor Services**: Update `ProductService` to use Repository.
5.  **Wiring**: Register Providers in `InventoryModule`.

## ⚠️ Key Considerations
- **Transactions**: `CreateStockMovement` involves multiple DB writes.
  - Strategy: `PrismaStockRepository` methods might need to accept a transaction manager, or the Use Case manages the transaction via a `TransactionManager`.
  - *Decision*: For now, keep transaction logic inside `MovementRepository.createWithStockUpdate()` to encapsulate complexity, OR use `PrismaService.$transaction` in UseCase if Reference is needed.
  - *Selected*: Encapsulate in Repository for now (`createMovement` handles the transaction internally).

## 🧪 Verification
- Unit Tests for UseCase (mocking Repository).
- API E2E Test (existing).
