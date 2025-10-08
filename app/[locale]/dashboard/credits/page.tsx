"use client";

import { useEffect, useState } from "react";
import { CheckCircle, CreditCard, Zap, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CreditPackage {
  id: string;
  name: string;
  description: string;
  credits: number;
  price: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

export default function CreditsPage() {
  const [currentCredits, setCurrentCredits] = useState(0);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, packagesRes] = await Promise.all([
        fetch("/api/user/me", { cache: 'no-store' }),
        fetch("/api/packages", { cache: 'no-store' }),
      ]);

      const userData = await userRes.json();
      const packagesData = await packagesRes.json();

      setCurrentCredits(userData.user.credits);
      setPackages(packagesData.packages.filter((p: CreditPackage) => p.isActive));
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId: string) => {
    setPurchasing(packageId);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
      setPurchasing(null);
    }
  };

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
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
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Acheter des crédits
        </h1>
        <p className="text-slate-400 text-lg">
          Choisissez le pack qui correspond à vos besoins
        </p>
      </div>

      {/* Current Credits Card */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur-xl opacity-20"></div>
        <div className="relative stat-card-blue">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Zap className="text-blue-400" size={32} />
            </div>
          </div>
          <p className="text-slate-400 text-lg">Vos crédits actuels</p>
          <p className="text-6xl font-bold text-white mt-2 mb-1">
            {currentCredits.toLocaleString()}
          </p>
          <p className="text-blue-400">crédits disponibles</p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative card-modern ${
              pkg.isPopular
                ? "border-violet-500/50 scale-105"
                : "card-modern-hover"
            }`}
          >
            {pkg.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-1 gradient-blue-violet text-white text-xs font-bold rounded-full shadow-lg">
                  ⭐ POPULAIRE
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-1">{pkg.name}</h3>
              <p className="text-slate-400 text-sm">{pkg.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">
                  {formatPrice(pkg.price)}
                </span>
                <span className="text-slate-400 text-xl">€</span>
              </div>
              <p className="text-slate-500 text-sm mt-2">
                {pkg.credits.toLocaleString()} crédits • {
                  (pkg.price / pkg.credits / 100).toFixed(4)
                }€/crédit
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                <span className="text-slate-300">{pkg.credits.toLocaleString()} appels API</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                <span className="text-slate-300">Pas d'expiration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                <span className="text-slate-300">Support inclus</span>
              </li>
              {pkg.features && pkg.features.length > 0 && pkg.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePurchase(pkg.id)}
              disabled={purchasing !== null}
              className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                pkg.isPopular
                  ? "btn-primary"
                  : "btn-secondary"
              } ${
                purchasing !== null ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {purchasing === pkg.id ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Redirection...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Acheter maintenant
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="card-modern">
        <h2 className="text-2xl font-bold text-white mb-6">
          Questions fréquentes
        </h2>
        <div className="space-y-6">
          <div className="border-l-2 border-blue-500 pl-4">
            <h4 className="font-semibold text-white mb-2">
              Les crédits expirent-ils ?
            </h4>
            <p className="text-slate-400">
              Non, vos crédits n'expirent jamais. Vous pouvez les utiliser quand vous le souhaitez.
            </p>
          </div>

          <div className="border-l-2 border-violet-500 pl-4">
            <h4 className="font-semibold text-white mb-2">
              Comment fonctionne la facturation ?
            </h4>
            <p className="text-slate-400">
              Chaque appel à l'API consomme 1 crédit. Achetez uniquement les crédits dont vous avez besoin.
            </p>
          </div>

          <div className="border-l-2 border-emerald-500 pl-4">
            <h4 className="font-semibold text-white mb-2">
              Puis-je obtenir un remboursement ?
            </h4>
            <p className="text-slate-400">
              Les crédits achetés ne sont pas remboursables, mais vous pouvez les utiliser à tout moment sans expiration.
            </p>
          </div>

          <div className="border-l-2 border-orange-500 pl-4">
            <h4 className="font-semibold text-white mb-2">
              Puis-je transférer mes crédits ?
            </h4>
            <p className="text-slate-400">
              Les crédits sont liés à votre compte et ne peuvent pas être transférés vers un autre compte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
