"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";

interface CreditPackage {
  id: string;
  name: string;
  description: string;
  credits: number;
  price: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

export default function PackagesAdminPage() {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    credits: 0,
    price: 0,
    features: [] as string[],
    isPopular: false,
    isActive: true,
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const res = await fetch("/api/admin/packages", { cache: 'no-store' });
    const data = await res.json();
    setPackages(data.packages);
    setLoading(false);
  };

  const handleCreate = async () => {
    const res = await fetch("/api/admin/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowCreateModal(false);
      resetForm();
      loadPackages();
    }
  };

  const handleUpdate = async () => {
    if (!editingPackage) return;

    const res = await fetch(`/api/admin/packages/${editingPackage.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setEditingPackage(null);
      resetForm();
      loadPackages();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce pack ?")) return;

    const res = await fetch(`/api/admin/packages/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadPackages();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      credits: 0,
      price: 0,
      features: [],
      isPopular: false,
      isActive: true,
    });
  };

  const openEditModal = (pkg: CreditPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      credits: pkg.credits,
      price: pkg.price,
      features: pkg.features,
      isPopular: pkg.isPopular,
      isActive: pkg.isActive,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Packs de crédits
          </h1>
          <p className="text-slate-400">Gérez les offres de la plateforme</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all"
        >
          <Plus size={20} />
          Nouveau pack
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-slate-900/50 border ${
              pkg.isPopular
                ? "border-violet-500/50"
                : "border-slate-800"
            } rounded-2xl p-6 backdrop-blur-sm`}
          >
            {pkg.isPopular && (
              <div className="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold rounded-full">
                POPULAIRE
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
              <p className="text-slate-400 text-sm mt-1">{pkg.description}</p>
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold text-white">
                {(pkg.price / 100).toFixed(2)} €
              </p>
              <p className="text-slate-400 text-sm mt-1">
                {pkg.credits.toLocaleString()} crédits
              </p>
            </div>

            {pkg.features && pkg.features.length > 0 && (
              <div className="mb-6 space-y-2">
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="text-emerald-400" size={16} />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(pkg)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 text-white rounded-lg hover:bg-slate-700/50 transition-all"
              >
                <Edit size={16} />
                Éditer
              </button>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {!pkg.isActive && (
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-slate-900/80 rounded-2xl flex items-center justify-center">
                <span className="text-red-400 font-bold">DÉSACTIVÉ</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingPackage) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPackage ? "Modifier le pack" : "Créer un nouveau pack"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">Crédits</label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">
                    Prix (en centimes)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) =>
                      setFormData({ ...formData, isPopular: e.target.checked })
                    }
                    className="w-5 h-5 rounded bg-slate-800 border-slate-700"
                  />
                  Pack populaire
                </label>

                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 rounded bg-slate-800 border-slate-700"
                  />
                  Actif
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingPackage(null);
                  resetForm();
                }}
                className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={editingPackage ? handleUpdate : handleCreate}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all"
              >
                {editingPackage ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

