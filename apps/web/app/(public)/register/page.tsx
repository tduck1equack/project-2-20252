'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/use-auth';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    });

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate({
            email: data.email,
            password: data.password,
            name: data.name || undefined,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--background))] p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[rgb(var(--accent))] to-[rgb(var(--primary))] flex items-center justify-center mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">Create account</h1>
                    <p className="text-[rgb(var(--muted))] mt-1">Get started with your ERP account</p>
                </div>

                {/* Register Form */}
                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name (optional) */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                                Full name <span className="text-[rgb(var(--muted))]">(optional)</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name')}
                                autoComplete="name"
                                className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-all"
                                placeholder="John Doe"
                            />
                        </div>

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
                                    autoComplete="new-password"
                                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-[rgb(var(--surface-elevated))] border text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-all ${errors.password ? 'border-[rgb(var(--error))]' : 'border-[rgb(var(--border))]'
                                        }`}
                                    placeholder="Min. 6 characters"
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

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                {...register('confirmPassword')}
                                autoComplete="new-password"
                                className={`w-full px-4 py-3 rounded-lg bg-[rgb(var(--surface-elevated))] border text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-all ${errors.confirmPassword ? 'border-[rgb(var(--error))]' : 'border-[rgb(var(--border))]'
                                    }`}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-[rgb(var(--error))]">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Server Error */}
                        {registerMutation.isError && (
                            <div className="p-4 rounded-lg bg-[rgb(var(--error))]/10 border border-[rgb(var(--error))]/20 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-[rgb(var(--error))]" />
                                <p className="text-sm text-[rgb(var(--error))]">
                                    {registerMutation.error?.message || 'Registration failed'}
                                </p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || registerMutation.isPending}
                            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[rgb(var(--accent))] to-[rgb(var(--primary))] text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2 focus:ring-offset-[rgb(var(--background))] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            {registerMutation.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>
                </div>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-[rgb(var(--muted))]">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[rgb(var(--primary))] hover:underline font-medium">
                        Sign in
                    </Link>
                </p>

                {/* Back to Home */}
                <p className="mt-4 text-center">
                    <Link href="/" className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors">
                        ← Back to home
                    </Link>
                </p>
            </div>
        </div>
    );
}
