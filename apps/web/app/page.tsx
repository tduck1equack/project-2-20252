import Link from "next/link";
import { ArrowRight, Package, BarChart3, FileText, Warehouse, LogIn, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] dark">
      {/* Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 glass-card flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-gradient">Project-2 ERP</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2.5 text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface-elevated))] rounded-lg font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-6">
              Enterprise Resource Planning
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            <span className="text-[rgb(var(--foreground))]">Modern </span>
            <span className="text-gradient">Inventory</span>
            <br />
            <span className="text-[rgb(var(--foreground))]">Management</span>
          </h1>

          <p className="text-xl text-[rgb(var(--muted))] max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Streamline your warehouse operations with real-time tracking,
            batch management, and integrated e-invoicing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Link
              href="/register"
              className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/25 hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 glass-card hover:bg-[rgb(var(--surface-elevated))] text-[rgb(var(--foreground))] rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-[rgb(var(--muted))] text-lg">
              Comprehensive tools for modern inventory management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Warehouse,
                title: "Warehouse Management",
                description: "Multi-location inventory tracking with real-time updates",
                color: "primary",
              },
              {
                icon: Package,
                title: "Batch & Lot Tracking",
                description: "Full traceability with expiration management",
                color: "accent",
              },
              {
                icon: BarChart3,
                title: "VAS Accounting",
                description: "Vietnamese Accounting Standards compliant ledger",
                color: "primary",
              },
              {
                icon: FileText,
                title: "E-Invoice Integration",
                description: "Automated electronic invoice generation",
                color: "accent",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card stat-card p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color === "primary"
                    ? "bg-primary-500/10 text-primary-500"
                    : "bg-accent-500/10 text-accent-500"
                    }`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-[rgb(var(--muted))] text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[rgb(var(--border))]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[rgb(var(--muted))] text-sm">
            © 2026 Project-2 ERP. Built with Next.js, NestJS, and Prisma.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/login" className="text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
