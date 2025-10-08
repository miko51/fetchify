"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Sparkles } from "lucide-react";

export default function SignInPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch (error) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center space-x-2 mb-6">
            <Sparkles className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Fetchify
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{t('nav.signIn')}</h1>
          <p className="text-slate-400">Accédez à votre compte</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Mot de passe
                </label>
                <Link 
                  href={`/${locale}/auth/forgot-password`}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : t('nav.signIn')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Pas encore de compte ?{" "}
            <Link href={`/${locale}/auth/signup`} className="text-blue-400 hover:text-blue-300 font-medium">
              {t('nav.signUp')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

