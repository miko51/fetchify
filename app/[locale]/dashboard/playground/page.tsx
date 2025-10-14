"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Copy, AlertCircle, Code2, Zap, CheckCircle2, Globe } from "lucide-react";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
}

type ExtractionType = 
  | 'product'
  | 'productList'
  | 'productNavigation'
  | 'article'
  | 'articleList'
  | 'articleNavigation'
  | 'forumThread'
  | 'jobPosting'
  | 'jobPostingNavigation'
  | 'pageContent'
  | 'serp';

type ExtractionSource = 'httpResponseBody' | 'browserHtmlOnly' | 'browserHtml';

const EXTRACTION_TYPES: { value: ExtractionType; label: string; description: string }[] = [
  { value: 'product', label: 'Product', description: 'Extract data from a product page' },
  { value: 'productList', label: 'Product List', description: 'Extract products from a listing page' },
  { value: 'productNavigation', label: 'Product Navigation', description: 'Extract category navigation' },
  { value: 'article', label: 'Article', description: 'Extract data from an article/blog post' },
  { value: 'articleList', label: 'Article List', description: 'Extract articles from a listing page' },
  { value: 'articleNavigation', label: 'Article Navigation', description: 'Extract article navigation' },
  { value: 'forumThread', label: 'Forum Thread', description: 'Extract data from a forum thread' },
  { value: 'jobPosting', label: 'Job Posting', description: 'Extract data from a job posting' },
  { value: 'jobPostingNavigation', label: 'Job List', description: 'Extract jobs from a listing page' },
  { value: 'pageContent', label: 'Page Content', description: 'Extract generic page content' },
  { value: 'serp', label: 'SERP', description: 'Extract Google search results' },
];

const EXTRACTION_SOURCES: { value: ExtractionSource; label: string; description: string }[] = [
  { value: 'httpResponseBody', label: 'HTTP (Fast & Cheap)', description: 'Works for most sites' },
  { value: 'browserHtmlOnly', label: 'Browser HTML', description: 'Better for JS-heavy sites' },
  { value: 'browserHtml', label: 'Browser + Visual', description: 'Best quality (default)' },
];

// Liste des pays supportés par Zyte API
// Source: https://docs.zyte.com/zyte-api/usage/reference.html#geolocation
const COUNTRY_CODES = [
  { code: '', label: 'No specific country' },
  { code: 'US', label: '🇺🇸 United States' },
  { code: 'FR', label: '🇫🇷 France' },
  { code: 'GB', label: '🇬🇧 United Kingdom' },
  { code: 'DE', label: '🇩🇪 Germany' },
  { code: 'ES', label: '🇪🇸 Spain' },
  { code: 'IT', label: '🇮🇹 Italy' },
  { code: 'CA', label: '🇨🇦 Canada' },
  { code: 'AU', label: '🇦🇺 Australia' },
  { code: 'BR', label: '🇧🇷 Brazil' },
  { code: 'MX', label: '🇲🇽 Mexico' },
  { code: 'NL', label: '🇳🇱 Netherlands' },
  { code: 'BE', label: '🇧🇪 Belgium' },
  { code: 'PL', label: '🇵🇱 Poland' },
  { code: 'IN', label: '🇮🇳 India' },
  { code: 'JP', label: '🇯🇵 Japan' },
  { code: 'KR', label: '🇰🇷 South Korea' },
  { code: 'CN', label: '🇨🇳 China' },
  { code: 'TR', label: '🇹🇷 Turkey' },
  { code: 'RU', label: '🇷🇺 Russia' },
  { code: 'ZA', label: '🇿🇦 South Africa' },
];

type SearchEngine = 'google' | 'bing';

