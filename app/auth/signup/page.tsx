"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { UserPlus, Mail, Lock, User, ArrowRight, Gift, Zap, Shield } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        return;
      }

      // Rediriger vers la page de connexion
      router.push("/auth/signin?registered=true");
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-blue-600/20"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-violet-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="card-modern glass-dark backdrop-blur-2xl p-8">
          {/* Logo/Icon */}
          <div className="mb-8 text-center">
            <div className="inline-flex p-4 bg-gradient-to-br from-violet-500 to-blue-600 rounded-2xl shadow-lg shadow-violet-500/50 mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
            <p className="text-slate-400">
              Commencez gratuitement avec 10 crédits
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl">
              <Gift className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-slate-300">10 crédits offerts</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-violet-500/10 to-violet-600/10 border border-violet-500/20 rounded-xl">
              <Zap className="w-5 h-5 text-violet-400 mx-auto mb-1" />
              <p className="text-xs text-slate-300">API rapide</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl">
              <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-xs text-slate-300">100% sécurisé</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-modern pl-12"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-500" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="input-modern pl-12"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 caractères"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="input-modern pl-12"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Retapez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                  className="input-modern pl-12"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Inscription...
                </>
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/50 text-slate-400">ou</span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-slate-400">Déjà un compte ? </span>
            <Link
              href="/auth/signin"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Connectez-vous
            </Link>
          </div>
        </div>

        {/* Extra Info */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>En créant un compte, vous acceptez nos conditions d'utilisation</p>
        </div>
      </div>
    </div>
  );
}
