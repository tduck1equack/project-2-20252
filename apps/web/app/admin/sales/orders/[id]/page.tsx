"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
import { Loader2, FileCheck, FileX, FileText } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used, or alert

interface OrderDetail {
    id: string;
    code: string;
    totalAmount: string;
    taxAmount: string;
    status: string;
    customer: { name: string; email: string };
    items: any[];
    einvoiceLogs: { id: string; status: string; externalUrl?: string; invoiceNo: string }[];
}

export default function OrderDetailPage() {
    const params = useParams();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [issuing, setIssuing] = useState(false);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(\`http://localhost:3001/sales/orders/\${params.id}\`, {
                headers: { Authorization: \`Bearer \${token}\` }
            });
            const json = await res.json();
            if (json.success) setOrder(json.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) fetchOrder();
    }, [params.id]);

    const handleIssueInvoice = async () => {
        setIssuing(true);
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(\`http://localhost:3001/einvoice/issue\`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: \`Bearer \${token}\`
                },
                body: JSON.stringify({ orderId: params.id })
            });
            const json = await res.json();
            if (res.ok) {
                toast.success("E-Invoice Issued Successfully!");
                fetchOrder(); // Refresh to see new log
            } else {
                toast.error(json.message || "Failed to issue invoice");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIssuing(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!order) return <div>Order not found</div>;

    const activeInvoice = order.einvoiceLogs?.find(l => l.status === 'PUBLISHED');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order {order.code}</h1>
                    <div className="text-muted-foreground">Created on {new Date().toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                    {/* E-Invoice Actions */}
                    {activeInvoice ? (
                        <Button variant="outline" className="gap-2 text-green-600 border-green-200 bg-green-50">
                            <FileCheck className="h-4 w-4" />
                            Invoice Issued ({activeInvoice.invoiceNo || 'Sent'})
                        </Button>
                    ) : (
                        <Button onClick={handleIssueInvoice} disabled={issuing} className="gap-2">
                            {issuing ? <Loader2 className="animate-spin h-4 w-4" /> : <FileText className="h-4 w-4" />}
                            Issue E-Invoice
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.productVariant?.name}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">{Number(item.unitPrice).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{Number(item.totalPrice).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end gap-12 text-sm">
                            <div className="space-y-1 text-right">
                                <div className="text-muted-foreground">Subtotal</div>
                                <div className="text-muted-foreground">VAT (10%)</div>
                                <div className="font-bold text-lg">Total</div>
                            </div>
                            <div className="space-y-1 text-right">
                                <div>{Number(order.totalAmount).toLocaleString()} ₫</div>
                                <div>{Number(order.taxAmount || 0).toLocaleString()} ₫</div>
                                <div className="font-bold text-lg">{(Number(order.totalAmount) + Number(order.taxAmount || 0)).toLocaleString()} ₫</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
                        <CardContent>
                            <div className="font-medium">{order.customer?.name}</div>
                            <div className="text-muted-foreground">{order.customer?.email}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>E-Invoice History</CardTitle></CardHeader>
                        <CardContent>
                            {order.einvoiceLogs?.length === 0 ? (
                                <div className="text-sm text-muted-foreground">No invoices generated yet.</div>
                            ) : (
                                <div className="space-y-2">
                                    {order.einvoiceLogs?.map(log => (
                                        <div key={log.id} className="flex items-center justify-between text-sm border p-2 rounded">
                                            <span>{new Date().toLocaleDateString()}</span>
                                            <Badge variant={log.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                                                {log.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
