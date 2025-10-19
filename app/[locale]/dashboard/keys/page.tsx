"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Plus, Trash2, Eye, EyeOff, Power, Key, CheckCircle2, Clock } from "lucide-react";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
  _count: {
    apiUsage: number;
  };
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [creatingKey, setCreatingKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys");
      const data = await response.json();
      setApiKeys(data.apiKeys || []);
    } catch (error) {
      console.error("Erreur lors du chargement des clés:", error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) return;

    setCreatingKey(true);
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (response.ok) {
        setNewKeyName("");
        setShowCreateForm(false);
        fetchApiKeys();
      }
    } catch (error) {
      console.error("Erreur lors de la création de la clé:", error);
    } finally {
      setCreatingKey(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette clé ?")) return;

    try {
      const response = await fetch(`/api/keys?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchApiKeys();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const toggleKeyStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch("/api/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive }),
      });

      if (response.ok) {
        fetchApiKeys();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const maskKey = (key: string) => {
    return `${key.substring(0, 12)}${"•".repeat(32)}${key.substring(key.length - 4)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-800"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute inset-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700 p-6 lg:p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 lg:p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Key className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h1 className="text-2xl lg:text-4xl font-bold text-white">Clés API</h1>
            </div>
            <p className="text-sm lg:text-base text-violet-100">
              Gérez vos clés d'authentification pour accéder à l'API
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary flex items-center gap-2 w-full lg:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            <span className="lg:inline">Nouvelle clé</span>
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="card-modern">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-white mb-2">Créer une nouvelle clé API</h3>
            <p className="text-slate-400 text-sm mb-4 lg:mb-6">
              Donnez un nom à votre clé pour l'identifier facilement
            </p>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="keyName" className="block text-sm font-medium text-slate-300 mb-2">
                  Nom de la clé
                </label>
                <Input
                  id="keyName"
                  placeholder="Ex: Production, Développement, Test..."
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="input-modern"
                />
              </div>
              <div className="flex lg:items-end gap-2">
                <button
                  onClick={createApiKey}
                  disabled={creatingKey || !newKeyName.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex-1 lg:flex-initial"
                >
                  {creatingKey ? "Création..." : "Créer"}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewKeyName("");
                  }}
                  className="btn-secondary flex-1 lg:flex-initial"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.length === 0 ? (
          <div className="card-modern">
            <div className="py-20 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-2xl flex items-center justify-center">
                <Key className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Aucune clé API
              </h3>
              <p className="text-slate-400 mb-6">
                Créez votre première clé pour commencer à utiliser l'API
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Créer une clé
              </button>
            </div>
          </div>
        ) : (
          apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="card-modern card-modern-hover">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Key Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-white">{apiKey.name}</h3>
                      <span
                        className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${
                          apiKey.isActive
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-700/50 text-slate-400 border border-slate-600"
                        }`}
                      >
                        {apiKey.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Key Display */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-4">
                      <code className="flex-1 bg-slate-950 border border-slate-800 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-mono text-violet-400 overflow-x-auto">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-2 sm:p-3 hover:bg-slate-800 rounded-xl transition-colors flex-shrink-0"
                        title={visibleKeys.has(apiKey.id) ? "Masquer" : "Afficher"}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        className="p-2 sm:p-3 hover:bg-slate-800 rounded-xl transition-colors flex-shrink-0 relative"
                        title="Copier"
                      >
                        {copiedKey === apiKey.id ? (
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                        )}
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Créée le {new Date(apiKey.createdAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                      {apiKey.lastUsedAt && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>
                            Utilisée le {new Date(apiKey.lastUsedAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span>{apiKey._count.apiUsage} appels</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 lg:flex-col">
                    <button
                      onClick={() => toggleKeyStatus(apiKey.id, apiKey.isActive)}
                      className={`p-2 sm:p-3 rounded-xl transition-colors flex-1 lg:flex-initial ${
                        apiKey.isActive
                          ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                          : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
                      }`}
                      title={apiKey.isActive ? "Désactiver" : "Activer"}
                    >
                      <Power className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => deleteApiKey(apiKey.id)}
                      className="p-2 sm:p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors flex-1 lg:flex-initial"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Card */}
      {apiKeys.length > 0 && (
        <div className="card-modern bg-blue-500/5 border-blue-500/20">
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-3">💡 Bonnes pratiques</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Ne partagez jamais vos clés API publiquement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Utilisez des clés différentes pour chaque environnement (dev, prod)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Désactivez ou supprimez les clés que vous n'utilisez plus</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Surveillez régulièrement l'utilisation de vos clés</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
