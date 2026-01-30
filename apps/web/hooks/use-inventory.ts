'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
    ProductDto,
    WarehouseDto,
    StockLevelDto,
    StockMovementDto,
    CreateStockMovementDto,
    ApiResponseDto
} from '@repo/dto';
import { useAuthStore } from '@/stores/auth-store';

// Helper to unwrap API response
async function fetchApi<T>(url: string, config?: any): Promise<T> {
    const response = await api.get<any, ApiResponseDto<T>>(url, config);
    if (!response.success) {
        throw new Error(response.error?.message || 'Request failed');
    }
    // Handle data optionality
    return response.data as T;
}

async function postApi<T>(url: string, data: any): Promise<T> {
    const response = await api.post<any, ApiResponseDto<T>>(url, data);
    if (!response.success) {
        throw new Error(response.error?.message || 'Request failed');
    }
    return response.data as T;
}

export function useProducts(search?: string) {
    const { accessToken } = useAuthStore();
    return useQuery({
        queryKey: ['products', search],
        queryFn: () => fetchApi<ProductDto[]>(`/api/v1/products${search ? `?search=${search}` : ''}`),
        enabled: !!accessToken
    });
}

export function useWarehouses() {
    const { accessToken } = useAuthStore();
    return useQuery({
        queryKey: ['warehouses'],
        queryFn: () => fetchApi<WarehouseDto[]>('/api/v1/warehouses'),
        enabled: !!accessToken
    });
}

export function useStockLevels(warehouseId?: string, search?: string) {
    const { accessToken } = useAuthStore();
    let query = '';
    const params = new URLSearchParams();
    if (warehouseId) params.append('warehouseId', warehouseId);
    if (search) params.append('search', search);
    if (params.toString()) query = `?${params.toString()}`;

    return useQuery({
        queryKey: ['stock', warehouseId, search],
        queryFn: () => fetchApi<StockLevelDto[]>(`/api/v1/stock${query}`),
        enabled: !!accessToken
    });
}

export function useMovements() {
    const { accessToken } = useAuthStore();
    return useQuery({
        queryKey: ['movements'],
        queryFn: () => fetchApi<StockMovementDto[]>('/api/v1/movements'),
        enabled: !!accessToken
    });
}

export function useCreateMovement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateStockMovementDto) => postApi<StockMovementDto>('/api/v1/movements', dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stock'] });
            queryClient.invalidateQueries({ queryKey: ['movements'] });
        }
    });
}
