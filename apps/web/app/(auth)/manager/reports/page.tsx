'use client';

import { FileText, Download, Calendar, TrendingUp, Package, Truck, DollarSign } from 'lucide-react';

const reports = [
    {
        id: '1',
        name: 'Inventory Summary Report',
        description: 'Current stock levels across all warehouses',
        icon: Package,
        color: 'primary',
        lastGenerated: '2024-01-31',
    },
    {
        id: '2',
        name: 'Stock Movement Report',
        description: 'Inbound, outbound, and transfer activities',
        icon: Truck,
        color: 'accent',
        lastGenerated: '2024-01-30',
    },
    {
        id: '3',
        name: 'Financial Summary',
        description: 'Revenue and cost analysis',
        icon: DollarSign,
        color: 'success',
        lastGenerated: '2024-01-29',
    },
    {
        id: '4',
        name: 'Trend Analysis',
        description: 'Stock trends and demand forecasting',
        icon: TrendingUp,
        color: 'warning',
        lastGenerated: '2024-01-28',
    },
];

export default function ReportsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">Reports</h1>
                <p className="text-[rgb(var(--muted))]">Generate and download business reports</p>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report) => {
                    const Icon = report.icon;

                    return (
                        <div key={report.id} className="glass-card p-6 stat-card">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-[rgb(var(--${report.color}))]/10 flex items-center justify-center shrink-0`}>
                                    <Icon className={`w-6 h-6 text-[rgb(var(--${report.color}))]`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-[rgb(var(--foreground))]">{report.name}</h3>
                                    <p className="text-sm text-[rgb(var(--muted))] mt-1">{report.description}</p>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-[rgb(var(--muted))]">
                                        <Calendar className="w-3 h-3" />
                                        Last generated: {report.lastGenerated}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-[rgb(var(--border))]">
                                <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] hover:bg-[rgb(var(--border))] transition-colors text-sm font-medium cursor-pointer">
                                    <FileText className="w-4 h-4" />
                                    View
                                </button>
                                <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--primary))] text-white hover:opacity-90 transition-opacity text-sm font-medium cursor-pointer">
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Custom Report Section */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-4">Generate Custom Report</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                            Report Type
                        </label>
                        <select className="w-full px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] cursor-pointer">
                            <option>Inventory Summary</option>
                            <option>Stock Movement</option>
                            <option>Financial Summary</option>
                            <option>Trend Analysis</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                            Date Range
                        </label>
                        <select className="w-full px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] cursor-pointer">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                            <option>This year</option>
                            <option>Custom range</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                            Warehouse
                        </label>
                        <select className="w-full px-4 py-2 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] cursor-pointer">
                            <option>All Warehouses</option>
                            <option>Main Warehouse</option>
                            <option>Storage B</option>
                            <option>Cold Storage</option>
                        </select>
                    </div>
                </div>
                <button className="mt-4 inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer">
                    <FileText className="w-4 h-4" />
                    Generate Report
                </button>
            </div>
        </div>
    );
}
