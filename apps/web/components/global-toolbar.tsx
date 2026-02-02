"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { NotificationBell } from "./notification-bell";

interface GlobalToolbarProps {
    className?: string;
    /** Orientation of the toolbar items */
    orientation?: "horizontal" | "vertical";
}

/**
 * Global toolbar with theme toggle and language switcher.
 * Can be placed in any layout - sidebar or navbar.
 */
export function GlobalToolbar({
    className = "",
    orientation = "horizontal",
}: GlobalToolbarProps) {
    const orientationClass =
        orientation === "horizontal"
            ? "flex items-center gap-2"
            : "flex flex-col gap-2";

    return (
        <div className={`${orientationClass} ${className}`}>
            <ThemeToggle />
            <LanguageSwitcher />
            <NotificationBell />
        </div>
    );
}
