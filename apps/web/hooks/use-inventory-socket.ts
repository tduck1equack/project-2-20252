"use client";

import { useEffect } from "react";
import { useSocket } from "../providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";

export const useInventorySocket = (tenantId?: string) => {
    const { socket, isConnected } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket || !isConnected || !tenantId) return;

        // Join Tenant Room
        socket.emit("joinTenant", tenantId);

        // Listen for updates
        const handleStockUpdate = (data: any) => {
            console.log("Stock Update Received:", data);
            // Invalidate Queries
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["stock"] });
        };

        socket.on("stock.updated", handleStockUpdate);

        return () => {
            socket.off("stock.updated", handleStockUpdate);
        };
    }, [socket, isConnected, tenantId, queryClient]);
};
