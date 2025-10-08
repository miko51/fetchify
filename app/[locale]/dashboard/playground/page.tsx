"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Copy, AlertCircle, Code2, Zap, CheckCircle2 } from "lucide-react";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
}

export default function PlaygroundPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedKeyId, setSelectedKeyId] = useState<string>("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");
  const [currentCredits, setCurrentCredits] = useState(0);

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
    if (!url) {
      setError("Veuillez entrer une URL");
      return;
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
      const apiResponse = await fetch(
        `/api/v1/product-crawl?url=${encodeURIComponent(url)}`,
        {
          headers: {
            "X-API-Key": selectedKey.key,
          },
        }
      );

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
    }
  };

  const copyCurlCommand = () => {
    const selectedKey = apiKeys.find((k) => k.id === selectedKeyId);
    if (!selectedKey) return;

    const curlCommand = `curl -X GET "${window.location.origin}/api/v1/product-crawl?url=${encodeURIComponent(
      url
    )}" \\
  -H "X-API-Key: ${selectedKey.key}"`;

    navigator.clipboard.writeText(curlCommand);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-violet-600 to-blue-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Playground API</h1>
              <p className="text-blue-100 mt-1">
                Testez l'API Product Crawl en temps réel
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>{currentCredits} crédits disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Réponse temps réel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Warning */}
      {currentCredits === 0 && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <AlertCircle className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="font-semibold text-white text-lg">
                Vous n'avez plus de crédits
              </p>
              <p className="text-slate-300 mt-1">
                Achetez des crédits pour continuer à utiliser l'API
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Request Panel */}
        <div className="space-y-6">
          <div className="card-modern card-modern-hover">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Configuration</h3>
              <p className="text-slate-400 text-sm mb-6">
                Configurez votre requête API
              </p>

              {apiKeys.length === 0 ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                  <p className="text-sm text-yellow-400">
                    Vous n'avez pas de clé API active. Créez-en une dans l'onglet "Clés API".
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-2">
                      Clé API
                    </label>
                    <select
                      id="apiKey"
                      value={selectedKeyId}
                      onChange={(e) => setSelectedKeyId(e.target.value)}
                      className="input-modern"
                    >
                      {apiKeys.map((key) => (
                        <option key={key.id} value={key.id}>
                          {key.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">
                      URL du produit
                    </label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/product/123"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="input-modern"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      L'URL complète du produit à crawler
                    </p>
                  </div>

                  <button
                    onClick={testApi}
                    disabled={loading || !url || currentCredits === 0}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Chargement...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Tester l'API
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* cURL Command */}
          {apiKeys.length > 0 && url && (
            <div className="card-modern">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Commande cURL</h3>
                  <button
                    onClick={copyCurlCommand}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 text-green-400 p-4 rounded-xl text-xs overflow-x-auto">
                  {`curl -X GET "${window.location.origin}/api/v1/product-crawl?url=${encodeURIComponent(
                    url
                  )}" \\
  -H "X-API-Key: ${apiKeys.find((k) => k.id === selectedKeyId)?.key}"`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Response Panel */}
        <div>
          <div className="card-modern h-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Réponse</h3>
                {response && (
                  <button
                    onClick={copyResponse}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                  <p className="font-semibold mb-1">Erreur</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {response && (
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Succès - Statut 200
                      </span>
                      <span className="text-xs text-emerald-400/80">
                        Crédits restants: {response.credits?.remaining || 0}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
                    <pre className="text-sm text-green-400">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {!error && !response && !loading && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-2xl flex items-center justify-center">
                    <Code2 className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-500">La réponse de l'API s'affichera ici</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-800"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute inset-0"></div>
                  </div>
                  <p className="text-slate-400 mt-4">Traitement en cours...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div className="card-modern">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Documentation API</h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Endpoint</h4>
              <code className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-sm text-blue-400 inline-block">
                GET /api/v1/product-crawl
              </code>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Paramètres</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <code className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-sm text-violet-400 whitespace-nowrap">
                    url
                  </code>
                  <div className="text-sm text-slate-300">
                    <span className="text-orange-400 font-medium">(required)</span> - L'URL
                    complète du produit à crawler
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Headers</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <code className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-sm text-violet-400 whitespace-nowrap">
                    X-API-Key
                  </code>
                  <div className="text-sm text-slate-300">
                    Votre clé API d'authentification
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Réponse</h4>
              <p className="text-sm text-slate-400 mb-4">
                L'API retourne un objet JSON contenant les informations du produit et les crédits
                restants.
              </p>
              <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs overflow-x-auto text-green-400">
                {`{
  "data": {
    // Données du produit
  },
  "credits": {
    "remaining": 99,
    "used": 1
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

