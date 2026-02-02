"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/providers/socket-provider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function NotificationBell() {
    const { isConnected } = useSocket();

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative cursor-pointer">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {isConnected && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-background" />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{isConnected ? "Connected to Live Updates" : "Disconnected"}</p>
            </TooltipContent>
        </Tooltip>
    );
}
