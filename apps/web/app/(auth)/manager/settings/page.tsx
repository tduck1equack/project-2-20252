'use client';

import { Settings, Bell, Shield, Palette, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-3xl space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">Settings</h1>
                <p className="text-[rgb(var(--muted))]">Configure system preferences</p>
            </div>

            {/* Notifications */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[rgb(var(--primary))]/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-[rgb(var(--primary))]" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-[rgb(var(--foreground))]">Notifications</h2>
                        <p className="text-sm text-[rgb(var(--muted))]">Manage alert preferences</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { label: 'Low stock alerts', description: 'Get notified when items fall below minimum levels', checked: true },
                        { label: 'New order notifications', description: 'Receive alerts for new customer orders', checked: true },
                        { label: 'Movement approvals', description: 'Notify for pending movement approvals', checked: false },
                        { label: 'Daily summary email', description: 'Receive daily digest of activities', checked: true },
                    ].map((setting, i) => (
                        <div key={i} className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium">{setting.label}</p>
                                <p className="text-xs text-[rgb(var(--muted))]">{setting.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked={setting.checked} className="sr-only peer" />
                                <div className="w-11 h-6 bg-[rgb(var(--border))] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[rgb(var(--primary))] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgb(var(--primary))]"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[rgb(var(--accent))]/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[rgb(var(--accent))]" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-[rgb(var(--foreground))]">Security</h2>
                        <p className="text-sm text-[rgb(var(--muted))]">Account security settings</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                        <select className="w-full max-w-xs px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm cursor-pointer">
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60" selected>1 hour</option>
                            <option value="120">2 hours</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-sm font-medium">Two-factor authentication</p>
                            <p className="text-xs text-[rgb(var(--muted))]">Add an extra layer of security</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] hover:bg-[rgb(var(--border))] text-sm font-medium transition-colors cursor-pointer">
                            Enable
                        </button>
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[rgb(var(--success))]/10 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-[rgb(var(--success))]" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-[rgb(var(--foreground))]">Appearance</h2>
                        <p className="text-sm text-[rgb(var(--muted))]">Customize the interface</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Theme</label>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 rounded-lg bg-[rgb(var(--primary))] text-white text-sm font-medium cursor-pointer">
                                Dark
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] text-sm font-medium cursor-pointer">
                                Light
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] text-sm font-medium cursor-pointer">
                                System
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Localization */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[rgb(var(--warning))]/10 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-[rgb(var(--warning))]" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-[rgb(var(--foreground))]">Localization</h2>
                        <p className="text-sm text-[rgb(var(--muted))]">Regional preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Language</label>
                        <select className="w-full px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm cursor-pointer">
                            <option>English</option>
                            <option selected>Tiếng Việt</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Currency</label>
                        <select className="w-full px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm cursor-pointer">
                            <option selected>VND (₫)</option>
                            <option>USD ($)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer">
                    <Save className="w-4 h-4" />
                    Save Settings
                </button>
            </div>
        </div>
    );
}
