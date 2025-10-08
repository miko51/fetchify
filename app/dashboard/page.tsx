"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CreditCard, Key, TrendingUp, Activity, ArrowRight, Zap, Code2, Calendar, BarChart3 } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";

interface DashboardData {
  user: {
    credits: number;
  };
  stats: {
    totalApiKeys: number;
    totalCalls: number;
    totalCreditsUsed: number;
  };
}

interface UsageStatsData {
  data: Array<{
    date: string;
    credits: number;
    calls: number;
    success: number;
    failed: number;
  }>;
  totals: {
    credits: number;
    calls: number;
    success: number;
    failed: number;
  };
  period: {
    start: string;
    end: string;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usageStats, setUsageStats] = useState<UsageStatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Dates par défaut : 30 derniers jours
  const [startDate, setStartDate] = useState<string>(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  useEffect(() => {
    fetchDashboardData();
    fetchUsageStats();
  }, []);

  useEffect(() => {
    fetchUsageStats();
  }, [startDate, endDate]);

  const fetchDashboardData = async () => {
    try {
      const [keysRes, usageRes, userRes] = await Promise.all([
        fetch("/api/keys"),
        fetch("/api/usage"),
        fetch("/api/user/me"),
      ]);

      const keysData = await keysRes.json();
      const usageData = await usageRes.json();
      const userData = await userRes.json();

      // Vérifier que les données utilisateur sont valides
      if (!userData.user) {
        console.error("Données utilisateur invalides - session probablement expirée");
        // Rediriger vers la page de connexion
        window.location.href = "/auth/signin";
        return;
      }

      setData({
        user: userData.user,
        stats: {
          totalApiKeys: keysData.apiKeys?.length || 0,
          totalCalls: usageData.stats?.totalCalls || 0,
          totalCreditsUsed: usageData.stats?.totalCreditsUsed || 0,
        },
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      // En cas d'erreur, rediriger vers la connexion
      window.location.href = "/auth/signin";
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch(
        `/api/usage/stats?startDate=${startDate}&endDate=${endDate}`
      );
      const statsData = await res.json();
      setUsageStats(statsData);
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const setQuickPeriod = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-blue-400 animate-pulse" size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Bienvenue, {session?.user?.name || "Utilisateur"} 👋
        </h1>
        <p className="text-slate-400 text-lg">
          Voici un aperçu de votre activité
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Crédits disponibles */}
        <div className="stat-card-blue">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <CreditCard className="text-blue-400" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Crédits disponibles</p>
          <p className="text-4xl font-bold text-white mt-2">
            {(data?.user.credits ?? 0).toLocaleString()}
          </p>
          <Link
            href="/dashboard/credits"
            className="inline-flex items-center gap-2 text-blue-400 text-sm mt-4 hover:text-blue-300 transition-colors"
          >
            Acheter des crédits <ArrowRight size={16} />
          </Link>
        </div>

        {/* Clés API */}
        <div className="stat-card-violet">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-violet-500/20 rounded-xl">
              <Key className="text-violet-400" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Clés API</p>
          <p className="text-4xl font-bold text-white mt-2">
            {data?.stats.totalApiKeys || 0}
          </p>
          <Link
            href="/dashboard/keys"
            className="inline-flex items-center gap-2 text-violet-400 text-sm mt-4 hover:text-violet-300 transition-colors"
          >
            Gérer les clés <ArrowRight size={16} />
          </Link>
        </div>

        {/* Appels API */}
        <div className="stat-card-emerald">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Activity className="text-emerald-400" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Appels API</p>
          <p className="text-4xl font-bold text-white mt-2">
            {(data?.stats.totalCalls ?? 0).toLocaleString()}
          </p>
          <p className="text-emerald-400 text-sm mt-4">
            Appels effectués au total
          </p>
        </div>

        {/* Crédits utilisés */}
        <div className="stat-card-orange">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <TrendingUp className="text-orange-400" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Crédits utilisés</p>
          <p className="text-4xl font-bold text-white mt-2">
            {(data?.stats.totalCreditsUsed ?? 0).toLocaleString()}
          </p>
          <p className="text-orange-400 text-sm mt-4">
            Crédits consommés au total
          </p>
        </div>
      </div>

      {/* Usage Chart */}
      <div className="card-modern">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <BarChart3 className="text-violet-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Consommation dans le temps
                </h2>
                <p className="text-slate-400 text-sm">
                  Visualisez votre utilisation de l'API
                </p>
              </div>
            </div>

            {/* Quick Period Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setQuickPeriod(7)}
                className="px-3 py-1.5 text-sm bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                7 jours
              </button>
              <button
                onClick={() => setQuickPeriod(30)}
                className="px-3 py-1.5 text-sm bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                30 jours
              </button>
              <button
                onClick={() => setQuickPeriod(90)}
                className="px-3 py-1.5 text-sm bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                90 jours
              </button>
            </div>
          </div>

          {/* Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date de début
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-modern pl-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date de fin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-modern pl-11"
                />
              </div>
            </div>
          </div>

          {/* Chart */}
          {loadingStats ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-violet-500 absolute inset-0"></div>
              </div>
            </div>
          ) : usageStats && usageStats.data.length > 0 ? (
            <>
              {/* Totals for the period */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Total Crédits</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {usageStats.totals.credits}
                  </p>
                </div>
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Total Appels</p>
                  <p className="text-2xl font-bold text-violet-400">
                    {usageStats.totals.calls}
                  </p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Succès</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {usageStats.totals.success}
                  </p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Échecs</p>
                  <p className="text-2xl font-bold text-red-400">
                    {usageStats.totals.failed}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={usageStats.data.map((item) => ({
                      ...item,
                      date: format(new Date(item.date), "dd MMM", { locale: fr }),
                    }))}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                      labelStyle={{ color: "#e2e8f0", marginBottom: "8px" }}
                      itemStyle={{ color: "#cbd5e1" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="credits"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCredits)"
                      name="Crédits"
                    />
                    <Area
                      type="monotone"
                      dataKey="calls"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCalls)"
                      name="Appels"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Aucune donnée disponible
              </h3>
              <p className="text-slate-400">
                Effectuez des appels API pour voir vos statistiques ici
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Getting Started */}
        <div className="card-modern">
          <h2 className="text-2xl font-bold text-white mb-6">
            Commencer à utiliser l'API
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 gradient-blue-violet rounded-xl flex items-center justify-center font-bold text-white">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Créer une clé API
                </h3>
                <p className="text-slate-400 text-sm mb-2">
                  Générez votre première clé API pour authentifier vos requêtes
                </p>
                <Link
                  href="/dashboard/keys"
                  className="text-blue-400 text-sm hover:text-blue-300 inline-flex items-center gap-1"
                >
                  Créer une clé <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-violet-500/20 border border-violet-500/30 rounded-xl flex items-center justify-center font-bold text-violet-300">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Acheter des crédits
                </h3>
                <p className="text-slate-400 text-sm mb-2">
                  Rechargez votre compte pour utiliser l'API
                </p>
                <Link
                  href="/dashboard/credits"
                  className="text-violet-400 text-sm hover:text-violet-300 inline-flex items-center gap-1"
                >
                  Acheter maintenant <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center font-bold text-emerald-300">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Tester dans le Playground
                </h3>
                <p className="text-slate-400 text-sm mb-2">
                  Essayez l'API directement depuis votre navigateur
                </p>
                <Link
                  href="/dashboard/playground"
                  className="text-emerald-400 text-sm hover:text-emerald-300 inline-flex items-center gap-1"
                >
                  Ouvrir le playground <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="card-modern">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Code2 className="text-blue-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Documentation API
            </h2>
          </div>

          <div className="relative mb-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-xl blur"></div>
            <div className="relative bg-slate-950/90 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-slate-500 text-xs ml-2">API Request</span>
              </div>
              <pre className="text-xs text-slate-300 overflow-x-auto">
                <code>{`curl -X GET \\
  "https://n8n.wharfer.io/webhook/..." \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{"url": "PRODUCT_URL"}'`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
              <div>
                <p className="text-white text-sm font-medium">
                  1 crédit = 1 appel API
                </p>
                <p className="text-slate-400 text-xs">
                  Chaque requête consomme 1 crédit
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
              <div className="w-2 h-2 bg-violet-500 rounded-full mt-1.5"></div>
              <div>
                <p className="text-white text-sm font-medium">
                  Réponse instantanée
                </p>
                <p className="text-slate-400 text-xs">
                  Données structurées en JSON
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      {data && data.user.credits < 10 && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/30 to-red-600/30 rounded-2xl blur-xl"></div>
          <div className="relative card-modern border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-500/5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  ⚠️ Crédits faibles
                </h3>
                <p className="text-slate-400">
                  Il ne vous reste que {data.user.credits} crédits. Rechargez maintenant pour continuer à utiliser l'API.
                </p>
              </div>
              <Link href="/dashboard/credits" className="btn-primary whitespace-nowrap">
                Acheter des crédits
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
