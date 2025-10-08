"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { 
  LayoutDashboard, 
  Key, 
  CreditCard, 
  FileText, 
  Code, 
  LogOut,
  Zap,
  Shield
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

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

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clés API", href: "/dashboard/keys", icon: Key },
    { name: "Crédits", href: "/dashboard/credits", icon: CreditCard },
    { name: "Facturation", href: "/dashboard/billing", icon: FileText },
    { name: "Playground", href: "/dashboard/playground", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/50 border-r border-slate-800 backdrop-blur-xl z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 gradient-blue-violet rounded-xl flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              API Crawl
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
          {session.user?.email && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-violet-400 hover:bg-violet-500/10 rounded-xl transition-all"
            >
              <Shield size={20} />
              <span className="font-medium">Admin</span>
            </Link>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
