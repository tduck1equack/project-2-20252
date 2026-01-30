'use client';

import { useState } from 'react';
import { useStockLevels, useWarehouses, useCreateMovement, useProducts } from '@/hooks/use-inventory';
import { useAuthStore } from '@/stores/auth-store';
import { MovementType, CreateStockMovementDto } from '@repo/dto';
import { Package, Plus, MapPin, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';

// Interface for Form
interface InboundForm {
    warehouseId: string;
    productVariantId: string;
    quantity: number;
    batchCode?: string;
}

export default function StockPage() {
    const { user } = useAuthStore();
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('');
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: warehouses } = useWarehouses();
    const { data: stocks, isLoading } = useStockLevels(selectedWarehouseId, search);
    const { data: products } = useProducts();

    const createMovement = useCreateMovement();
    const { register, handleSubmit, reset } = useForm<InboundForm>();

    const onSubmit = (data: InboundForm) => {
        const dto: CreateStockMovementDto = {
            type: MovementType.INBOUND,
            toWarehouseId: data.warehouseId,
            reference: 'Manual Inbound',
            items: [
                {
                    productVariantId: data.productVariantId,
                    quantity: Number(data.quantity),
                    batchCode: data.batchCode || undefined
                }
            ]
        };

        createMovement.mutate(dto, {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">Stock Management</h1>
                    <p className="text-[rgb(var(--muted))] mt-1">Manage inventory across warehouses</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[rgb(var(--primary))] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    Inbound Stock
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[rgb(var(--primary))]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <select
                        className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[rgb(var(--primary))]"
                        value={selectedWarehouseId}
                        onChange={(e) => setSelectedWarehouseId(e.target.value)}
                    >
                        <option value="">All Warehouses</option>
                        {warehouses?.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stock List */}
            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[rgb(var(--muted))]/10">
                        <tr>
                            <th className="p-4 text-xs font-medium text-[rgb(var(--muted))] uppercase">Product</th>
                            <th className="p-4 text-xs font-medium text-[rgb(var(--muted))] uppercase">SKU</th>
                            <th className="p-4 text-xs font-medium text-[rgb(var(--muted))] uppercase">Warehouse</th>
                            <th className="p-4 text-xs font-medium text-[rgb(var(--muted))] uppercase text-right">Quantity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgb(var(--border))]">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-[rgb(var(--muted))]">Loading stocks...</td></tr>
                        ) : stocks?.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-[rgb(var(--muted))]">No stock found.</td></tr>
                        ) : (
                            stocks?.map((stock, i) => (
                                <tr key={i} className="hover:bg-[rgb(var(--muted))]/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium">{stock.productName}</div>
                                        <div className="text-xs text-[rgb(var(--muted))]">{stock.variantName}</div>
                                    </td>
                                    <td className="p-4 text-sm font-mono text-[rgb(var(--muted))]">{stock.sku}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-3 h-3 text-[rgb(var(--muted))]" />
                                            {warehouses?.find(w => w.id === stock.warehouseId)?.name || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-semibold">{stock.quantity}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-[rgb(var(--background))] glass-card w-full max-w-md p-6 rounded-xl shadow-2xl animate-fade-in relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4">Inbound Stock</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Warehouse</label>
                                <select
                                    {...register('warehouseId', { required: true })}
                                    className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-lg px-3 py-2 text-sm"
                                >
                                    {warehouses?.map(w => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Product Variant</label>
                                <select
                                    {...register('productVariantId', { required: true })}
                                    className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="">Select Product...</option>
                                    {products?.map(p => (
                                        p.variants.map(v => (
                                            <option key={v.id} value={v.id}>{v.name} ({v.sku})</option>
                                        ))
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        step="any"
                                        {...register('quantity', { required: true, min: 0.0001 })}
                                        className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Batch Code (Optional)</label>
                                    <input
                                        type="text"
                                        {...register('batchCode')}
                                        className="w-full bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-lg px-3 py-2 text-sm"
                                        placeholder="e.g. LOT-123"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))]/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMovement.isPending}
                                    className="px-4 py-2 rounded-lg bg-[rgb(var(--primary))] text-white hover:opacity-90 disabled:opacity-50"
                                >
                                    {createMovement.isPending ? 'Processing...' : 'Confirm Inbound'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
