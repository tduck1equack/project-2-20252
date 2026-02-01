// IMPORTANT: Import @repo/config FIRST to load .env before PrismaClient reads process.env
import '@repo/config';

import { PrismaClient, Role, OrderStatus, MovementType, MovementStatus, JournalStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper to generate random date within last N days
function randomDate(daysBack: number): Date {
    const now = Date.now();
    const random = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
    return new Date(now - random);
}

// Helper to pick random item from array
function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Sample data pools
const firstNames = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Hoàng', 'Lan', 'Minh', 'Nam', 'Phương', 'Quang', 'Thảo', 'Tuấn', 'Vy', 'Long', 'Mai', 'Anh', 'Đức', 'Hùng', 'Linh'];
const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];

const productCategories = [
    { prefix: 'LAPTOP', name: 'Laptop', variants: ['13 inch', '15 inch', '17 inch'], basePrice: 800 },
    { prefix: 'PHONE', name: 'Smartphone', variants: ['Standard', 'Pro', 'Ultra'], basePrice: 400 },
    { prefix: 'TABLET', name: 'Tablet', variants: ['10 inch', '12 inch'], basePrice: 300 },
    { prefix: 'MONITOR', name: 'Monitor', variants: ['24 inch', '27 inch', '32 inch'], basePrice: 200 },
    { prefix: 'KEYBOARD', name: 'Keyboard', variants: ['Mechanical', 'Membrane', 'Wireless'], basePrice: 50 },
    { prefix: 'MOUSE', name: 'Mouse', variants: ['Wired', 'Wireless', 'Gaming'], basePrice: 25 },
    { prefix: 'HEADPHONES', name: 'Headphones', variants: ['Wired', 'Bluetooth', 'Gaming'], basePrice: 60 },
    { prefix: 'WEBCAM', name: 'Webcam', variants: ['720p', '1080p', '4K'], basePrice: 40 },
    { prefix: 'SPEAKER', name: 'Speaker', variants: ['Portable', 'Desktop', 'Soundbar'], basePrice: 80 },
    { prefix: 'SSD', name: 'SSD Storage', variants: ['256GB', '512GB', '1TB', '2TB'], basePrice: 60 },
    { prefix: 'RAM', name: 'RAM Module', variants: ['8GB', '16GB', '32GB'], basePrice: 40 },
    { prefix: 'CHARGER', name: 'Charger', variants: ['20W', '65W', '100W'], basePrice: 20 },
    { prefix: 'CABLE', name: 'USB Cable', variants: ['Type-C', 'Lightning', 'Micro USB'], basePrice: 10 },
    { prefix: 'CASE', name: 'Phone Case', variants: ['Clear', 'Leather', 'Silicone'], basePrice: 15 },
    { prefix: 'BAG', name: 'Laptop Bag', variants: ['15 inch', '17 inch', 'Backpack'], basePrice: 35 },
];

const warehouseLocations = [
    { name: 'Main Warehouse', location: 'Ho Chi Minh City - District 7' },
    { name: 'North Warehouse', location: 'Hanoi - Long Bien' },
    { name: 'Central Warehouse', location: 'Da Nang - Hai Chau' },
    { name: 'Backup Storage', location: 'Ho Chi Minh City - District 9' },
];

