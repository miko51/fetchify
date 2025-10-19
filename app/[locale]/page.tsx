"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown, Check, X, Sparkles, Zap, Clock, Globe, Shield, TrendingUp, Menu } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { formatNumber } from "@/lib/format";

interface CreditPackage {
  id: string;
  name: string;
  description: string;
  credits: number;
  price: number;
  features: string;
  isPopular: boolean;
  isActive: boolean;
}

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages", { cache: 'no-store' });
      const data = await response.json();
      setPackages(data.packages.filter((p: CreditPackage) => p.isActive));
    } catch (error) {
      console.error("Erreur lors du chargement des packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
    { question: t('faq.q6'), answer: t('faq.a6') },
  ];

  return (
    <div className="min-h-screen">
      {/* Header/Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Fetchify
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                {t('nav.pricing')}
              </Link>
              <Link href={`/${locale}/documentation`} className="text-slate-300 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href={`/${locale}/status`} className="text-slate-300 hover:text-white transition-colors">
                Status
              </Link>
              <Link href="#faq" className="text-slate-300 hover:text-white transition-colors">
                {t('nav.faq')}
              </Link>
              <LanguageSwitcher />
              <Link
                href="/auth/signin"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
              >
                {t('nav.signIn')}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">
            <div className="px-4 py-4 space-y-3">
              <Link 
                href="#pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
              >
                {t('nav.pricing')}
              </Link>
              <Link 
                href={`/${locale}/documentation`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
              >
                Documentation
              </Link>
              <Link 
                href={`/${locale}/status`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
              >
                Status
              </Link>
              <Link 
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
              >
                {t('nav.faq')}
              </Link>
              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
              >
                {t('nav.signIn')}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-violet-500/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-300">{t('hero.badge')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold text-lg transition-all shadow-2xl shadow-blue-500/30"
            >
              {t('hero.cta')}
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-white font-semibold text-lg transition-all"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('features.title')}
            </h2>
            <p className="text-xl text-slate-400">{t('features.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: t('features.feature1.title'), desc: t('features.feature1.description'), color: "blue" },
              { icon: Globe, title: t('features.feature2.title'), desc: t('features.feature2.description'), color: "violet" },
              { icon: Clock, title: t('features.feature3.title'), desc: t('features.feature3.description'), color: "emerald" },
              { icon: TrendingUp, title: t('features.feature4.title'), desc: t('features.feature4.description'), color: "orange" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:transform hover:scale-105"
              >
                <feature.icon className={`h-12 w-12 text-${feature.color}-400 mb-4`} />
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section avec Slider */}
      <div id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-slate-400">{t('pricing.subtitle')}</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-blue-400 animate-pulse" size={24} />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => {
                let features: string[] = [];
                try {
                  features = pkg.features ? JSON.parse(pkg.features) : [];
                } catch (error) {
                  console.error('Erreur parsing features:', error);
                  features = [];
                }
                return (
                  <div
                    key={pkg.id}
                    className={`relative bg-slate-900/50 border rounded-3xl p-8 hover:border-blue-500/50 transition-all ${
                      pkg.isPopular 
                        ? 'border-blue-500 shadow-2xl shadow-blue-500/20' 
                        : 'border-slate-800'
                    }`}
                  >
                    {pkg.isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                          {t('pricing.popular')}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                      {pkg.description && (
                        <p className="text-sm text-slate-400">{pkg.description}</p>
                      )}
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-white mb-2">
                        ${formatPrice(pkg.price)}
                      </div>
                      <div className="text-slate-400">
                        {mounted ? formatNumber(pkg.credits) : pkg.credits} {t('pricing.credits')}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        ${mounted ? ((pkg.price / 100) / pkg.credits).toFixed(3) : '--'} / {t('pricing.credits')}
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      {features.length > 0 ? (
                        features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-300 text-sm">{feature}</span>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex items-start space-x-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{t('pricing.features.api')}</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{t('pricing.features.support')}</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{t('pricing.features.updates')}</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{t('pricing.features.documentation')}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <Link
                      href={`/${locale}/auth/signup`}
                      className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all ${
                        pkg.isPopular
                          ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {t('pricing.selectPlan')}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('faq.title')}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-semibold text-white pr-8">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${
                      openFaq === idx ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-slate-400 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              {t('cta.subtitle')}
            </p>
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold text-lg transition-all shadow-2xl shadow-blue-500/30"
            >
              {t('cta.button')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-blue-500" />
                <span className="font-bold text-white">Fetchify</span>
              </div>
              <p className="text-slate-400 text-sm">
                {t('hero.subtitle')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{t('footer.product')}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#pricing" className="hover:text-white transition-colors">{t('footer.pricing')}</Link></li>
                <li><Link href="#features" className="hover:text-white transition-colors">{t('footer.documentation')}</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">{t('footer.api')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">{t('footer.about')}</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">{t('footer.contact')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2025 Product Fetcher. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

