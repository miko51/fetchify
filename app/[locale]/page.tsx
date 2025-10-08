"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown, Check, X, Sparkles, Zap, Clock, Globe, Shield, TrendingUp } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { formatNumber } from "@/lib/format";

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [pricingValue, setPricingValue] = useState(1000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calcul automatique du prix basé sur les paliers
  const calculatePrice = (requests: number) => {
    if (requests <= 1000) return 50;
    if (requests <= 10000) return 50 + ((requests - 1000) / 9000) * 50;
    if (requests <= 100000) return 100 + ((requests - 10000) / 90000) * 200;
    return 300 + ((requests - 100000) / 900000) * 700;
  };

  const price = Math.round(calculatePrice(pricingValue));

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
          </div>
        </div>
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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-slate-400">{t('pricing.subtitle')}</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg text-slate-300">Nombre de requêtes</span>
                <span className="text-3xl font-bold text-white">
                  {mounted ? formatNumber(pricingValue) : pricingValue}
                </span>
              </div>
              
              <input
                type="range"
                min="100"
                max="1000000"
                step="100"
                value={pricingValue}
                onChange={(e) => setPricingValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(139, 92, 246) ${
                    (pricingValue / 1000000) * 100
                  }%, rgb(51, 65, 85) ${(pricingValue / 1000000) * 100}%)`
                }}
              />
              
              <div className="flex justify-between text-sm text-slate-500 mt-2">
                <span>100</span>
                <span>1,000</span>
                <span>10,000</span>
                <span>100,000</span>
                <span>1,000,000</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-white mb-2">
                ${price}
                <span className="text-2xl text-slate-400">{t('pricing.perMonth')}</span>
              </div>
              <div className="text-slate-400">
                ${mounted ? (price / pricingValue * 1000).toFixed(2) : '--'} / 1000 {t('pricing.credits')}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                t('pricing.features.api'),
                t('pricing.features.support'),
                t('pricing.features.updates'),
                t('pricing.features.documentation')
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup"
              className="block w-full text-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold text-lg transition-all shadow-2xl shadow-blue-500/30"
            >
              {t('pricing.selectPlan')}
            </Link>
          </div>
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(59, 130, 246), rgb(139, 92, 246));
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(59, 130, 246), rgb(139, 92, 246));
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}

