"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";

interface Service {
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: string;
  responseTime: string;
}

interface Incident {
  date: string;
  title: string;
  status: "resolved" | "investigating" | "identified";
  description: string;
}

export default function StatusPage() {
  const locale = useLocale();
  const [services, setServices] = useState<Service[]>([
    {
      name: "API Endpoint",
      status: "operational",
      uptime: "99.98%",
      responseTime: "245ms"
    },
    {
      name: "Authentication Service",
      status: "operational",
      uptime: "99.99%",
      responseTime: "120ms"
    },
    {
      name: "Database",
      status: "operational",
      uptime: "100%",
      responseTime: "15ms"
    },
    {
      name: "Payment Processing",
      status: "operational",
      uptime: "99.95%",
      responseTime: "580ms"
    },
    {
      name: "Dashboard",
      status: "operational",
      uptime: "99.97%",
      responseTime: "180ms"
    }
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      date: "2025-10-07",
      title: "API Response Time Improvement",
      status: "resolved",
      description: "We've optimized our API endpoints, reducing average response time by 30%."
    },
    {
      date: "2025-10-05",
      title: "Scheduled Maintenance",
      status: "resolved",
      description: "Routine database maintenance completed successfully. All systems are operational."
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-emerald-400";
      case "degraded":
        return "text-yellow-400";
      case "down":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="text-emerald-400" size={24} />;
      case "degraded":
        return <AlertCircle className="text-yellow-400" size={24} />;
      case "down":
        return <XCircle className="text-red-400" size={24} />;
      default:
        return <Clock className="text-slate-400" size={24} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Resolved</span>;
      case "investigating":
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Investigating</span>;
      case "identified":
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">Identified</span>;
      default:
        return null;
    }
  };

  const allOperational = services.every(s => s.status === "operational");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/${locale}`} className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Fetchify
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href={`/${locale}/docs`} className="text-slate-300 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href={`/${locale}/dashboard`} className="text-slate-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Status Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
              <Activity size={18} />
              <span className="text-sm font-medium">System Status</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Fetchify API Status
            </h1>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              {allOperational ? (
                <>
                  <CheckCircle2 className="text-emerald-400" size={32} />
                  <p className="text-2xl text-emerald-400 font-bold">All Systems Operational</p>
                </>
              ) : (
                <>
                  <AlertCircle className="text-yellow-400" size={32} />
                  <p className="text-2xl text-yellow-400 font-bold">Some Systems Degraded</p>
                </>
              )}
            </div>
            
            <p className="text-slate-400">
              Last updated: {new Date().toLocaleString(locale, {
                dateStyle: "full",
                timeStyle: "short"
              })}
            </p>
          </div>

          {/* Overall Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card-modern p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <TrendingUp className="text-emerald-400" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">99.98%</div>
                  <div className="text-sm text-slate-400">Uptime (30 days)</div>
                </div>
              </div>
            </div>

            <div className="card-modern p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Clock className="text-blue-400" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">245ms</div>
                  <div className="text-sm text-slate-400">Avg Response Time</div>
                </div>
              </div>
            </div>

            <div className="card-modern p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-violet-500/20 rounded-xl">
                  <Activity className="text-violet-400" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">5/5</div>
                  <div className="text-sm text-slate-400">Services Running</div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Status */}
          <div className="card-modern p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Service Status</h2>
            
            <div className="space-y-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(service.status)}
                      <div>
                        <h3 className="text-lg font-bold text-white">{service.name}</h3>
                        <p className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                          {service.status === "operational" && "Operational"}
                          {service.status === "degraded" && "Degraded Performance"}
                          {service.status === "down" && "Service Down"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold mb-1">{service.uptime}</div>
                      <div className="text-slate-400 text-sm">Uptime</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-blue-400 font-bold mb-1">{service.responseTime}</div>
                      <div className="text-slate-400 text-sm">Response</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident History */}
          <div className="card-modern p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Incidents & Updates</h2>
            
            {incidents.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <p className="text-slate-300 text-lg font-medium">No incidents reported</p>
                <p className="text-slate-400">All systems have been running smoothly</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{incident.title}</h3>
                          {getStatusBadge(incident.status)}
                        </div>
                        <p className="text-sm text-slate-400 mb-3">
                          {new Date(incident.date).toLocaleDateString(locale, {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-300">{incident.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subscribe to Updates */}
          <div className="mt-12 card-modern p-8 bg-gradient-to-br from-blue-500/10 to-violet-500/10 border-blue-500/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-3">Stay Updated</h3>
              <p className="text-slate-300 mb-6">
                Subscribe to get notifications about system status and incidents
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button className="btn-primary">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-800/50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Fetchify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
