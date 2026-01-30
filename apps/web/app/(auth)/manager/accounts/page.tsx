'use client';

import { useState } from 'react';
import { Users, Search, Shield, Mail, Building2, Plus, Edit2, MoreVertical } from 'lucide-react';

// Mock accounts data
const accounts = [
    { id: '1', name: 'Nguyen Van A', email: 'nguyen.a@company.com', role: 'MANAGER', warehouse: 'Main Warehouse', status: 'ACTIVE', lastLogin: '2024-01-31 09:00' },
    { id: '2', name: 'Tran Thi B', email: 'tran.b@company.com', role: 'EMPLOYEE', warehouse: 'Main Warehouse', status: 'ACTIVE', lastLogin: '2024-01-31 08:30' },
    { id: '3', name: 'Le Van C', email: 'le.c@company.com', role: 'EMPLOYEE', warehouse: 'Storage B', status: 'ACTIVE', lastLogin: '2024-01-30 17:00' },
    { id: '4', name: 'Pham Thi D', email: 'pham.d@company.com', role: 'ACCOUNTANT', warehouse: null, status: 'ACTIVE', lastLogin: '2024-01-31 08:45' },
    { id: '5', name: 'Ho Van E', email: 'ho.e@company.com', role: 'CUSTOMER', warehouse: null, status: 'ACTIVE', lastLogin: '2024-01-29 14:20' },
    { id: '6', name: 'Vu Thi F', email: 'vu.f@company.com', role: 'EMPLOYEE', warehouse: 'Cold Storage', status: 'INACTIVE', lastLogin: '2024-01-15 09:00' },
];

const roleColors: Record<string, string> = {
    ADMIN: 'error',
    MANAGER: 'accent',
    EMPLOYEE: 'primary',
    ACCOUNTANT: 'warning',
    CUSTOMER: 'success',
};

export default function AccountsPage() {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    const roles = ['All', 'MANAGER', 'EMPLOYEE', 'ACCOUNTANT', 'CUSTOMER'];

    const filtered = accounts.filter((a) => {
        const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'All' || a.role === roleFilter;
        return matchSearch && matchRole;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">User Accounts</h1>
                    <p className="text-[rgb(var(--muted))]">Manage employee and customer accounts</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--primary))] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] cursor-pointer"
                >
                    {roles.map((role) => (
                        <option key={role} value={role}>{role === 'All' ? 'All Roles' : role}</option>
                    ))}
                </select>
            </div>

            {/* Accounts Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-elevated))]">
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">User</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Role</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Warehouse</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Last Login</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-[rgb(var(--muted))]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((account) => (
                                <tr key={account.id} className="border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--surface-elevated))]/50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--accent))] flex items-center justify-center text-white text-sm font-medium">
                                                {account.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{account.name}</p>
                                                <p className="text-xs text-[rgb(var(--muted))] flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {account.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[rgb(var(--${roleColors[account.role]}))]/10 text-[rgb(var(--${roleColors[account.role]}))]`}>
                                            <Shield className="w-3 h-3" />
                                            {account.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        {account.warehouse ? (
                                            <span className="flex items-center gap-1 text-[rgb(var(--muted))]">
                                                <Building2 className="w-3 h-3" />
                                                {account.warehouse}
                                            </span>
                                        ) : (
                                            <span className="text-[rgb(var(--muted))]">—</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${account.status === 'ACTIVE'
                                                ? 'bg-[rgb(var(--success))]/10 text-[rgb(var(--success))]'
                                                : 'bg-[rgb(var(--muted))]/10 text-[rgb(var(--muted))]'
                                            }`}>
                                            {account.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-[rgb(var(--muted))]">
                                        {account.lastLogin}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-1">
                                            <button className="p-1.5 rounded-lg hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer" title="Edit">
                                                <Edit2 className="w-4 h-4 text-[rgb(var(--muted))]" />
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-[rgb(var(--surface-elevated))] transition-colors cursor-pointer" title="More">
                                                <MoreVertical className="w-4 h-4 text-[rgb(var(--muted))]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-[rgb(var(--muted))] mb-4" />
                    <p className="text-[rgb(var(--muted))]">No accounts found</p>
                </div>
            )}
        </div>
    );
}
