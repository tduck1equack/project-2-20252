"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponseDto } from '@repo/dto';
import { useAuthStore } from '@/stores/auth-store';

export interface AccountBalance {
    id: string;
    code: string;
    name: string;
    type: string;
    balance: number;
    parentId?: string | null;
}

export interface AccountChange {
    id: string;
    code: string;
    name: string;
    type: string;
    netChange: number;
}

export interface IncomeStatementData {
    period: { fromDate: string; toDate: string };
    revenue: number;
    expenses: number;
    netProfit: number;
    details: AccountChange[];
}

async function fetchApi<T>(url: string): Promise<T> {
    const response = await api.get<any, ApiResponseDto<T>>(url);
    if (!response.success) {
        throw new Error(response.error?.message || 'Request failed');
    }
    return response.data as T;
}

export function useBalanceSheet(date: string) {
    const { accessToken } = useAuthStore();
    return useQuery({
        queryKey: ['financial', 'balance-sheet', date],
        queryFn: () => fetchApi<AccountBalance[]>(`/reports/financial/balance-sheet?date=${date}`),
        enabled: !!accessToken && !!date
    });
}

export function useIncomeStatement(fromDate: string, toDate: string) {
    const { accessToken } = useAuthStore();
    return useQuery({
        queryKey: ['financial', 'income-statement', fromDate, toDate],
        queryFn: () => fetchApi<IncomeStatementData>(`/reports/financial/income-statement?fromDate=${fromDate}&toDate=${toDate}`),
        enabled: !!accessToken && !!fromDate && !!toDate
    });
}
