"use client";

import { useSettings } from "@/hooks/useSettings";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const { settings, updateSettings, isLoading } = useSettings();
    const [form, setForm] = useState<Record<string, string>>({});

    useEffect(() => {
        if (settings) {
            setForm(settings);
        }
    }, [settings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings.mutate(form);
    };

    if (isLoading) return <div>Loading Settings...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold mb-2">System Settings</h1>
                <p className="text-[rgb(var(--muted))]">Manage global configuration</p>
            </div>

            <GlassCard>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Site Title</label>
                        <Input
                            value={form['SITE_TITLE'] || ''}
                            onChange={(e) => setForm({ ...form, SITE_TITLE: e.target.value })}
                            placeholder="My ERP"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Logo URL</label>
                        <Input
                            value={form['LOGO_URL'] || ''}
                            onChange={(e) => setForm({ ...form, LOGO_URL: e.target.value })}
                            placeholder="https://example.com/logo.png"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Support Email</label>
                        <Input
                            value={form['SUPPORT_EMAIL'] || ''}
                            onChange={(e) => setForm({ ...form, SUPPORT_EMAIL: e.target.value })}
                            placeholder="support@example.com"
                        />
                    </div>

                    <Button type="submit" disabled={updateSettings.isPending}>
                        {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </GlassCard>
        </div>
    );
}
