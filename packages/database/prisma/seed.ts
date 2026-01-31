import { PrismaClient, Role, OrderStatus, MovementType, MovementStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create Demo Tenant
    const tenant = await prisma.tenant.upsert({
        where: { id: 'demo-tenant' },
        update: {},
        create: {
            id: 'demo-tenant',
            name: 'Demo Company'
        }
    });
    console.log('✅ Tenant created:', tenant.name);

    // 2. Create Users
    const passwordHash = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@demo.com' },
        update: {},
        create: {
            email: 'admin@demo.com',
            password: passwordHash,
            name: 'Admin User',
            role: Role.ADMIN,
            tenantId: tenant.id
        }
    });

    const manager = await prisma.user.upsert({
        where: { email: 'manager@demo.com' },
        update: {},
        create: {
            email: 'manager@demo.com',
            password: passwordHash,
            name: 'Manager User',
            role: Role.MANAGER,
            tenantId: tenant.id
        }
    });

    const customer = await prisma.user.upsert({
        where: { email: 'customer@demo.com' },
        update: {},
        create: {
            email: 'customer@demo.com',
            password: passwordHash,
            name: 'John Customer',
            role: Role.CUSTOMER,
            tenantId: tenant.id
        }
    });
    console.log('✅ Users created: admin, manager, customer');

    // 3. Create UoM
    const uom = await prisma.uom.upsert({
        where: { code: 'PCS' },
        update: {},
        create: {
            code: 'PCS',
            name: 'Pieces',
            tenantId: tenant.id
        }
    });

    // 4. Create Warehouse
    const warehouse = await prisma.warehouse.upsert({
        where: { id: 'demo-warehouse' },
        update: {},
        create: {
            id: 'demo-warehouse',
            name: 'Main Warehouse',
            location: 'Ho Chi Minh City',
            tenantId: tenant.id
        }
    });
    console.log('✅ Warehouse created:', warehouse.name);

    // 5. Create Products with Variants
    const products = [
        {
            name: 'Laptop', sku: 'LAPTOP-001', variants: [
                { name: 'Laptop - 15 inch', sku: 'LAPTOP-15', price: 999.99 },
                { name: 'Laptop - 17 inch', sku: 'LAPTOP-17', price: 1299.99 }
            ]
        },
        {
            name: 'Mouse', sku: 'MOUSE-001', variants: [
                { name: 'Mouse - Wireless', sku: 'MOUSE-WL', price: 29.99 },
                { name: 'Mouse - Wired', sku: 'MOUSE-WD', price: 19.99 }
            ]
        },
        {
            name: 'Keyboard', sku: 'KB-001', variants: [
                { name: 'Keyboard - Mechanical', sku: 'KB-MECH', price: 89.99 },
                { name: 'Keyboard - Membrane', sku: 'KB-MEMB', price: 29.99 }
            ]
        },
        {
            name: 'Monitor', sku: 'MON-001', variants: [
                { name: 'Monitor - 24 inch', sku: 'MON-24', price: 249.99 },
                { name: 'Monitor - 27 inch', sku: 'MON-27', price: 349.99 }
            ]
        },
        {
            name: 'Headphones', sku: 'HP-001', variants: [
                { name: 'Headphones - Wired', sku: 'HP-WD', price: 49.99 },
                { name: 'Headphones - Bluetooth', sku: 'HP-BT', price: 99.99 }
            ]
        }
    ];

    const createdVariants: { id: string; name: string }[] = [];

    for (const p of products) {
        const product = await prisma.product.upsert({
            where: { sku: p.sku },
            update: {},
            create: {
                name: p.name,
                sku: p.sku,
                uomId: uom.id,
                tenantId: tenant.id,
                variants: {
                    create: p.variants.map(v => ({
                        name: v.name,
                        sku: v.sku,
                        price: v.price
                    }))
                }
            },
            include: { variants: true }
        });
        createdVariants.push(...product.variants.map(v => ({ id: v.id, name: v.name })));
    }
    console.log('✅ Products created:', products.length);

    // 6. Create Stock
    for (const variant of createdVariants) {
        await prisma.stock.upsert({
            where: {
                warehouseId_productVariantId_batchId: {
                    warehouseId: warehouse.id,
                    productVariantId: variant.id,
                    batchId: null as any
                }
            },
            update: { quantity: Math.floor(Math.random() * 100) + 10 },
            create: {
                warehouseId: warehouse.id,
                productVariantId: variant.id,
                quantity: Math.floor(Math.random() * 100) + 10
            }
        });
    }
    console.log('✅ Stock levels created');

    // 7. Create Sample Orders
    const orderStatuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED];
    for (let i = 0; i < 10; i++) {
        const items = createdVariants.slice(0, Math.floor(Math.random() * 3) + 1).map(v => ({
            productVariantId: v.id,
            quantity: Math.floor(Math.random() * 5) + 1,
            unitPrice: Math.random() * 100 + 20,
            totalPrice: 0
        }));
        items.forEach(item => { item.totalPrice = item.unitPrice * item.quantity; });
        const totalAmount = items.reduce((acc, item) => acc + item.totalPrice, 0);

        await prisma.salesOrder.create({
            data: {
                code: `SO-DEMO-${1000 + i}`,
                tenantId: tenant.id,
                customerId: customer.id,
                status: orderStatuses[i % orderStatuses.length],
                totalAmount,
                items: { create: items },
                createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) // spread over days
            }
        });
    }
    console.log('✅ Sample orders created: 10');

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
