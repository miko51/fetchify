"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { 
  LayoutDashboard, 
  Key, 
  CreditCard, 
  FileText, 
  Code, 
  LogOut,
  Zap,
  Shield,
  Menu,
  X
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/auth/signin`);
    }
  }, [status, router, locale]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="text-blue-400 animate-pulse" size={24} />
            </div>
          </div>
          <p className="mt-6 text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Fallback navigation without translations (will work even if context is missing)
  const navigation = [
    { name: "Dashboard", href: `/${locale}/dashboard`, icon: LayoutDashboard },
    { name: "API Keys", href: `/${locale}/dashboard/keys`, icon: Key },
    { name: "Credits", href: `/${locale}/dashboard/credits`, icon: CreditCard },
    { name: "Billing", href: `/${locale}/dashboard/billing`, icon: FileText },
    { name: "Playground", href: `/${locale}/dashboard/playground`, icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-blue-violet rounded-lg flex items-center justify-center">
                <Zap className="text-white" size={18} />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Fetchify
              </h1>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-slate-900/50 border-r border-slate-800 backdrop-blur-xl z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 gradient-blue-violet rounded-xl flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Fetchify
            </h1>
          </div>
          <p className="text-sm text-slate-400 truncate">
            {session.user?.email}
          </p>
        </div>

        <nav className="px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "gradient-blue-violet text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 space-y-2">
          {/* Admin Link if admin */}
          {(session.user as any)?.isAdmin && (
            <Link
              href={`/${locale}/admin`}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-violet-400 hover:bg-violet-500/10 rounded-xl transition-all"
            >
              <Shield size={20} />
              <span className="font-medium">Admin</span>
            </Link>
          )}

          <button
            onClick={() => {
              setSidebarOpen(false);
              signOut({ callbackUrl: `/${locale}` });
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-64 pt-16 lg:pt-0">
        {/* Top Bar with Language Switcher - Desktop only */}
        <div className="hidden lg:block sticky top-0 z-40 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 px-8 py-4">
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>
        </div>
        
        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
