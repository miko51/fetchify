"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, Receipt, Calendar, CheckCircle2, CreditCard, Shield, Mail } from "lucide-react";

interface Purchase {
  id: string;
  amount: number;
  credits: number;
  status: string;
  createdAt: string;
  stripeInvoiceId: string | null;
}

export default function BillingPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await fetch("/api/purchases");
      const data = await response.json();
      setPurchases(data.purchases || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    setLoadingPortal(true);
    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
      });
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Erreur:", error);
      setLoadingPortal(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-800"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute inset-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">Facturation</h1>
            </div>
            <p className="text-emerald-100">
              Gérez vos factures et informations de paiement
            </p>
          </div>
          <button
            onClick={openCustomerPortal}
            disabled={loadingPortal}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingPortal ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Chargement...
              </>
            ) : (
              <>
                <ExternalLink className="w-5 h-5" />
                Portail Stripe
              </>
            )}
          </button>
        </div>
      </div>


      {/* Purchase History */}
      <div className="card-modern">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Historique des achats</h3>
          </div>

          {purchases.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-2xl flex items-center justify-center">
                <Receipt className="w-10 h-10 text-slate-600" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Aucun achat</h4>
              <p className="text-slate-400">
                Vos achats de crédits apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        purchase.status === "succeeded"
                          ? "bg-emerald-500/20"
                          : "bg-orange-500/20"
                      }`}>
                        {purchase.status === "succeeded" ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Receipt className="w-6 h-6 text-orange-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-lg font-bold text-white">
                            {purchase.credits} crédits
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              purchase.status === "succeeded"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            }`}
                          >
                            {purchase.status === "succeeded" ? "Payé" : "En attente"}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">
                          {new Date(purchase.createdAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {formatPrice(purchase.amount)}
                        </div>
                      </div>
                      {purchase.stripeInvoiceId && (
                        <button className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors">
                          <Download className="w-5 h-5 text-slate-300" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card-modern bg-violet-500/5 border-violet-500/20">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-violet-400" />
              </div>
              <h4 className="font-bold text-white">Paiement sécurisé</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tous les paiements sont traités de manière sécurisée par Stripe. 
              Nous ne stockons aucune information de carte bancaire.
            </p>
          </div>
        </div>

        <div className="card-modern bg-blue-500/5 border-blue-500/20">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="font-bold text-white">Factures automatiques</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Vous recevez automatiquement une facture par email après chaque achat. 
              Retrouvez-les aussi dans le portail Stripe.
            </p>
          </div>
        </div>

        <div className="card-modern bg-emerald-500/5 border-emerald-500/20">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Mail className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-bold text-white">Support dédié</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Pour toute question concernant votre facturation, 
              contactez-nous à support@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
