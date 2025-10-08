"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from 'next-intl';
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          language: locale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Email envoyé !
            </h1>
            <p className="text-slate-400 mb-6">
              Si un compte existe avec cet email, vous recevrez un lien de réinitialisation dans quelques instants.
            </p>
            <Link
              href={`/${locale}/auth/signin`}
              className="inline-block text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Mot de passe oublié ?
          </h1>
          <p className="text-slate-400">
            Entrez votre email et nous vous enverrons un lien de réinitialisation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              placeholder="vous@exemple.com"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-6 text-lg"
          >
            {loading ? "Envoi..." : "Envoyer le lien"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href={`/${locale}/auth/signin`}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}