async function main() {
    console.log('🌱 Seeding database with comprehensive sample data...\n');

    // 0. Cleanup existing data that has unique constraints (for re-running seed)
    console.log('🧹 Cleaning up existing seeded data...');
    await prisma.journalEntryLine.deleteMany({});
    await prisma.journalEntry.deleteMany({});
    await prisma.stockMovementItem.deleteMany({});
    await prisma.stockMovement.deleteMany({});
    await prisma.salesOrderItem.deleteMany({});
    await prisma.salesOrder.deleteMany({});
    console.log('   Cleaned up orders, movements, journals');

    // 1. Create Demo Tenant
    const tenant = await prisma.tenant.upsert({
        where: { id: 'demo-tenant' },
        update: {},
        create: {
            id: 'demo-tenant',
            name: 'TechViet Corporation'
        }
    });
    console.log('✅ Tenant created:', tenant.name);

    // 2. Create Users: 5 Admins, 5 Managers, 15 Employees, 20 Customers
    const passwordHash = await bcrypt.hash('password123', 10);

    const createUsers = async (role: Role, count: number, prefix: string) => {
        const users = [];
        for (let i = 1; i <= count; i++) {
            const firstName = randomItem(firstNames);
            const lastName = randomItem(lastNames);
            const email = `${prefix}${i}@demo.com`;

            const user = await prisma.user.upsert({
                where: { email },
                update: {},
                create: {
                    email,
                    password: passwordHash,
                    name: `${lastName} ${firstName}`,
                    role,
                    tenantId: tenant.id
                }
            });
            users.push(user);
        }
        return users;
    };

    const admins = await createUsers(Role.ADMIN, 5, 'admin');
    const managers = await createUsers(Role.MANAGER, 5, 'manager');
    const employees = await createUsers(Role.EMPLOYEE, 15, 'employee');
    const customers = await createUsers(Role.CUSTOMER, 20, 'customer');

    console.log(`✅ Users created: ${admins.length} admins, ${managers.length} managers, ${employees.length} employees, ${customers.length} customers`);

    // 3. Create UoM
    const uoms = [
        { code: 'PCS', name: 'Pieces' },
        { code: 'BOX', name: 'Boxes' },
        { code: 'KG', name: 'Kilograms' },
        { code: 'SET', name: 'Sets' }
    ];

    for (const u of uoms) {
        await prisma.uom.upsert({
            where: { code: u.code },
            update: {},
            create: { ...u, tenantId: tenant.id }
        });
    }
    console.log(`✅ UoMs created: ${uoms.length}`);

    // 4. Create Warehouses
    const warehouses = [];
    for (let i = 0; i < warehouseLocations.length; i++) {
        const wh = await prisma.warehouse.upsert({
            where: { id: `warehouse-${i + 1}` },
            update: {},
            create: {
                id: `warehouse-${i + 1}`,
                name: warehouseLocations[i].name,
                location: warehouseLocations[i].location,
                tenantId: tenant.id
            }
        });
        warehouses.push(wh);
    }
    console.log(`✅ Warehouses created: ${warehouses.length}`);

    // 5. Create Products with Variants (15 categories × 3-4 variants = ~50 variants)
    const pcsUom = await prisma.uom.findFirst({ where: { code: 'PCS' } });
    const allVariants: { id: string; name: string; price: number }[] = [];

    for (const cat of productCategories) {
        const product = await prisma.product.upsert({
            where: { sku: `${cat.prefix}-001` },
            update: {},
            create: {
                name: cat.name,
                sku: `${cat.prefix}-001`,
                description: `High quality ${cat.name.toLowerCase()} for everyday use`,
                uomId: pcsUom!.id,
                tenantId: tenant.id,
                variants: {
                    create: cat.variants.map((v, idx) => ({
                        name: `${cat.name} - ${v}`,
                        sku: `${cat.prefix}-${v.replace(/\s/g, '').toUpperCase()}`,
                        price: cat.basePrice * (1 + idx * 0.3) // Price increases with variants
                    }))
                }
            },
            include: { variants: true }
        });
        allVariants.push(...product.variants.map(v => ({ id: v.id, name: v.name, price: Number(v.price) })));
    }
    console.log(`✅ Products created: ${productCategories.length} products, ${allVariants.length} variants`);

    // 6. Create Stock for all variants in all warehouses (using findFirst + create pattern due to nullable batchId)
    let stockCount = 0;
    for (const variant of allVariants) {
        for (const wh of warehouses) {
            const existingStock = await prisma.stock.findFirst({
                where: {
                    warehouseId: wh.id,
                    productVariantId: variant.id,
                    batchId: null
                }
            });

            if (existingStock) {
                await prisma.stock.update({
                    where: { id: existingStock.id },
                    data: { quantity: Math.floor(Math.random() * 200) + 20 }
                });
            } else {
                await prisma.stock.create({
                    data: {
                        warehouseId: wh.id,
                        productVariantId: variant.id,
                        quantity: Math.floor(Math.random() * 200) + 20
                    }
                });
            }
            stockCount++;
        }
    }
    console.log(`✅ Stock entries created: ${stockCount}`);

    // 7. Create Stock Movements with proper schema (code, fromWarehouse/toWarehouse, items)
    let movementCount = 0;
    const movementTypes = [MovementType.INBOUND, MovementType.OUTBOUND, MovementType.TRANSFER];

    for (let i = 0; i < 100; i++) {
        const type = randomItem(movementTypes);
        const fromWh = randomItem(warehouses);
        const toWh = randomItem(warehouses.filter(w => w.id !== fromWh.id));
        const creator = randomItem(employees);
        const movDate = randomDate(90);

        // Determine from/to warehouse based on movement type
        let fromWarehouseId: string | null = null;
        let toWarehouseId: string | null = null;

        if (type === MovementType.INBOUND) {
            toWarehouseId = randomItem(warehouses).id; // Inbound goes TO a warehouse
        } else if (type === MovementType.OUTBOUND) {
            fromWarehouseId = randomItem(warehouses).id; // Outbound goes FROM a warehouse
        } else { // TRANSFER
            fromWarehouseId = fromWh.id;
            toWarehouseId = toWh.id;
        }

        // Select 1-3 random variants for this movement
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const movementVariants = [...allVariants].sort(() => Math.random() - 0.5).slice(0, itemCount);

        await prisma.stockMovement.create({
            data: {
                code: `MOV-${2026}${String(i + 1).padStart(5, '0')}`, // e.g. MOV-202600001
                type,
                status: MovementStatus.COMPLETED,
                date: movDate,
                reference: type === MovementType.INBOUND ? `PO-${i + 1}` : (type === MovementType.OUTBOUND ? `SO-${i + 1}` : null),
                fromWarehouseId,
                toWarehouseId,
                tenantId: tenant.id,
                createdById: creator.id,
                createdAt: movDate,
                items: {
                    create: movementVariants.map(v => ({
                        productVariantId: v.id,
                        quantity: Math.floor(Math.random() * 50) + 5
                    }))
                }
            }
        });
        movementCount++;
    }
    console.log(`✅ Stock movements created: ${movementCount}`);

    // 8. Create Sales Orders (100 orders across 20 customers)
    const orderStatuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED];
    let orderCount = 0;

    for (let i = 0; i < 100; i++) {
        const customer = randomItem(customers);
        const itemCount = Math.floor(Math.random() * 4) + 1; // 1-4 items per order
        const orderVariants = [...allVariants].sort(() => Math.random() - 0.5).slice(0, itemCount);

        const items = orderVariants.map(v => {
            const qty = Math.floor(Math.random() * 5) + 1;
            return {
                productVariantId: v.id,
                quantity: qty,
                unitPrice: v.price,
                totalPrice: v.price * qty
            };
        });

        const totalAmount = items.reduce((acc, item) => acc + item.totalPrice, 0);
        const orderDate = randomDate(90);

        await prisma.salesOrder.create({
            data: {
                code: `SO-${2026}${String(1000 + i).padStart(4, '0')}`,
                tenantId: tenant.id,
                customerId: customer.id,
                status: randomItem(orderStatuses),
                totalAmount,
                items: { create: items },
                createdAt: orderDate,
                updatedAt: new Date(orderDate.getTime() + Math.random() * 86400000 * 3) // Updated within 3 days
            }
        });
        orderCount++;
    }
    console.log(`✅ Sales orders created: ${orderCount}`);

    // 9. Create Accounting Accounts (Chart of Accounts)
    const accounts = [
        { code: '1111', name: 'Cash on Hand', type: 'ASSET' },
        { code: '1121', name: 'Checking Account - VCB', type: 'ASSET' },
        { code: '1122', name: 'Checking Account - ACB', type: 'ASSET' },
        { code: '1311', name: 'Accounts Receivable', type: 'ASSET' },
        { code: '1561', name: 'Inventory - Goods', type: 'ASSET' },
        { code: '1562', name: 'Inventory - Materials', type: 'ASSET' },
        { code: '2111', name: 'Fixed Assets - Equipment', type: 'ASSET' },
        { code: '3311', name: 'Accounts Payable', type: 'LIABILITY' },
        { code: '3331', name: 'VAT Payable', type: 'LIABILITY' },
        { code: '4111', name: 'Owner Equity', type: 'EQUITY' },
        { code: '5111', name: 'Revenue - Sales', type: 'REVENUE' },
        { code: '5112', name: 'Revenue - Services', type: 'REVENUE' },
        { code: '6321', name: 'Cost of Goods Sold', type: 'EXPENSE' },
        { code: '6421', name: 'Salary Expense', type: 'EXPENSE' },
        { code: '6422', name: 'Rent Expense', type: 'EXPENSE' },
        { code: '6423', name: 'Utilities Expense', type: 'EXPENSE' },
        { code: '6424', name: 'Marketing Expense', type: 'EXPENSE' },
    ];

    for (const acc of accounts) {
        await prisma.account.upsert({
            where: {
                code_tenantId: {
                    code: acc.code,
                    tenantId: tenant.id
                }
            },
            update: {},
            create: {
                code: acc.code,
                name: acc.name,
                type: acc.type,
                tenantId: tenant.id
            }
        });
    }
    console.log(`✅ Accounts created: ${accounts.length}`);

    // 10. Create Journal Entries (50 entries)
    const expenseAccounts = accounts.filter(a => a.type === 'EXPENSE').map(a => a.code);
    const assetAccounts = accounts.filter(a => a.type === 'ASSET').map(a => a.code);

    for (let i = 0; i < 50; i++) {
        const amount = Math.floor(Math.random() * 50000000) + 1000000; // 1M - 50M VND
        const debitAccount = await prisma.account.findFirst({ where: { code: randomItem(expenseAccounts) } });
        const creditAccount = await prisma.account.findFirst({ where: { code: randomItem(assetAccounts) } });

        if (debitAccount && creditAccount) {
            await prisma.journalEntry.create({
                data: {
                    tenantId: tenant.id,
                    date: randomDate(180),
                    description: `Journal Entry ${i + 1} - ${debitAccount.name}`,
                    reference: `JE-${2026}${String(i + 1).padStart(4, '0')}`,
                    status: JournalStatus.POSTED,
                    lines: {
                        create: [
                            { accountId: debitAccount.id, debit: amount, credit: 0 },
                            { accountId: creditAccount.id, debit: 0, credit: amount }
                        ]
                    }
                }
            });
        }
    }
    console.log(`✅ Journal entries created: 50`);

    console.log('\n🎉 Comprehensive seeding complete!');
    console.log('📊 Summary:');
    console.log(`   • Users: 45 (5 admin, 5 manager, 15 employee, 20 customer)`);
    console.log(`   • Products: ${productCategories.length} with ${allVariants.length} variants`);
    console.log(`   • Warehouses: ${warehouses.length}`);
    console.log(`   • Stock entries: ${stockCount}`);
    console.log(`   • Stock movements: ${movementCount}`);
    console.log(`   • Sales orders: ${orderCount}`);
    console.log(`   • Accounts: ${accounts.length}`);
    console.log(`   • Journal entries: 50`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
