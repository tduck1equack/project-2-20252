import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary palette
                primary: {
                    DEFAULT: "#3B82F6",
                    50: "#EFF6FF",
                    100: "#DBEAFE",
                    200: "#BFDBFE",
                    300: "#93C5FD",
                    400: "#60A5FA",
                    500: "#3B82F6",
                    600: "#2563EB",
                    700: "#1D4ED8",
                    800: "#1E40AF",
                    900: "#1E3A8A",
                },
                // Secondary/Accent
                accent: {
                    DEFAULT: "#F97316",
                    50: "#FFF7ED",
                    100: "#FFEDD5",
                    200: "#FED7AA",
                    300: "#FDBA74",
                    400: "#FB923C",
                    500: "#F97316",
                    600: "#EA580C",
                    700: "#C2410C",
                },
                // Surface colors for cards/panels
                surface: {
                    DEFAULT: "#1A1A1A",
                    50: "#FAFAFA",
                    100: "#F5F5F5",
                    200: "#E5E5E5",
                    800: "#262626",
                    900: "#171717",
                    950: "#0A0A0A",
                },
                // Dark mode specific
                dark: {
                    bg: "#0F0F0F",
                    surface: "#1A1A1A",
                    elevated: "#262626",
                    border: "#2E2E2E",
                },
                // Light mode specific
                light: {
                    bg: "#F8FAFC",
                    surface: "#FFFFFF",
                    elevated: "#F1F5F9",
                    border: "#E2E8F0",
                },
            },
            fontFamily: {
                sans: ["Fira Sans", "system-ui", "sans-serif"],
                mono: ["Fira Code", "Consolas", "monospace"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
                "slide-in-right": "slideInRight 0.3s ease-out",
                "pulse-glow": "pulseGlow 2s ease-in-out infinite",
                "float": "float 6s ease-in-out infinite",
                "spin-slow": "spin 20s linear infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideInRight: {
                    "0%": { opacity: "0", transform: "translateX(-10px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                pulseGlow: {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-mesh": "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(249, 115, 22, 0.1) 100%)",
            },
            backdropBlur: {
                xs: "2px",
            },
        },
    },
    plugins: [],
};

export default config;
