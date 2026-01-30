
import Warehouse3DView from "@/components/inventory/warehouse-3d-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventoryPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Warehouse Visualization</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Zone A - Live View</CardTitle>
                </CardHeader>
                <CardContent>
                    <Warehouse3DView />
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Storage Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">87%</div>
                        <p className="text-xs text-muted-foreground">Capacity utilization</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Items in View</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-muted-foreground">Across 4 racks</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
