'use client';

import { useAuthStore } from '@/stores/auth-store';
import { User, Mail, Building2, Shield, Save } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuthStore();

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">Profile Settings</h1>
                <p className="text-[rgb(var(--muted))]">Manage your account information</p>
            </div>

            {/* Profile Card */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--accent))] flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.[0] || user?.email?.[0] || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{user?.name || 'Customer'}</h2>
                        <p className="text-sm text-[rgb(var(--muted))]">{user?.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                            <User className="w-4 h-4" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            defaultValue={user?.name || ''}
                            className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            defaultValue={user?.email || ''}
                            disabled
                            className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] opacity-60 cursor-not-allowed"
                        />
                        <p className="text-xs text-[rgb(var(--muted))] mt-1">Contact support to change email</p>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                            <Shield className="w-4 h-4" />
                            Account Role
                        </label>
                        <div className="px-4 py-3 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))]">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))] text-sm font-medium">
                                <Shield className="w-3 h-3" />
                                {user?.role || 'CUSTOMER'}
                            </span>
                        </div>
                    </div>

                    {/* Tenant */}
                    {user?.tenantId && (
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                                <Building2 className="w-4 h-4" />
                                Organization
                            </label>
                            <div className="px-4 py-3 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm">
                                {user.tenantId}
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer mt-6">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card p-6 border border-[rgb(var(--error))]/20">
                <h3 className="text-lg font-semibold text-[rgb(var(--error))] mb-2">Danger Zone</h3>
                <p className="text-sm text-[rgb(var(--muted))] mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="px-4 py-2 rounded-lg border border-[rgb(var(--error))] text-[rgb(var(--error))] hover:bg-[rgb(var(--error))]/10 transition-colors text-sm font-medium cursor-pointer">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
