"use client";

import { useEffect, useState } from "react";
import { Users, CreditCard, Activity, DollarSign } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalApiKeys: number;
  totalPurchases: number;
  totalRevenue: number;
  totalApiCalls: number;
}

interface RecentUser {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  createdAt: string;
}

interface RecentPurchase {
  id: string;
  amount: number;
  credits: number;
  status: string;
  createdAt: string;
  user: {
    email: string;
    name: string | null;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setRecentUsers(data.recentUsers);
        setRecentPurchases(data.recentPurchases);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Dashboard Admin</h1>
        <p className="text-slate-400 text-sm sm:text-base">Vue d'ensemble de la plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl lg:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg sm:rounded-xl">
              <Users className="text-blue-400" size={20} />
            </div>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">Utilisateurs</p>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {stats?.totalUsers || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-violet-500/10 to-violet-600/10 border border-violet-500/20 rounded-xl lg:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-violet-500/20 rounded-lg sm:rounded-xl">
              <DollarSign className="text-violet-400" size={20} />
            </div>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">Revenu total</p>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {((stats?.totalRevenue || 0) / 100).toFixed(2)} €
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl lg:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-emerald-500/20 rounded-lg sm:rounded-xl">
              <CreditCard className="text-emerald-400" size={20} />
            </div>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">Achats</p>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {stats?.totalPurchases || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl lg:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-orange-500/20 rounded-lg sm:rounded-xl">
              <Activity className="text-orange-400" size={20} />
            </div>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">Appels API</p>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {stats?.totalApiCalls || 0}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Users */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl lg:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
            Derniers utilisateurs
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-white font-medium text-sm sm:text-base truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm truncate">{user.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-blue-400 font-medium text-sm sm:text-base">
                    {user.credits} crédits
                  </p>
                  <p className="text-slate-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl lg:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Derniers achats</h2>
          <div className="space-y-2 sm:space-y-3">
            {recentPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-white font-medium text-sm sm:text-base truncate">
                    {purchase.user.name || purchase.user.email}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    {purchase.credits} crédits
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-emerald-400 font-medium text-sm sm:text-base">
                    {(purchase.amount / 100).toFixed(2)} €
                  </p>
                  <p className="text-slate-500 text-xs">
                    {new Date(purchase.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

