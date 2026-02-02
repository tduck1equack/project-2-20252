"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceSheet } from "@/components/accounting/BalanceSheet";
import { IncomeStatement } from "@/components/accounting/IncomeStatement";

export default function AccountingPage() {
    // const t = useTranslations('accounting'); // Assume i18n later

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
                    <p className="text-muted-foreground">
                        Vietnamese Accounting Standards (VAS) Compliance Reports
                    </p>
                </div>
            </div>

            <Tabs defaultValue="balance-sheet" className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                    <TabsTrigger value="balance-sheet">Balance Sheet (B01)</TabsTrigger>
                    <TabsTrigger value="income-statement">P&L (B02)</TabsTrigger>
                </TabsList>
                <TabsContent value="balance-sheet" className="mt-6">
                    <BalanceSheet />
                </TabsContent>
                <TabsContent value="income-statement" className="mt-6">
                    <IncomeStatement />
                </TabsContent>
            </Tabs>
        </div>
    );
}
