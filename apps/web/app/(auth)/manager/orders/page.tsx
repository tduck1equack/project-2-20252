'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Package, CheckCircle, Truck, XCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Order {
    id: string;
    code: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    customer?: { name: string; email: string };
    items: { productVariant: { name: string }; quantity: number; unitPrice: number }[];
}

const statusStyles: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-500',
    CONFIRMED: 'bg-blue-500/10 text-blue-500',
    SHIPPED: 'bg-green-500/10 text-green-500',
    CANCELLED: 'bg-red-500/10 text-red-500',
};

const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Package className="w-4 h-4" />,
    CONFIRMED: <CheckCircle className="w-4 h-4" />,
    SHIPPED: <Truck className="w-4 h-4" />,
    CANCELLED: <XCircle className="w-4 h-4" />,
};

export default function ManagerOrdersPage() {
    const queryClient = useQueryClient();
    const [processingId, setProcessingId] = useState<string | null>(null);

    const { data: orders, isLoading } = useQuery<Order[]>({
        queryKey: ['orders'],
        queryFn: async () => {
            const res = await api.get('/sales/orders');
            return res.data || res;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            return api.patch(`/sales/orders/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setProcessingId(null);
        },
        onError: () => {
            setProcessingId(null);
        }
    });

    const handleProcess = (order: Order) => {
        setProcessingId(order.id);
        const nextStatus = order.status === 'PENDING' ? 'CONFIRMED' : order.status === 'CONFIRMED' ? 'SHIPPED' : null;
        if (nextStatus) {
            updateStatusMutation.mutate({ id: order.id, status: nextStatus });
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">Order Management</h1>
                <p className="text-[rgb(var(--muted))] mt-1">Review and process customer orders</p>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[rgb(var(--muted))]/5">
                        <tr className="text-left text-sm text-[rgb(var(--muted))]">
                            <th className="p-4">Order #</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[rgb(var(--muted))]" />
                                </td>
                            </tr>
                        ) : orders?.map(order => (
                            <tr key={order.id} className="border-t border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))]/5 transition-colors">
                                <td className="p-4 font-mono text-sm">{order.code}</td>
                                <td className="p-4">
                                    <div className="font-medium">{order.customer?.name || 'N/A'}</div>
                                    <div className="text-xs text-[rgb(var(--muted))]">{order.customer?.email}</div>
                                </td>
                                <td className="p-4 text-sm">{order.items.length} item(s)</td>
                                <td className="p-4 font-semibold">${Number(order.totalAmount).toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[order.status] || ''}`}>
                                        {statusIcons[order.status]}
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {order.status !== 'SHIPPED' && order.status !== 'CANCELLED' && (
                                        <button
                                            onClick={() => handleProcess(order)}
                                            disabled={processingId === order.id}
                                            className="btn-primary text-xs px-3 py-1.5"
                                        >
                                            {processingId === order.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : order.status === 'PENDING' ? 'Confirm' : 'Ship'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {!isLoading && orders?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-[rgb(var(--muted))]">
                                    No orders yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
