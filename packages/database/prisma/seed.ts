import { PrismaClient, Role, MovementType, MovementStatus, AccountType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data (in reverse dependency order)
    await prisma.stockMovementItem.deleteMany();
    await prisma.stockMovement.deleteMany();
    await prisma.stock.deleteMany();
    await prisma.batch.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.uom.deleteMany();
    await prisma.journalEntryLine.deleteMany();
    await prisma.journalEntry.deleteMany();
    await prisma.account.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.eInvoiceLog.deleteMany();
    await prisma.eInvoiceProviderConfig.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();

    console.log('✓ Cleared existing data');

    // Create Tenant
    const tenant = await prisma.tenant.create({
        data: {
            name: 'Demo Company',
        },
    });
    console.log('✓ Created tenant:', tenant.name);

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: 'admin@example.com',
                password: hashedPassword,
                name: 'Admin User',
                role: Role.ADMIN,
                tenantId: tenant.id,
            },
        }),
        prisma.user.create({
            data: {
                email: 'manager@example.com',
                password: hashedPassword,
                name: 'Nguyen Van A',
                role: Role.MANAGER,
                tenantId: tenant.id,
            },
        }),
        prisma.user.create({
            data: {
                email: 'employee@example.com',
                password: hashedPassword,
                name: 'Tran Thi B',
                role: Role.EMPLOYEE,
                tenantId: tenant.id,
            },
        }),
        prisma.user.create({
            data: {
                email: 'accountant@example.com',
                password: hashedPassword,
                name: 'Le Van C',
                role: Role.ACCOUNTANT,
                tenantId: tenant.id,
            },
        }),
        prisma.user.create({
            data: {
                email: 'customer@example.com',
                password: hashedPassword,
                name: 'Pham Thi D',
                role: Role.CUSTOMER,
                tenantId: tenant.id,
            },
        }),
    ]);
    console.log('✓ Created', users.length, 'users');

    // Create UOMs
    const uoms = await Promise.all([
        prisma.uom.create({ data: { name: 'Piece', code: 'PCS', tenantId: tenant.id } }),
        prisma.uom.create({ data: { name: 'Kilogram', code: 'KG', tenantId: tenant.id } }),
        prisma.uom.create({ data: { name: 'Liter', code: 'L', tenantId: tenant.id } }),
        prisma.uom.create({ data: { name: 'Meter', code: 'M', tenantId: tenant.id } }),
        prisma.uom.create({ data: { name: 'Box', code: 'BOX', tenantId: tenant.id } }),
    ]);
    console.log('✓ Created', uoms.length, 'UOMs');

    // Create Warehouses
    const warehouses = await Promise.all([
        prisma.warehouse.create({
            data: {
                name: 'Main Warehouse',
                location: '123 Industrial Zone, District 7, Ho Chi Minh City',
                tenantId: tenant.id,
            },
        }),
        prisma.warehouse.create({
            data: {
                name: 'Storage B',
                location: '456 Logistics Park, Thu Duc, Ho Chi Minh City',
                tenantId: tenant.id,
            },
        }),
        prisma.warehouse.create({
            data: {
                name: 'Cold Storage',
                location: '789 Food District, Binh Tan, Ho Chi Minh City',
                tenantId: tenant.id,
            },
        }),
    ]);
    console.log('✓ Created', warehouses.length, 'warehouses');

    // Create Products with Variants
    const productsData = [
        { name: 'Industrial Gears Set', sku: 'GEAR-001', description: 'Heavy-duty industrial gears for machinery', uom: 'PCS' },
        { name: 'Steel Ball Bearings', sku: 'BEAR-002', description: 'High-precision ball bearings', uom: 'PCS' },
        { name: 'Hydraulic Pump Unit', sku: 'PUMP-003', description: 'Industrial hydraulic pump system', uom: 'PCS' },
        { name: 'Stainless Steel Bolts', sku: 'BOLT-004', description: 'M10 stainless steel bolts', uom: 'BOX' },
        { name: 'Electric Motor 3HP', sku: 'MOTR-005', description: '3HP electric motor with capacitor', uom: 'PCS' },
        { name: 'Conveyor Belt 10m', sku: 'CONV-006', description: 'Heavy-duty rubber conveyor belt', uom: 'M' },
        { name: 'Lubricant Oil 5L', sku: 'LUBE-007', description: 'Industrial grade lubricant oil', uom: 'L' },
        { name: 'Paint Thinner 1L', sku: 'PAIN-008', description: 'Solvent-based paint thinner', uom: 'L' },
    ];

    const pcsUom = uoms.find(u => u.code === 'PCS')!;
    const boxUom = uoms.find(u => u.code === 'BOX')!;
    const mUom = uoms.find(u => u.code === 'M')!;
    const lUom = uoms.find(u => u.code === 'L')!;

    const uomMap: Record<string, string> = {
        PCS: pcsUom.id,
        BOX: boxUom.id,
        M: mUom.id,
        L: lUom.id,
    };

    const products = [];
    const variants = [];

    for (const p of productsData) {
        const product = await prisma.product.create({
            data: {
                name: p.name,
                sku: p.sku,
                description: p.description,
                uomId: uomMap[p.uom],
                tenantId: tenant.id,
            },
        });
        products.push(product);

        // Create default variant
        const variant = await prisma.productVariant.create({
            data: {
                name: `${p.name} - Standard`,
                sku: `${p.sku}-STD`,
                productId: product.id,
            },
        });
        variants.push(variant);
    }
    console.log('✓ Created', products.length, 'products with variants');

    // Create Batches (for products with expiry)
    const lubricantVariant = variants.find(v => v.sku === 'LUBE-007-STD')!;
    const thinnerVariant = variants.find(v => v.sku === 'PAIN-008-STD')!;

    const batches = await Promise.all([
        prisma.batch.create({
            data: {
                code: 'LOT-2024-A01',
                productVariantId: lubricantVariant.id,
                manufacturingDate: new Date('2023-06-01'),
                expiryDate: new Date('2025-06-01'),
            },
        }),
        prisma.batch.create({
            data: {
                code: 'LOT-2024-D04',
                productVariantId: thinnerVariant.id,
                manufacturingDate: new Date('2023-12-15'),
                expiryDate: new Date('2024-06-15'),
            },
        }),
    ]);
    console.log('✓ Created', batches.length, 'batches');

    // Create Stock records
    const stockData = [
        { variant: 'GEAR-001-STD', warehouse: 'Main Warehouse', quantity: 156 },
        { variant: 'BEAR-002-STD', warehouse: 'Main Warehouse', quantity: 320 },
        { variant: 'PUMP-003-STD', warehouse: 'Storage B', quantity: 28 },
        { variant: 'BOLT-004-STD', warehouse: 'Main Warehouse', quantity: 1200 },
        { variant: 'MOTR-005-STD', warehouse: 'Storage B', quantity: 12 },
        { variant: 'CONV-006-STD', warehouse: 'Main Warehouse', quantity: 8 },
        { variant: 'LUBE-007-STD', warehouse: 'Storage B', quantity: 50, batch: 'LOT-2024-A01' },
        { variant: 'PAIN-008-STD', warehouse: 'Storage B', quantity: 30, batch: 'LOT-2024-D04' },
    ];

    for (const s of stockData) {
        const variant = variants.find(v => v.sku === s.variant);
        const warehouse = warehouses.find(w => w.name === s.warehouse);
        const batch = s.batch ? batches.find(b => b.code === s.batch) : null;

        await prisma.stock.create({
            data: {
                productVariantId: variant!.id,
                warehouseId: warehouse!.id,
                quantity: s.quantity,
                batchId: batch?.id,
            },
        });
    }
    console.log('✓ Created stock records');

    // Create Stock Movements
    const employee = users.find(u => u.role === Role.EMPLOYEE)!;

    const movements = await Promise.all([
        prisma.stockMovement.create({
            data: {
                code: 'MOV-2024-001',
                type: MovementType.INBOUND,
                status: MovementStatus.COMPLETED,
                date: new Date('2024-01-31'),
                reference: 'PO-2024-001',
                toWarehouseId: warehouses[0].id,
                tenantId: tenant.id,
                createdById: employee.id,
                items: {
                    create: [
                        { productVariantId: variants[0].id, quantity: 100 },
                    ],
                },
            },
        }),
        prisma.stockMovement.create({
            data: {
                code: 'MOV-2024-002',
                type: MovementType.OUTBOUND,
                status: MovementStatus.COMPLETED,
                date: new Date('2024-01-31'),
                reference: 'SO-2024-001',
                fromWarehouseId: warehouses[0].id,
                tenantId: tenant.id,
                createdById: employee.id,
                items: {
                    create: [
                        { productVariantId: variants[1].id, quantity: 50 },
                    ],
                },
            },
        }),
        prisma.stockMovement.create({
            data: {
                code: 'MOV-2024-003',
                type: MovementType.TRANSFER,
                status: MovementStatus.DRAFT,
                date: new Date('2024-01-30'),
                fromWarehouseId: warehouses[1].id,
                toWarehouseId: warehouses[0].id,
                tenantId: tenant.id,
                createdById: employee.id,
                items: {
                    create: [
                        { productVariantId: variants[2].id, quantity: 10 },
                    ],
                },
            },
        }),
    ]);
    console.log('✓ Created', movements.length, 'stock movements');

    // Create Chart of Accounts (VAS - selected)
    const accounts = await Promise.all([
        prisma.account.create({ data: { code: '111', name: 'Tiền mặt', type: AccountType.ASSET, tenantId: tenant.id } }),
        prisma.account.create({ data: { code: '112', name: 'Tiền gửi ngân hàng', type: AccountType.ASSET, tenantId: tenant.id } }),
        prisma.account.create({ data: { code: '131', name: 'Phải thu của khách hàng', type: AccountType.ASSET, tenantId: tenant.id } }),
        prisma.account.create({ data: { code: '152', name: 'Nguyên liệu, vật liệu', type: AccountType.ASSET, tenantId: tenant.id } }),
        prisma.account.create({ data: { code: '156', name: 'Hàng hóa', type: AccountType.ASSET, tenantId: tenant.id } }),
        prisma.account.create({ data: { code: '331', name: 'Phải trả cho người bán', type: AccountType.LIABILITY, tenantId: tenant.id } }),
        prisma.account.create({ data: { code: '411', name: 'Vốn đầu tư của chủ sở hữu', type: AccountType.EQUITY, tenantId: tenant.id } }),
        prisma.account.create({ data: { code: '511', name: 'Doanh thu bán hàng', type: AccountType.REVENUE, tenantId: tenant.id } }),
        prisma.account.create({ data: { code: '632', name: 'Giá vốn hàng bán', type: AccountType.EXPENSE, tenantId: tenant.id } }),
        prisma.account.create({ data: { code: '642', name: 'Chi phí quản lý doanh nghiệp', type: AccountType.EXPENSE, tenantId: tenant.id } }),
    ]);
    console.log('✓ Created', accounts.length, 'accounts');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test credentials:');
    console.log('   admin@example.com / password123');
    console.log('   manager@example.com / password123');
    console.log('   employee@example.com / password123');
    console.log('   customer@example.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
