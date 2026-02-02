"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponseDto } from '@repo/dto';
import { useAuthStore } from '@/stores/auth-store';

export interface Order {
    id: string;
    code: string;
    customer: { name: string; email: string };
    totalAmount: string;
    status: string;
    createdAt: string;
}

export interface OrderDetail extends Order {
    items: any[];
    taxAmount: string;
    einvoiceLogs: { id: string; status: string; externalUrl?: string; invoiceNo: string }[];
}

async function fetchApi<T>(url: string): Promise<T> {
    const response = await api.get<any, ApiResponseDto<T>>(url);
    if (!response.success) {
        throw new Error(response.error?.message || 'Request failed');
    }
    return response.data as T;
}

async function postApi<T>(url: string, data: any): Promise<T> {
    const response = await api.post<any, ApiResponseDto<T>>(url, data);
    if (!response.success) {
        throw new Error(response.error?.message || 'Request failed');
    }
    return response.data as T;
}

export function useSalesOrders() {
    const { accessToken } = useAuthStore();
    return useQuery({
        queryKey: ['orders'],
        queryFn: () => fetchApi<Order[]>('/sales/orders'),
        enabled: !!accessToken
    });
}

export function useSalesOrder(id: string) {
    const { accessToken } = useAuthStore();
    return useQuery({
        queryKey: ['orders', id],
        queryFn: () => fetchApi<OrderDetail>(`/sales/orders/${id}`),
        enabled: !!accessToken && !!id
    });
}

export function useIssueInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderId: string) => postApi<any>('/einvoice/issue', { orderId }),
        onSuccess: (data, orderId) => {
            queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
        }
    });
}
