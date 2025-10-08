"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { 
  Sparkles,
  ChevronDown,
  Check,
  Play,
  Zap,
  Lock,
  Clock,
  DollarSign,
  TrendingUp,
  Package
} from "lucide-react";

export default function DocsPage() {
  const locale = useLocale();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pricingValue, setPricingValue] = useState(5000);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Calcul du prix basé sur le slider
  const calculatePrice = (requests: number) => {
    if (requests <= 1000) return 50;
    if (requests <= 10000) return 50 + ((requests - 1000) / 9000) * 350;
    if (requests <= 100000) return 400 + ((requests - 10000) / 90000) * 600;
    return 1000;
  };

  const price = Math.round(calculatePrice(pricingValue));
  const pricePerThousand = (price / pricingValue * 1000).toFixed(2);

  const faqs = [
    {
      question: "What is Product Fetcher?",
      answer: "Product Fetcher is an AI-powered API that extracts product data (price, description, ratings, reviews) from any webpage. It's designed to simplify web scraping for developers, marketers, and businesses by providing accurate and clean data with zero coding required."
    },
    {
      question: "How does Product Fetcher work?",
      answer: "Simply make an API call with your API key and the product URL. Our AI-powered system automatically extracts all relevant product information and returns it in a clean JSON format. The entire process takes just seconds."
    },
    {
      question: "Who is Product Fetcher for?",
      answer: "Perfect for e-commerce platforms, affiliate marketers, price comparison websites, dropshipping businesses, developers, and startups who need to automate product data extraction."
    },
    {
      question: "How can I get started with Product Fetcher?",
      answer: "Sign up for a free account and get 10 free credits to test the API. Create your API key, choose a pricing plan that fits your needs, and start making API calls immediately."
    },
    {
      question: "Why choose Product Fetcher over traditional scraping tools?",
      answer: "Our AI-powered solution adapts to any website structure, includes automatic proxy rotation to avoid blocks, provides fast and reliable data extraction, and offers simple integration with clear documentation. No complicated setups or configurations needed."
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #1a0b2e 0%, #16213e 100%)' }}>
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ background: 'rgba(26, 11, 46, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Package className="text-white" size={20} />
              </div>
              <span className="text-white font-bold text-lg">Product Fetcher</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href={`/${locale}#pricing`} className="text-gray-300 hover:text-white text-sm">Pricing</Link>
              <Link href={`/${locale}/docs/postman`} className="text-gray-300 hover:text-white text-sm">Postman</Link>
              <Link href={`/${locale}/status`} className="text-gray-300 hover:text-white text-sm">Status</Link>
              <Link href={`/${locale}/auth/signin`} className="text-gray-300 hover:text-white text-sm">Login</Link>
              <Link href={`/${locale}/auth/signup`} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90">
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white">AI Web Scraping API:</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  extract product data from any page in one click
                </span>
              </h1>
              
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700/50">
                <p className="text-gray-300 text-sm mb-2">
                  <span className="text-blue-400">REQ</span> our scraping <span className="text-purple-400">API</span> is powered by <span className="text-blue-400">advanced tech</span> and integrates
                </p>
                <p className="text-gray-300 text-sm">with your <span className="text-purple-400">workflow</span> seamlessly.</p>
              </div>

              <Link href={`/${locale}/auth/signup`} className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 mb-8">
                Get started for free (10 credits) →
              </Link>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-5 h-5 opacity-50 invert" />
                  <span className="text-gray-400 text-xs">Mac and PC</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" className="w-5 h-5 opacity-50 invert" />
                  <span className="text-gray-400 text-xs">Checkout our code base on GitHub</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs">Personal Licence • For business: text us by using the online form</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="w-16 h-4 opacity-50" />
                  <span className="text-gray-400 text-xs">24/7 Chat Support</span>
                </div>
              </div>
            </div>

            {/* Right Column - Demo */}
            <div className="bg-white rounded-xl p-6 shadow-2xl">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-white rounded p-4">
                  <div className="text-xs text-gray-600 mb-2">Product URL</div>
                  <div className="text-blue-600 text-sm mb-4">https://example.com/product/123</div>
                  <div className="flex gap-2 mb-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm">Scrape</button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm">Options</button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm">Cancel</button>
                  </div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-600">
                ↓ Watch a full tutorial →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplaces */}
      <section className="py-12 px-6 border-y border-gray-700/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-center text-gray-400 text-sm mb-8">Works with the best marketplaces</h3>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-40">
            <span className="text-white text-xl font-semibold">Amazon</span>
            <span className="text-white text-xl font-semibold">eBay</span>
            <span className="text-white text-xl font-semibold">Shopify</span>
            <span className="text-white text-xl font-semibold">WooCommerce</span>
            <span className="text-white text-xl font-semibold">Magento</span>
            <span className="text-white text-xl font-semibold">Others</span>
          </div>
        </div>
      </section>

      {/* Who is it for / What does it do */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Who is it for */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Who is it for?</h2>
              <div className="space-y-3">
                {[
                  "E-commerce platforms",
                  "Affiliate marketing platforms",
                  "Price comparison websites",
                  "Dropshipping platforms",
                  "Developers and startups"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                    <Check className="text-blue-400" size={20} />
                    <span className="text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">4.9/5</div>
                  <div className="text-sm text-gray-400">⭐⭐⭐⭐⭐ (120+ reviews)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">4.4/5</div>
                  <div className="text-sm text-gray-400">⭐⭐⭐⭐ (32+ reviews)</div>
                </div>
              </div>
            </div>

            {/* What does it do */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">What does it do?</h2>
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                <p className="text-gray-300 mb-4">
                  Our API extracts product data from any URL. By using AI, our scraper adapts to any website structure and returns the most important product information.
                </p>
                <p className="text-gray-300 mb-6">
                  With Product Fetcher, the days of complex web scraping infrastructure and maintenance are over. Just one API call and you have all the data you need.
                </p>
                
                <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                  <h4 className="text-white font-semibold mb-3">Extracted Information:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["Title", "Price", "Images", "Description", "Rating", "Reviews", "SKU", "Stock"].map(item => (
                      <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="text-green-400" size={14} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded text-sm font-medium">
                    <Play className="inline mr-1" size={14} /> Watch full tutorial
                  </button>
                  <button className="flex-1 py-2 bg-gray-700 text-white rounded text-sm font-medium">
                    View docs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choosing Product Fetcher */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Why choosing Product Fetcher?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="rounded-xl p-6 border" style={{ background: 'rgba(147, 112, 219, 0.15)', borderColor: 'rgba(147, 112, 219, 0.3)' }}>
              <Zap className="text-purple-400 mb-4" size={32} />
              <h3 className="text-white font-bold text-lg mb-2">Blocks Everywhere</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Most web scraping tools get blocked by anti-bot systems. Product Fetcher uses advanced techniques and proxy rotation to ensure you never get blocked.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl p-6 border" style={{ background: 'rgba(138, 180, 248, 0.15)', borderColor: 'rgba(138, 180, 248, 0.3)' }}>
              <Lock className="text-blue-400 mb-4" size={32} />
              <h3 className="text-white font-bold text-lg mb-2">AI Powered</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                When you're using other web scraping tools, you need to write specific code for each website. With Product Fetcher, our AI automatically adapts to any site structure.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl p-6 border" style={{ background: 'rgba(100, 200, 200, 0.15)', borderColor: 'rgba(100, 200, 200, 0.3)' }}>
              <Clock className="text-teal-400 mb-4" size={32} />
              <h3 className="text-white font-bold text-lg mb-2">Save Time & Effort</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Nobody wants to spend time scraping websites when you could be building your product. Let us take care of the data extraction while you focus on what matters.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl p-6 border" style={{ background: 'rgba(147, 112, 219, 0.15)', borderColor: 'rgba(147, 112, 219, 0.3)' }}>
              <TrendingUp className="text-purple-400 mb-4" size={32} />
              <h3 className="text-white font-bold text-lg mb-2">Easy Integration</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Product Fetcher is designed to work seamlessly with your existing tools and workflow. Simple REST API, webhooks, and plugins available.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-xl p-6 border" style={{ background: 'rgba(138, 180, 248, 0.15)', borderColor: 'rgba(138, 180, 248, 0.3)' }}>
              <DollarSign className="text-blue-400 mb-4" size={32} />
              <h3 className="text-white font-bold text-lg mb-2">Proxy Rotation</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Optional use of premium residential proxies included in all plans. Rotate IPs automatically to avoid getting blocked and ensure maximum success rate.
              </p>
            </div>

            {/* Card 6 */}
            <div className="rounded-xl p-6 border" style={{ background: 'rgba(100, 200, 200, 0.15)', borderColor: 'rgba(100, 200, 200, 0.3)' }}>
              <Package className="text-teal-400 mb-4" size={32} />
              <h3 className="text-white font-bold text-lg mb-2">Fast & Reliable</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                All API requests are processed in under 5 seconds, with high availability through our robust infrastructure. You can rely on Product Fetcher for your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How simple is using Product Fetcher */}
      <section className="py-20 px-6 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">
            How simple is using Product Fetcher?
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Product Fetcher provides the simplest product data extraction API for e-commerce. Start scraping any website in just minutes. Forget spending any time on web scraping logic!
          </p>

          {/* Steps */}
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">
                  Get the URL of the product you're interested in. Easy.
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <code className="text-blue-400">https://www.amazon.com/dp/B08N5WRWNW</code>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">
                  Get Product Fetcher with your API KEY and the URL of the requested product.
                </h3>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <pre className="text-sm text-gray-300 overflow-x-auto"><code>{`curl -X GET "https://api.product-fetcher.com/v1/fetch" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d "url=https://amazon.com/product/..."
  
// Response
{
  "product": {
    "title": "Product Name",
    "price": 99.99,
    "images": ["url1", "url2"],
    ...
  }
}`}</code></pre>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">
                  Get the extracted information returned.
                </h3>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90">
                  Start Free trial (10 credits)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WooCommerce Integration */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Video */}
            <div className="relative">
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="text-white" size={32} />
                  </div>
                  <p className="text-gray-400">Watch Tutorial</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-purple-600 rounded-lg px-4 py-2 text-white text-sm font-medium">
                3:42 min
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Seamlessly integrate Product Fetcher with WooCommerce
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Product Fetcher provides a complete WooCommerce integration allowing you to import products directly into your store with one click using just one API call.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Plugin is completely free to use when buying Product Fetcher.",
                  "Import products from any website directly to WooCommerce.",
                  "Automatically updates product information",
                  "Monitor price changes and update accordingly",
                  "No technical knowledge required",
                  "Works with any WooCommerce store"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <Check className="text-green-400 flex-shrink-0 mt-1" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90">
                Download WooCommerce Plugin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">
            Flexible Pricing, Built for You
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Choose the plan that fits your needs. Scale up or down anytime.
          </p>

          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            {/* Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">Monthly requests</span>
                <span className="text-3xl font-bold text-white">
                  {pricingValue.toLocaleString()}
                </span>
              </div>
              
              <input
                type="range"
                min="100"
                max="100000"
                step="100"
                value={pricingValue}
                onChange={(e) => setPricingValue(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${(pricingValue / 100000) * 100}%, #374151 ${(pricingValue / 100000) * 100}%)`
                }}
              />

              <div className="flex justify-between text-gray-500 text-xs mt-2">
                <span>100</span>
                <span>25K</span>
                <span>50K</span>
                <span>75K</span>
                <span>100K</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-white mb-2">
                ${price}
                <span className="text-xl text-gray-400">/month</span>
              </div>
              <div className="text-gray-400">
                ${pricePerThousand} / 1000 requests
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                "Access to Product Crawl API",
                "24/7 Technical Support",
                "Automatic Proxy Rotation",
                "Regular API Updates",
                "AI-Powered Extraction",
                "99.9% Uptime SLA"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <Check className="text-green-400" size={20} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Pricing Tiers */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Starter</div>
                <div className="text-xl font-bold text-white mb-1">Up to 5,000</div>
                <div className="text-2xl font-bold text-blue-400">$50</div>
                <div className="text-xs text-gray-500">Ideal for small projects or multiple testing</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg p-4 border-2 border-blue-500 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
                  MOST POPULAR
                </div>
                <div className="text-sm text-gray-300 mb-1">Real Use</div>
                <div className="text-xl font-bold text-white mb-1">5,000 to 50,000</div>
                <div className="text-2xl font-bold text-blue-400">$150</div>
                <div className="text-xs text-gray-400">Perfect for growing e-commerce businesses</div>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Heavy</div>
                <div className="text-xl font-bold text-white mb-1">50,000 to 1M+</div>
                <div className="text-2xl font-bold text-blue-400">$450</div>
                <div className="text-xs text-gray-500">Tailored for enterprises and large volume data</div>
              </div>
            </div>

            {/* CTA */}
            <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold text-lg hover:opacity-90">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Find answers to the most common questions about Product Fetcher
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-700/20 transition-colors"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700/30 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Package className="text-white" size={20} />
                </div>
                <span className="text-white font-bold">Product Fetcher</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered product data extraction API for e-commerce
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">API Docs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms</Link></li>
                <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700/30 pt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Fetchify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}