"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
] as const;

export function LanguageSwitcher() {
    const router = useRouter();
    const [currentLocale, setCurrentLocale] = React.useState<string>("en");
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        // Read locale from cookie
        const localeCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("NEXT_LOCALE="))
            ?.split("=")[1];
        if (localeCookie) {
            setCurrentLocale(localeCookie);
        }
    }, []);

    const handleLocaleChange = (locale: string) => {
        // Set cookie for 1 year
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
        setCurrentLocale(locale);
        // Refresh to apply new locale
        router.refresh();
    };

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <span className="sr-only">Switch language</span>
            </Button>
        );
    }

    const currentLanguage = languages.find((l) => l.code === currentLocale) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 cursor-pointer gap-2 px-3 transition-colors hover:bg-[rgb(var(--surface-elevated))]"
                >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentLanguage.label}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLocaleChange(lang.code)}
                        className="cursor-pointer gap-2"
                    >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        {currentLocale === lang.code && (
                            <span className="ml-auto text-primary">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
