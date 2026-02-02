"use client";

import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface AccountChange {
    id: string;
    code: string;
    name: string;
    type: string;
    netChange: number;
}

export function IncomeStatement() {
    const [fromDate, setFromDate] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
    const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [data, setData] = useState<{ revenue: number, expenses: number, netProfit: number, details: AccountChange[] } | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(\`http://localhost:3001/reports/financial/income-statement?fromDate=\${fromDate}&toDate=\${toDate}\`, {
                headers: { Authorization: \`Bearer \${token}\` }
            });
            const json = await res.json();
            if (json.success) {
                setData(json.data);
            }
        } catch (error) {
            console.error("Failed to fetch P&L", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const revenues = data?.details.filter(d => d.type === "REVENUE") || [];
    const expenses = data?.details.filter(d => d.type === "EXPENSE") || [];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Input 
                    type="date" 
                    value={fromDate} 
                    onChange={(e) => setFromDate(e.target.value)} 
                    className="w-48"
                />
                <span className="text-muted-foreground">-</span>
                <Input 
                    type="date" 
                    value={toDate} 
                    onChange={(e) => setToDate(e.target.value)} 
                    className="w-48"
                />
                <Button onClick={fetchData} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Report
                </Button>
            </div>

            {data && (
                <div className="grid grid-cols-1 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Income Statement (Kết quả kinh doanh)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                    <div className="text-sm text-green-600 font-medium">Total Revenue</div>
                                    <div className="text-2xl font-bold text-green-700">{data.revenue.toLocaleString()}</div>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                    <div className="text-sm text-red-600 font-medium">Total Expenses</div>
                                    <div className="text-2xl font-bold text-red-700">{data.expenses.toLocaleString()}</div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="text-sm text-blue-600 font-medium">Net Profit</div>
                                    <div className="text-2xl font-bold text-blue-700">{data.netProfit.toLocaleString()}</div>
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Account</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {revenues.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium text-green-600">Revenue</TableCell>
                                            <TableCell>{item.code} - {item.name}</TableCell>
                                            <TableCell className="text-right text-green-600">+{item.netChange.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {expenses.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium text-red-600">Expense</TableCell>
                                            <TableCell>{item.code} - {item.name}</TableCell>
                                            <TableCell className="text-right text-red-600">-{item.netChange.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
