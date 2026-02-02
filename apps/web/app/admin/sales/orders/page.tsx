"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { useSalesOrders } from "@/hooks/useSalesOrders";

export default function SalesOrdersPage() {
    const { data: orders, isLoading: loading } = useSalesOrders();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Order
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order Code</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : orders?.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.code}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{order.customer?.name || "Guest"}</span>
                                        <span className="text-xs text-muted-foreground">{order.customer?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{order.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{Number(order.totalAmount).toLocaleString()} ₫</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Link href={`/admin/sales/orders/${order.id}`}>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
