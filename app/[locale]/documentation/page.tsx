"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Play, Book, Code, Zap, Shield, Globe } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function DocumentationPage() {
  const locale = useLocale();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("curl");
  const [testUrl, setTestUrl] = useState("https://example.com/product/12345");
  const [testApiKey, setTestApiKey] = useState("");
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleTest = async () => {
    if (!testApiKey || !testUrl) {
      alert("Veuillez remplir l'URL et la clé API");
      return;
    }

    setTestLoading(true);
    try {
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(testUrl)}`, {
        headers: {
          'X-API-Key': testApiKey,
        },
      });
      const data = await res.json();
      setTestResponse(data);
    } catch (error) {
      setTestResponse({ error: "Erreur lors de la requête" });
    } finally {
      setTestLoading(false);
    }
  };

  const examples = {
    curl: `curl -X GET "https://fetchify.app/api/fetch?url=https://example.com/product/123" \\
  -H "X-API-Key: YOUR_API_KEY"`,
    
    javascript: `const fetch = require('node-fetch');

async function fetchProduct(url) {
  const response = await fetch(
    \`https://fetchify.app/api/fetch?url=\${encodeURIComponent(url)}\`,
    {
      headers: {
        'X-API-Key': 'YOUR_API_KEY'
      }
    }
  );
  
  const data = await response.json();
  return data;
}

// Utilisation
const productData = await fetchProduct('https://example.com/product/123');
console.log(productData);`,

    python: `import requests

def fetch_product(url):
    api_url = f"https://fetchify.app/api/fetch?url={url}"
    headers = {
        "X-API-Key": "YOUR_API_KEY"
    }
    
    response = requests.get(api_url, headers=headers)
    return response.json()

# Utilisation
product_data = fetch_product("https://example.com/product/123")
print(product_data)`,

    php: `<?php

function fetchProduct($url) {
    $apiUrl = "https://fetchify.app/api/fetch?url=" . urlencode($url);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'X-API-Key: YOUR_API_KEY'
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Utilisation
$productData = fetchProduct("https://example.com/product/123");
print_r($productData);
?>`,
  };

  const responseExample = {
    success: true,
    data: {
      title: "Product Name",
      price: "99.99",
      currency: "EUR",
      description: "Product description here...",
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      availability: "in_stock",
      brand: "Brand Name",
      sku: "PROD-12345",
      rating: 4.5,
      reviews_count: 127
    },
    credits_used: 1,
    timestamp: "2025-10-08T12:34:56Z"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/${locale}`} className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Fetchify
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href={`/${locale}/dashboard`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href={`/${locale}/auth/signin`}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Book className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">Documentation API</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                Documentation Fetchify API
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour intégrer notre API d'extraction de données produits dans vos applications.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sommaire</h3>
                <nav className="space-y-2">
                  {[
                    { id: "introduction", label: "Introduction", icon: Book },
                    { id: "authentication", label: "Authentification", icon: Shield },
                    { id: "endpoints", label: "Endpoints", icon: Code },
                    { id: "examples", label: "Exemples", icon: Zap },
                    { id: "playground", label: "Playground", icon: Play },
                    { id: "errors", label: "Codes d'erreur", icon: Globe },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all group"
                    >
                      <item.icon className="h-4 w-4 group-hover:text-blue-400 transition-colors" />
                      <span>{item.label}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Introduction */}
              <section id="introduction" className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-4">Introduction</h2>
                <p className="text-slate-300 mb-6">
                  L'API Fetchify vous permet d'extraire des données produits de n'importe quel site e-commerce en temps réel. 
                  Obtenez le titre, le prix, les images, la description, et bien plus encore en une seule requête.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  {[
                    { icon: Zap, title: "Rapide", desc: "Réponse en < 3s" },
                    { icon: Shield, title: "Sécurisé", desc: "Clés API chiffrées" },
                    { icon: Globe, title: "Global", desc: "Tous les sites" },
                  ].map((feature, i) => (
                    <div key={i} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                      <feature.icon className="h-8 w-8 text-blue-400 mb-3" />
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-400">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-blue-300 text-sm">
                    <strong>✨ Astuce :</strong> Commencez par générer votre clé API dans le{" "}
                    <Link href={`/${locale}/dashboard/keys`} className="underline hover:text-blue-200">
                      dashboard
                    </Link>
                    .
                  </p>
                </div>
              </section>

              {/* Authentication */}
              <section id="authentication" className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-4">Authentification</h2>
                <p className="text-slate-300 mb-6">
                  Toutes les requêtes API doivent inclure votre clé API dans le header <code className="px-2 py-1 bg-slate-800 rounded">X-API-Key</code>.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Méthode 1 : Header HTTP (Recommandé)</h4>
                    <div className="relative">
                      <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '12px', padding: '20px' }}>
                        {`curl -H "X-API-Key: YOUR_API_KEY" \\
  "https://fetchify.app/api/fetch?url=..."`}
                      </SyntaxHighlighter>
                      <button
                        onClick={() => copyToClipboard(`curl -H "X-API-Key: YOUR_API_KEY" "https://fetchify.app/api/fetch?url=..."`, 0)}
                        className="absolute top-4 right-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        {copiedIndex === 0 ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-slate-300" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Méthode 2 : Paramètre URL</h4>
                    <div className="relative">
                      <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '12px', padding: '20px' }}>
                        {`https://fetchify.app/api/fetch?url=...&apiKey=YOUR_API_KEY`}
                      </SyntaxHighlighter>
                      <button
                        onClick={() => copyToClipboard(`https://fetchify.app/api/fetch?url=...&apiKey=YOUR_API_KEY`, 1)}
                        className="absolute top-4 right-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        {copiedIndex === 1 ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-slate-300" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <p className="text-orange-300 text-sm">
                    <strong>⚠️ Sécurité :</strong> Ne partagez jamais votre clé API publiquement. Utilisez toujours des variables d'environnement côté serveur.
                  </p>
                </div>
              </section>

              {/* Endpoints */}
              <section id="endpoints" className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-4">Endpoints</h2>

                <div className="space-y-6">
                  {/* Fetch Product */}
                  <div className="border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-mono">GET</span>
                        <span className="text-white font-mono">/api/fetch</span>
                      </div>
                      <span className="text-sm text-slate-400">1 crédit / requête</span>
                    </div>

                    <p className="text-slate-300 mb-4">
                      Extrait les données d'un produit à partir de son URL.
                    </p>

                    <h5 className="text-white font-semibold mb-2">Paramètres</h5>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg">
                        <code className="text-blue-400 font-mono text-sm">url</code>
                        <div className="flex-1">
                          <p className="text-slate-300 text-sm">URL complète du produit à extraire</p>
                          <span className="text-xs text-slate-500">string, requis</span>
                        </div>
                      </div>
                    </div>

                    <h5 className="text-white font-semibold mb-2">Réponse</h5>
                    <div className="relative">
                      <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ borderRadius: '12px', padding: '20px' }}>
                        {JSON.stringify(responseExample, null, 2)}
                      </SyntaxHighlighter>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(responseExample, null, 2), 2)}
                        className="absolute top-4 right-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        {copiedIndex === 2 ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-slate-300" />}
                      </button>
                    </div>
                  </div>

                  {/* Check Credits */}
                  <div className="border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-mono">GET</span>
                        <span className="text-white font-mono">/api/credits/balance</span>
                      </div>
                      <span className="text-sm text-slate-400">Gratuit</span>
                    </div>

                    <p className="text-slate-300 mb-4">
                      Vérifiez votre solde de crédits disponibles.
                    </p>

                    <h5 className="text-white font-semibold mb-2">Réponse</h5>
                    <div className="relative">
                      <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ borderRadius: '12px', padding: '20px' }}>
                        {`{
  "credits": 1247,
  "user_id": "user_abc123"
}`}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </section>

              {/* Code Examples */}
              <section id="examples" className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-4">Exemples de code</h2>
                <p className="text-slate-300 mb-6">
                  Intégrez l'API Fetchify dans votre langage préféré.
                </p>

                {/* Language Tabs */}
                <div className="flex space-x-2 mb-4 overflow-x-auto">
                  {Object.keys(examples).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveTab(lang)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === lang
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <SyntaxHighlighter
                    language={activeTab === "curl" ? "bash" : activeTab}
                    style={vscDarkPlus}
                    customStyle={{ borderRadius: '12px', padding: '20px' }}
                  >
                    {examples[activeTab as keyof typeof examples]}
                  </SyntaxHighlighter>
                  <button
                    onClick={() => copyToClipboard(examples[activeTab as keyof typeof examples], 3)}
                    className="absolute top-4 right-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    {copiedIndex === 3 ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-slate-300" />}
                  </button>
                </div>
              </section>

              {/* Interactive Playground */}
              <section id="playground" className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center space-x-3">
                  <Play className="h-8 w-8 text-blue-400" />
                  <span>Playground</span>
                </h2>
                <p className="text-slate-300 mb-6">
                  Testez l'API directement depuis votre navigateur.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      URL du produit
                    </label>
                    <input
                      type="url"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                      placeholder="https://example.com/product/12345"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Clé API
                    </label>
                    <input
                      type="password"
                      value={testApiKey}
                      onChange={(e) => setTestApiKey(e.target.value)}
                      placeholder="Votre clé API"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  <button
                    onClick={handleTest}
                    disabled={testLoading}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {testLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Test en cours...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        <span>Tester l'API</span>
                      </>
                    )}
                  </button>

                  {testResponse && (
                    <div className="mt-4">
                      <h4 className="text-white font-semibold mb-2">Réponse :</h4>
                      <div className="relative">
                        <SyntaxHighlighter
                          language="json"
                          style={vscDarkPlus}
                          customStyle={{ borderRadius: '12px', padding: '20px' }}
                        >
                          {JSON.stringify(testResponse, null, 2)}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Error Codes */}
              <section id="errors" className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-4">Codes d'erreur</h2>
                <p className="text-slate-300 mb-6">
                  L'API utilise les codes HTTP standards pour indiquer le succès ou l'échec d'une requête.
                </p>

                <div className="space-y-3">
                  {[
                    { code: "200", title: "OK", desc: "Requête réussie" },
                    { code: "400", title: "Bad Request", desc: "Paramètres invalides ou manquants" },
                    { code: "401", title: "Unauthorized", desc: "Clé API invalide ou manquante" },
                    { code: "402", title: "Payment Required", desc: "Crédits insuffisants" },
                    { code: "429", title: "Too Many Requests", desc: "Limite de taux dépassée" },
                    { code: "500", title: "Internal Server Error", desc: "Erreur serveur" },
                  ].map((error, i) => (
                    <div key={i} className="flex items-start space-x-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                      <span className={`px-3 py-1 rounded-lg text-sm font-mono ${
                        error.code === "200"
                          ? "bg-green-500/20 text-green-400"
                          : error.code.startsWith("4")
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {error.code}
                      </span>
                      <div>
                        <h4 className="text-white font-semibold">{error.title}</h4>
                        <p className="text-slate-400 text-sm">{error.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA */}
              <section className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Prêt à commencer ?
                </h2>
                <p className="text-slate-300 mb-6">
                  Créez votre compte et obtenez 100 crédits gratuits pour tester l'API.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/${locale}/auth/signup`}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold transition-all"
                  >
                    Créer un compte
                  </Link>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
                  >
                    Voir le dashboard
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

