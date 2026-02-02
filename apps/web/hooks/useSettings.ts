import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useSettings() {
    const queryClient = useQueryClient();

    const { data: settings, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const res = await api.get<Record<string, string>>('/settings');
            return res.data;
        }
    });

    const updateSettings = useMutation({
        mutationFn: async (data: Record<string, string>) => {
            const res = await api.patch<Record<string, string>>('/settings', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            toast.success('Settings updated');
        },
        onError: () => {
            toast.error('Failed to update settings');
        }
    });

    return { settings, isLoading, updateSettings };
}
