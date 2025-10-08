"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { CreditCard, Key, TrendingUp, Activity, ArrowRight, Zap, Code2, Calendar, BarChart3 } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { format, subDays } from "date-fns";
import { fr, es, it, de, enUS } from "date-fns/locale";

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
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usageStats, setUsageStats] = useState<UsageStatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Get date-fns locale
  const getDateLocale = () => {
    switch(locale) {
      case 'fr': return fr;
      case 'es': return es;
      case 'it': return it;
      case 'de': return de;
      default: return enUS;
    }
  };
  
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

      if (!userData.user) {
        console.error("Données utilisateur invalides - session probablement expirée");
        window.location.href = `/${locale}/auth/signin`;
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
      window.location.href = `/${locale}/auth/signin`;
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(`/api/usage/stats?start=${startDate}&end=${endDate}`);
      const statsData = await response.json();
      setUsageStats(statsData);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
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
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          {t('welcome')}, {session?.user?.name || "User"} 👋
        </h1>
        <p className="text-slate-400 text-lg">
          {t('activityOverview')}
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
          <p className="text-slate-400 text-sm">{t('credits')}</p>
          <p className="text-4xl font-bold text-white mt-2">
            {(data?.user.credits ?? 0).toLocaleString()}
          </p>
          <Link
            href={`/${locale}/dashboard/credits`}
            className="inline-flex items-center gap-2 text-blue-400 text-sm mt-4 hover:text-blue-300 transition-colors"
          >
            {t('buyCredits')} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Clés API */}
        <div className="stat-card-violet">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-violet-500/20 rounded-xl">
              <Key className="text-violet-400" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-sm">{t('apiKeys')}</p>
          <p className="text-4xl font-bold text-white mt-2">
            {data?.stats.totalApiKeys || 0}
          </p>
          <Link
            href={`/${locale}/dashboard/keys`}
            className="inline-flex items-center gap-2 text-violet-400 text-sm mt-4 hover:text-violet-300 transition-colors"
          >
            {t('manageKeys')} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Appels API */}
        <div className="stat-card-emerald">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Activity className="text-emerald-400" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-sm">{t('apiCalls')}</p>
          <p className="text-4xl font-bold text-white mt-2">
            {(data?.stats.totalCalls ?? 0).toLocaleString()}
          </p>
          <p className="text-emerald-400 text-sm mt-4">
            {t('totalCallsToDate')}
          </p>
        </div>

        {/* Crédits utilisés */}
        <div className="stat-card-orange">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <TrendingUp className="text-orange-400" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-sm">{t('creditsUsed')}</p>
          <p className="text-4xl font-bold text-white mt-2">
            {(data?.stats.totalCreditsUsed ?? 0).toLocaleString()}
          </p>
          <p className="text-orange-400 text-sm mt-4">
            {t('totalCreditsConsumed')}
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
                  {t('usageOverTime')}
                </h2>
                <p className="text-slate-400 text-sm">
                  {t('viewUsage')}
                </p>
              </div>
            </div>
          </div>

          {/* Filtres de dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                <Calendar className="inline mr-2" size={16} />
                {t('startDate')}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-modern"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                <Calendar className="inline mr-2" size={16} />
                {t('endDate')}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-modern"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm text-slate-400 mb-2">
                Quick periods
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setQuickPeriod(7)}
                  className="btn-secondary text-sm"
                >
                  {t('last7Days')}
                </button>
                <button
                  onClick={() => setQuickPeriod(30)}
                  className="btn-secondary text-sm"
                >
                  {t('last30Days')}
                </button>
                <button
                  onClick={() => setQuickPeriod(90)}
                  className="btn-secondary text-sm"
                >
                  {t('last90Days')}
                </button>
              </div>
            </div>
          </div>

          {/* Stats totales pour la période */}
          {usageStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-400 text-sm">{t('totalCredits')}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {usageStats.totals.credits}
                </p>
              </div>
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                <p className="text-violet-400 text-sm">{t('totalCalls')}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {usageStats.totals.calls}
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-emerald-400 text-sm">{t('success')}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {usageStats.totals.success}
                </p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm">{t('failures')}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {usageStats.totals.failed}
                </p>
              </div>
            </div>
          )}

          {/* Graphique */}
          {loadingStats ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-slate-700 border-t-violet-500 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-400 text-sm">Chargement des données...</p>
              </div>
            </div>
          ) : usageStats && usageStats.data.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageStats.data}>
                  <defs>
                    <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '0.75rem',
                      color: '#f1f5f9'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="credits"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCredits)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-slate-400">Aucune donnée disponible pour cette période</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}