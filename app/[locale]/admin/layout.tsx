"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, LogOut, Menu, X, Shield } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function AdminLayout({
  children,
  params: { locale },
}: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Note: getAdminUser needs to be checked client-side or passed as prop
  // For now, assuming admin access is already validated

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-violet-400" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
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
          <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        <nav className="px-4 space-y-2">
          <Link
            href={`/${locale}/admin`}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              pathname === `/${locale}/admin`
                ? "bg-violet-500/20 text-white"
                : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            href={`/${locale}/admin/packages`}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              pathname.includes("/admin/packages")
                ? "bg-violet-500/20 text-white"
                : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <Package size={20} />
            <span>Packs de crédits</span>
          </Link>
          <Link
            href={`/${locale}/admin/users`}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              pathname.includes("/admin/users")
                ? "bg-violet-500/20 text-white"
                : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <Users size={20} />
            <span>Utilisateurs</span>
          </Link>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Link
            href={`/${locale}/dashboard`}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span>Retour Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