export default function PlaygroundPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedKeyId, setSelectedKeyId] = useState<string>("");
  const [url, setUrl] = useState("");
  const [extractionType, setExtractionType] = useState<ExtractionType>('product');
  const [countryCode, setCountryCode] = useState("");
  const [searchEngine, setSearchEngine] = useState<SearchEngine>('google');
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Quand on passe en mode SERP, initialiser un pays par défaut si vide
  const handleExtractionTypeChange = (newType: ExtractionType) => {
    setExtractionType(newType);
    if (newType === 'serp' && !countryCode) {
      setCountryCode('US'); // Pays par défaut pour SERP
    }
  };

  // Mapping des codes pays vers les domaines Google
  const getGoogleDomain = (country: string): string => {
    const googleDomains: Record<string, string> = {
      'US': 'google.com',
      'FR': 'google.fr',
      'GB': 'google.co.uk',
      'DE': 'google.de',
      'ES': 'google.es',
      'IT': 'google.it',
      'CA': 'google.ca',
      'AU': 'google.com.au',
      'BR': 'google.com.br',
      'MX': 'google.com.mx',
      'NL': 'google.nl',
      'BE': 'google.be',
      'PL': 'google.pl',
      'IN': 'google.co.in',
      'JP': 'google.co.jp',
      'KR': 'google.co.kr',
      'CN': 'google.cn',
      'TR': 'google.com.tr',
      'RU': 'google.ru',
      'ZA': 'google.co.za',
    };
    return googleDomains[country] || 'google.com';
  };

  // Helper pour générer l'URL finale selon le type d'extraction
  const generateFinalUrl = () => {
    if (extractionType === 'serp') {
      const query = searchQuery || "example query";
      const encodedQuery = encodeURIComponent(query);
      
      if (searchEngine === 'google') {
        const domain = getGoogleDomain(countryCode);
        return `https://www.${domain}/search?q=${encodedQuery}`;
      } else {
        // Bing utilise le paramètre cc pour le pays
        return `https://www.bing.com/search?q=${encodedQuery}${countryCode ? `&cc=${countryCode}` : ''}`;
      }
    }
    return url || "https://example.com";
  };
  
  // Always use httpResponseBody (fast and cheap)
  const extractionSource: ExtractionSource = 'httpResponseBody';
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");
  const [currentCredits, setCurrentCredits] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  useEffect(() => {
    fetchApiKeys();
    fetchUserCredits();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys");
      const data = await response.json();
      const activeKeys = data.apiKeys?.filter((k: ApiKey) => k.isActive) || [];
      setApiKeys(activeKeys);
      if (activeKeys.length > 0) {
        setSelectedKeyId(activeKeys[0].id);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const fetchUserCredits = async () => {
    try {
      const response = await fetch("/api/user/me");
      const data = await response.json();
      setCurrentCredits(data.user.credits);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const testApi = async () => {
    // Validation pour SERP
    if (extractionType === 'serp') {
      if (!searchQuery.trim()) {
        setError("Veuillez entrer une requête de recherche");
        return;
      }
      if (!countryCode) {
        setError("Le pays est obligatoire pour les recherches SERP");
        return;
      }
    } else {
      if (!url) {
        setError("Veuillez entrer une URL");
        return;
      }
    }

    if (!selectedKeyId) {
      setError("Veuillez sélectionner une clé API");
      return;
    }

    const selectedKey = apiKeys.find((k) => k.id === selectedKeyId);
    if (!selectedKey) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const requestBody: any = {
        url: generateFinalUrl(),
        type: extractionType,
        source: extractionSource,
      };

      if (countryCode) {
        requestBody.country = countryCode;
      }

      const apiResponse = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${selectedKey.key}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        setError(data.error || "Erreur lors de l'appel API");
      } else {
        setResponse(data);
        // Rafraîchir les crédits
        fetchUserCredits();
      }
    } catch (err) {
      setError("Erreur lors de l'appel à l'API");
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const generateCurlCommand = () => {
    const selectedKey = apiKeys.find((k) => k.id === selectedKeyId);
    if (!selectedKey) return "";

    const requestBody: any = {
      url: generateFinalUrl(),
      type: extractionType,
      source: extractionSource,
    };

    if (countryCode) {
      requestBody.country = countryCode;
    }

    return `curl -X POST https://fetchify.app/api/extract \\
  -H "Authorization: Bearer ${selectedKey.key}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(requestBody, null, 2)}'`;
  };

  const copyCurlCommand = () => {
    navigator.clipboard.writeText(generateCurlCommand());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const generateJavaScriptCode = () => {
    const selectedKey = apiKeys.find((k) => k.id === selectedKeyId);
    if (!selectedKey) return "";

    const requestBody: any = {
      url: generateFinalUrl(),
      type: extractionType,
      source: extractionSource,
    };

    if (countryCode) {
      requestBody.country = countryCode;
    }

    return `const response = await fetch('https://fetchify.app/api/extract', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${selectedKey.key}',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${JSON.stringify(requestBody, null, 2)})
});

const data = await response.json();
console.log(data);`;
  };

  const generatePythonCode = () => {
    const selectedKey = apiKeys.find((k) => k.id === selectedKeyId);
    if (!selectedKey) return "";

    const requestBody: any = {
      url: generateFinalUrl(),
      type: extractionType,
      source: extractionSource,
    };

    if (countryCode) {
      requestBody.country = countryCode;
    }

    return `import requests

response = requests.post(
    'https://fetchify.app/api/extract',
    headers={
        'Authorization': 'Bearer ${selectedKey.key}',
        'Content-Type': 'application/json',
    },
    json=${JSON.stringify(requestBody, null, 2).replace(/"/g, "'")}
)

data = response.json()
print(data)`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">API Playground</h1>
          </div>
          <p className="text-emerald-100">
            Test your API in real-time with different extraction types
          </p>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          <div className="card-modern">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                Configuration
              </h2>

              <div className="space-y-6">
                {/* API Key Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    API Key
                  </label>
                  {apiKeys.length === 0 ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-sm text-yellow-400">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      No active API keys. Create one in the Keys tab.
                    </div>
                  ) : (
                    <select
                      value={selectedKeyId}
                      onChange={(e) => setSelectedKeyId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      {apiKeys.map((key) => (
                        <option key={key.id} value={key.id}>
                          {key.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* URL Input ou Search Query selon le type */}
                {extractionType === 'serp' ? (
                  <>
                    {/* Search Engine Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Search Engine *
                      </label>
                      <select
                        value={searchEngine}
                        onChange={(e) => setSearchEngine(e.target.value as SearchEngine)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        <option value="google">🔍 Google</option>
                        <option value="bing">🔍 Bing</option>
                      </select>
                    </div>

                    {/* Search Query Input */}
                    <div>
                      <label htmlFor="searchQuery" className="block text-sm font-medium text-slate-300 mb-2">
                        Search Query *
                      </label>
                      <Input
                        id="searchQuery"
                        type="text"
                        placeholder="iphone 15 pro"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-modern"
                      />
                      <p className="mt-1 text-xs text-slate-400">
                        💡 URL générée: {generateFinalUrl()}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">
                      Target URL
                    </label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/product"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="input-modern"
                    />
                  </div>
                )}

                {/* Extraction Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Extraction Type
                  </label>
                  <select
                    value={extractionType}
                    onChange={(e) => handleExtractionTypeChange(e.target.value as ExtractionType)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    {EXTRACTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Country {extractionType === 'serp' ? '(Required for SERP) *' : '(Optional)'}
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${
                      extractionType === 'serp' && !countryCode ? 'border-red-500' : 'border-slate-700'
                    }`}
                  >
                    {COUNTRY_CODES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  {extractionType === 'serp' && !countryCode && (
                    <p className="mt-1 text-xs text-red-400">
                      ⚠️ Le pays est obligatoire pour améliorer la qualité des résultats SERP
                    </p>
                  )}
                </div>

                {/* Credits Display */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Available Credits</span>
                    <span className="text-2xl font-bold text-blue-400">
                      {currentCredits.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Test Button */}
                <button
                  onClick={testApi}
                  disabled={loading || apiKeys.length === 0}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {loading ? "Processing..." : "Test API"}
                </button>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="card-modern">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">cURL Example</h3>
                <button
                  onClick={copyCurlCommand}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Copy"
                >
                  {copiedCode ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 overflow-x-auto">
                <code>{generateCurlCommand()}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column - Response */}
        <div className="space-y-6">
          <div className="card-modern">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Response</h2>
                {response && (
                  <button
                    onClick={copyResponse}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Copy response"
                  >
                    {copiedResponse ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                )}
              </div>

              {response ? (
                <div className="space-y-4">
                  {/* Metadata */}
                  {response.metadata && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Status</div>
                        <div className="text-emerald-400 font-semibold">Success</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Credits Used</div>
                        <div className="text-blue-400 font-semibold">
                          {response.metadata.creditsUsed}
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Processing Time</div>
                        <div className="text-violet-400 font-semibold">
                          {response.metadata.processingTime}ms
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Remaining Credits</div>
                        <div className="text-cyan-400 font-semibold">
                          {response.metadata.creditsRemaining}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* JSON Response */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-[600px] overflow-auto">
                    <pre className="text-sm text-slate-300">
                      <code>{JSON.stringify(response.data, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-xl p-12 text-center">
                  <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    Configure your request and click "Test API" to see the response
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
