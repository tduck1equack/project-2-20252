'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/hooks/use-auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { GlobalToolbar } from '@/components/global-toolbar';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const loginMutation = useLogin();
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get('registered') === 'true';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };

    return (
        <>
            {/* Success message */}
            {justRegistered && (
                <div className="mb-6 p-4 rounded-lg bg-[rgb(var(--success))]/10 border border-[rgb(var(--success))]/20 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[rgb(var(--success))]" />
                    <p className="text-sm text-[rgb(var(--success))]">
                        Account created successfully! Please sign in.
                    </p>
                </div>
            )}

            {/* Login Form */}
            <div className="glass-card p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            autoComplete="email"
                            className={`w-full px-4 py-3 rounded-lg bg-[rgb(var(--surface-elevated))] border text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-all ${errors.email ? 'border-[rgb(var(--error))]' : 'border-[rgb(var(--border))]'
                                }`}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-[rgb(var(--error))]">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                autoComplete="current-password"
                                className={`w-full px-4 py-3 pr-12 rounded-lg bg-[rgb(var(--surface-elevated))] border text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-all ${errors.password ? 'border-[rgb(var(--error))]' : 'border-[rgb(var(--border))]'
                                    }`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-[rgb(var(--error))]">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Server Error */}
                    {loginMutation.isError && (
                        <div className="p-4 rounded-lg bg-[rgb(var(--error))]/10 border border-[rgb(var(--error))]/20 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-[rgb(var(--error))]" />
                            <p className="text-sm text-[rgb(var(--error))]">
                                {loginMutation.error?.message || 'Login failed'}
                            </p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || loginMutation.isPending}
                        className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2 focus:ring-offset-[rgb(var(--background))] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                        {loginMutation.isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
            {/* Fixed Toolbar */}
            <div className="fixed top-4 right-4 z-50">
                <GlobalToolbar />
            </div>

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground mt-1">Sign in to your account</p>
                </div>

                <Suspense fallback={<div className="glass-card p-8 animate-pulse"><div className="h-48 bg-secondary rounded-lg" /></div>}>
                    <LoginForm />
                </Suspense>

                {/* Register Link */}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-primary hover:underline font-medium">
                        Create one
                    </Link>
                </p>

                {/* Back to Home */}
                <p className="mt-4 text-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        ← Back to home
                    </Link>
                </p>
            </div>
        </div>
    );
}
