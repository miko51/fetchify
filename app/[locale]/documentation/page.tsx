"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Play, Book, Code, Zap, Shield, Globe, Package, FileText, Briefcase, Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function DocumentationPage() {
  const locale = useLocale();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("curl");
  const [extractionType, setExtractionType] = useState("product");
  const [testUrl, setTestUrl] = useState("https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html");
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
      alert("Please fill in the URL and API key");
      return;
    }

    setTestLoading(true);
    try {
      const res = await fetch(`/api/extract`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${testApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: testUrl,
          type: extractionType,
        }),
      });
      const data = await res.json();
      setTestResponse(data);
    } catch (error) {
      setTestResponse({ error: "Request error" });
    } finally {
      setTestLoading(false);
    }
  };

  const getExampleForType = (type: string, language: string) => {
    const examples: Record<string, Record<string, string>> = {
      curl: {
        product: `curl -X POST "https://fetchify.app/api/extract" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/product/123",
    "type": "product",
    "source": "browserHtml"
  }'`,
        productList: `curl -X POST "https://fetchify.app/api/extract" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/products",
    "type": "productList",
    "country": "FR"
  }'`,
        article: `curl -X POST "https://fetchify.app/api/extract" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/blog/article",
    "type": "article"
  }'`,
        serp: `curl -X POST "https://fetchify.app/api/extract" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://www.google.com/search?q=iphone",
    "type": "serp",
    "source": "httpResponseBody"
  }'`,
      },
      javascript: {
        product: `const response = await fetch('https://fetchify.app/api/extract', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com/product/123',
    type: 'product',
    source: 'browserHtml'
  })
});

const data = await response.json();
console.log(data);`,
        productList: `const response = await fetch('https://fetchify.app/api/extract', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com/products',
    type: 'productList',
    country: 'FR'
  })
});

const data = await response.json();
console.log(data);`,
        article: `const response = await fetch('https://fetchify.app/api/extract', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com/blog/article',
    type: 'article'
  })
});

const data = await response.json();
console.log(data);`,
        serp: `const response = await fetch('https://fetchify.app/api/extract', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.google.com/search?q=iphone',
    type: 'serp',
    source: 'httpResponseBody'
  })
});

const data = await response.json();
console.log(data);`,
      },
      python: {
        product: `import requests

response = requests.post(
    'https://fetchify.app/api/extract',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'url': 'https://example.com/product/123',
        'type': 'product',
        'source': 'browserHtml'
    }
)

data = response.json()
print(data)`,
        productList: `import requests

response = requests.post(
    'https://fetchify.app/api/extract',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'url': 'https://example.com/products',
        'type': 'productList',
        'country': 'FR'
    }
)

data = response.json()
print(data)`,
        article: `import requests

response = requests.post(
    'https://fetchify.app/api/extract',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'url': 'https://example.com/blog/article',
        'type': 'article'
    }
)

data = response.json()
print(data)`,
        serp: `import requests

response = requests.post(
    'https://fetchify.app/api/extract',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'url': 'https://www.google.com/search?q=iphone',
        'type': 'serp',
        'source': 'httpResponseBody'
    }
)

data = response.json()
print(data)`,
      },
      php: {
        product: `<?php
$ch = curl_init('https://fetchify.app/api/extract');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'url' => 'https://example.com/product/123',
    'type' => 'product',
    'source' => 'browserHtml'
]));

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);
?>`,
        productList: `<?php
$ch = curl_init('https://fetchify.app/api/extract');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'url' => 'https://example.com/products',
    'type' => 'productList',
    'country' => 'FR'
]));

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);
?>`,
        article: `<?php
$ch = curl_init('https://fetchify.app/api/extract');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'url' => 'https://example.com/blog/article',
    'type' => 'article'
]));

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);
?>`,
        serp: `<?php
$ch = curl_init('https://fetchify.app/api/extract');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'url' => 'https://www.google.com/search?q=iphone',
    'type' => 'serp',
    'source' => 'httpResponseBody'
]));

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);
?>`,
      },
    };

    return examples[language]?.[type] || examples[language]?.product || '';
  };

  const extractionTypes = [
    { value: 'product', label: 'Product', icon: Package, description: 'Extract data from a single product page' },
    { value: 'productList', label: 'Product List', icon: Package, description: 'Extract products from a listing page' },
    { value: 'article', label: 'Article', icon: FileText, description: 'Extract data from an article or blog post' },
    { value: 'articleList', label: 'Article List', icon: FileText, description: 'Extract articles from a listing page' },
    { value: 'jobPosting', label: 'Job Posting', icon: Briefcase, description: 'Extract data from a job posting' },
    { value: 'jobPostingNavigation', label: 'Job List', icon: Briefcase, description: 'Extract jobs from a listing page' },
    { value: 'serp', label: 'SERP', icon: Search, description: 'Extract Google search results' },
  ];

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
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl mb-6">
              <Book className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              API Documentation
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Extract structured data from any website using our powerful and simple API.
              Support for products, articles, jobs, and more.
            </p>
          </div>

          {/* Quick Start */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Quick Start</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Get your API key</h3>
                  <p className="text-slate-400 text-sm">
                    Sign up and generate an API key from your dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Make your first request</h3>
                  <p className="text-slate-400 text-sm">
                    Send a POST request to <code className="text-blue-400">/api/extract</code> with your target URL
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Get structured data</h3>
                  <p className="text-slate-400 text-sm">
                    Receive clean, structured JSON data ready to use in your application
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Extraction Types */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-violet-400" />
              <h2 className="text-2xl font-bold text-white">Supported Extraction Types</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extractionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.value}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-white font-semibold mb-1">{type.label}</h3>
                        <p className="text-slate-400 text-sm">{type.description}</p>
                        <code className="text-xs text-violet-400 mt-2 inline-block">type: "{type.value}"</code>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Authentication */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Authentication</h2>
            </div>
            <p className="text-slate-300 mb-4">
              All API requests require authentication using your API key. Pass it in the <code className="text-blue-400">Authorization</code> header:
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <code className="text-green-400">Authorization: Bearer YOUR_API_KEY</code>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              Alternative: You can also pass the API key as a query parameter <code className="text-blue-400">?apiKey=YOUR_API_KEY</code>
            </p>
          </div>

          {/* Endpoint */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Main Endpoint</h2>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">POST</span>
                <code className="text-blue-400 text-lg">/api/extract</code>
              </div>
              <p className="text-slate-400 text-sm">
                Extract structured data from any website
              </p>
            </div>

            {/* Request Parameters */}
            <h3 className="text-lg font-bold text-white mb-4">Request Body Parameters</h3>
            <div className="space-y-3 mb-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-violet-400">url</code>
                  <span className="text-xs text-red-400 font-semibold">required</span>
                  <span className="text-xs text-slate-500">string</span>
                </div>
                <p className="text-slate-300 text-sm">The URL of the page to extract data from</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-violet-400">type</code>
                  <span className="text-xs text-red-400 font-semibold">required</span>
                  <span className="text-xs text-slate-500">string</span>
                </div>
                <p className="text-slate-300 text-sm mb-2">The type of data to extract:</p>
                <code className="text-xs text-slate-400">
                  product | productList | productNavigation | article | articleList | 
                  articleNavigation | forumThread | jobPosting | jobPostingNavigation | 
                  pageContent | serp
                </code>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-violet-400">source</code>
                  <span className="text-xs text-slate-500">optional | string</span>
                </div>
                <p className="text-slate-300 text-sm mb-2">Extraction method (default: browserHtml):</p>
                <ul className="text-xs text-slate-400 space-y-1 ml-4">
                  <li>• <code>httpResponseBody</code> - Fast & cheap, works for most sites</li>
                  <li>• <code>browserHtmlOnly</code> - Better for JavaScript-heavy sites</li>
                  <li>• <code>browserHtml</code> - Best quality with visual features</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-violet-400">country</code>
                  <span className="text-xs text-slate-500">optional | string</span>
                </div>
                <p className="text-slate-300 text-sm">
                  2-letter ISO country code for geolocation (e.g., <code className="text-blue-400">FR, US, GB, DE</code>)
                </p>
              </div>
            </div>

            {/* Response */}
            <h3 className="text-lg font-bold text-white mb-4">Response Format</h3>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                }}
              >
                {`{
  "success": true,
  "data": {
    // Extracted data structure depends on the type
    // See examples below for each type
  },
  "metadata": {
    "extractionType": "product",
    "source": "browserHtml",
    "country": "FR",
    "processingTime": 2341,
    "creditsUsed": 2,
    "creditsRemaining": 98
  }
}`}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-violet-400" />
              <h2 className="text-2xl font-bold text-white">Code Examples</h2>
            </div>

            {/* Extraction Type Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select extraction type:
              </label>
              <select
                value={extractionType}
                onChange={(e) => setExtractionType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                {extractionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {['curl', 'javascript', 'python', 'php'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === lang
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>

            {/* Code Block */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => copyToClipboard(getExampleForType(extractionType, activeTab), 1)}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors z-10"
              >
                {copiedIndex === 1 ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <SyntaxHighlighter
                language={activeTab === 'curl' ? 'bash' : activeTab}
                style={vscDarkPlus}
                customStyle={{
                  background: 'transparent',
                  padding: '1.5rem',
                  margin: 0,
                }}
              >
                {getExampleForType(extractionType, activeTab)}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Credit Costs</h2>
            </div>
            <p className="text-slate-300 mb-6">
              Credits are automatically deducted based on the extraction type and method:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="pb-3 text-slate-300 font-semibold">Extraction Type</th>
                    <th className="pb-3 text-slate-300 font-semibold">httpResponseBody</th>
                    <th className="pb-3 text-slate-300 font-semibold">browserHtmlOnly</th>
                    <th className="pb-3 text-slate-300 font-semibold">browserHtml</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  <tr className="border-b border-slate-800">
                    <td className="py-3">product, article, jobPosting</td>
                    <td className="py-3 text-green-400">1 credit</td>
                    <td className="py-3 text-blue-400">2 credits</td>
                    <td className="py-3 text-violet-400">3 credits</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3">productList, articleList</td>
                    <td className="py-3 text-green-400">2 credits</td>
                    <td className="py-3 text-blue-400">3 credits</td>
                    <td className="py-3 text-violet-400">5 credits</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3">serp (non-AI)</td>
                    <td className="py-3 text-green-400">1 credit</td>
                    <td className="py-3 text-blue-400">1 credit</td>
                    <td className="py-3 text-violet-400">2 credits</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Playground */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Play className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Try It Out</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={testApiKey}
                  onChange={(e) => setTestApiKey(e.target.value)}
                  placeholder="Your API key"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Extraction Type
                </label>
                <select
                  value={extractionType}
                  onChange={(e) => setExtractionType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  {extractionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target URL
                </label>
                <input
                  type="url"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleTest}
                disabled={testLoading}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                {testLoading ? 'Processing...' : 'Test Request'}
              </button>
              {testResponse && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mt-4 max-h-96 overflow-auto">
                  <pre className="text-sm text-slate-300">
                    {JSON.stringify(testResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Error Codes */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Error Codes</h2>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm font-semibold">401</span>
                  <span className="text-white font-semibold">Unauthorized</span>
                </div>
                <p className="text-slate-300 text-sm">Invalid or missing API key</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm font-semibold">402</span>
                  <span className="text-white font-semibold">Payment Required</span>
                </div>
                <p className="text-slate-300 text-sm">Insufficient credits</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm font-semibold">429</span>
                  <span className="text-white font-semibold">Too Many Requests</span>
                </div>
                <p className="text-slate-300 text-sm">Rate limit exceeded (max 60 requests per minute)</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm font-semibold">500</span>
                  <span className="text-white font-semibold">Internal Server Error</span>
                </div>
                <p className="text-slate-300 text-sm">Extraction failed or unexpected error occurred</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
