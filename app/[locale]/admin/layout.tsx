import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import Link from "next/link";
import { LayoutDashboard, Package, Users, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function AdminLayout({
  children,
  params: { locale },
}: AdminLayoutProps) {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    redirect(`/${locale}/auth/signin`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/50 border-r border-slate-800 backdrop-blur-xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-slate-400 mt-1">{adminUser.email}</p>
        </div>

        <nav className="px-4 space-y-2">
          <Link
            href={`/${locale}/admin`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            href={`/${locale}/admin/packages`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all"
          >
            <Package size={20} />
            <span>Packs de crédits</span>
          </Link>
          <Link
            href={`/${locale}/admin/users`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all"
          >
            <Users size={20} />
            <span>Utilisateurs</span>
          </Link>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span>Retour Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
