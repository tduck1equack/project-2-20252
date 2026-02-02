import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AdminStats {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    topProducts: { productVariantId: string; _sum: { quantity: number } }[];
    systemHealth: { uptime: number; memory: any };
    recentActivity: { id: string; type: string; title: string; description: string; time: string; color: string }[];
}

export function useAdminAnalytics() {
    return useQuery({
        queryKey: ['admin-analytics'],
        queryFn: async () => {
            const res = await api.get<AdminStats>('/analytics/admin');
            return res.data;
        }
    });
}
