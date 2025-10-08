"use client";

import { useEffect, useState } from "react";
import { CreditCard, Key, Activity, Shield } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  isAdmin: boolean;
  createdAt: string;
  _count: {
    apiKeys: number;
    purchases: number;
    apiUsage: number;
  };
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Utilisateurs</h1>
        <p className="text-slate-400">
          Liste de tous les utilisateurs de la plateforme
        </p>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {user.name || user.email}
                  </h3>
                  {user.isAdmin && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-violet-500/20 text-violet-400 text-xs font-bold rounded-full">
                      <Shield size={12} />
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mb-4">{user.email}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="text-blue-400" size={16} />
                      <span className="text-slate-400 text-xs">Crédits</span>
                    </div>
                    <p className="text-white font-bold">
                      {user.credits.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Key className="text-violet-400" size={16} />
                      <span className="text-slate-400 text-xs">Clés API</span>
                    </div>
                    <p className="text-white font-bold">{user._count.apiKeys}</p>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="text-emerald-400" size={16} />
                      <span className="text-slate-400 text-xs">Appels API</span>
                    </div>
                    <p className="text-white font-bold">
                      {user._count.apiUsage}
                    </p>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="text-orange-400" size={16} />
                      <span className="text-slate-400 text-xs">Achats</span>
                    </div>
                    <p className="text-white font-bold">
                      {user._count.purchases}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right ml-6">
                <p className="text-slate-500 text-xs">Inscrit le</p>
                <p className="text-slate-300 text-sm font-medium">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

