"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  TrendingUp, 
  FileText, 
  UserMinus, 
  Search, 
  Plus, 
  X, 
  Loader2 
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  invoicesCount: number;
  totalBilled: number;
  status: "Actif" | "Impayé" | "Inactif";
}

const INITIAL_CLIENTS: Client[] = [
  { id: "1", name: "Boutique Awa", email: "contact@boutiqueawa.ci", phone: "+225 07 01 23 45", address: "Cocody, Abidjan", invoicesCount: 6, totalBilled: 1250000, status: "Actif" },
  { id: "2", name: "Nike Distribution CI", email: "compta@nikedistrib.ci", phone: "+225 05 44 12 09", address: "Zone 4, Abidjan", invoicesCount: 12, totalBilled: 6840000, status: "Impayé" },
  { id: "3", name: "Restaurant Le Baobab", email: "baobab.resto@gmail.com", phone: "+225 01 88 76 32", address: "Marcory, Abidjan", invoicesCount: 3, totalBilled: 210000, status: "Actif" },
  { id: "4", name: "Pharmacie Centrale", email: "pharmaciecentrale@yahoo.fr", phone: "+225 07 90 11 22", address: "Plateau, Abidjan", invoicesCount: 9, totalBilled: 3120000, status: "Actif" },
  { id: "5", name: "Atelier Coutures Fatou", email: "fatou.couture@gmail.com", phone: "+225 05 33 67 18", address: "Yopougon, Abidjan", invoicesCount: 2, totalBilled: 97000, status: "Impayé" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"Tous" | "Actifs" | "Impayés" | "Inactifs">("Tous");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [formError, setFormError] = useState("");

  const totalActive = useMemo(() => clients.filter(c => c.status === "Actif" || c.status === "Impayé").length, [clients]);
  const totalBilled = useMemo(() => clients.reduce((acc, c) => acc + c.totalBilled, 0), [clients]);

  const mostActiveClient = useMemo(() => {
    if (clients.length === 0) return null;
    return [...clients].sort((a, b) => b.totalBilled - a.totalBilled)[0];
  }, [clients]);

  const leastActiveClient = useMemo(() => {
    if (clients.length === 0) return null;
    return [...clients].sort((a, b) => a.totalBilled - b.totalBilled)[0];
  }, [clients]);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            client.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilter === "Actifs") return matchesSearch && client.status === "Actif";
      if (activeFilter === "Impayés") return matchesSearch && client.status === "Impayé";
      if (activeFilter === "Inactifs") return matchesSearch && client.status === "Inactif";
      return matchesSearch;
    });
  }, [clients, searchQuery, activeFilter]);

  const handleSubmitNewClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Le nom du client est obligatoire.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const newClient: Client = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email || "Non renseigné",
        phone: formData.phone || "Non renseigné",
        address: formData.address || "Non renseigné",
        invoicesCount: 0,
        totalBilled: 0,
        status: "Actif"
      };

      setClients(prev => [newClient, ...prev]);
      setIsModalOpen(false);
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (err) {
      setFormError("Erreur lors de la création du client.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Clients</h1>
          <p className="text-sm text-gray-500">{clients.length} clients enregistrés</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-black active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouveau client
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
            <Users className="w-4 h-4" /> Clients actifs
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalActive}</div>
          <p className="text-xs text-gray-400">sur {clients.length} au total</p>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
            <TrendingUp className="w-4 h-4" /> Total facturé
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {totalBilled.toLocaleString('fr-FR')} FCFA
          </div>
          <p className="text-xs text-gray-400">tous clients confondus</p>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
            <FileText className="w-4 h-4" /> Client le plus actif
          </div>
          <div className="text-base font-bold text-emerald-600 truncate">
            {mostActiveClient ? mostActiveClient.name : "Aucun"}
          </div>
          <p className="text-xs text-gray-400">
            {mostActiveClient ? `${mostActiveClient.totalBilled.toLocaleString('fr-FR')} FCFA` : "0 FCFA"}
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
            <UserMinus className="w-4 h-4" /> Client le plus inactif
          </div>
          <div className="text-base font-bold text-rose-600 truncate">
            {leastActiveClient ? leastActiveClient.name : "Aucun"}
          </div>
          <p className="text-xs text-gray-400">
            {leastActiveClient ? `${leastActiveClient.totalBilled.toLocaleString('fr-FR')} FCFA` : "0 FCFA"}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["Tous", "Actifs", "Impayés", "Inactifs"] as const).map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 whitespace-nowrap ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-3 px-4 font-medium">Client</th>
                <th className="py-3 px-4 font-medium">Contact</th>
                <th className="py-3 px-4 font-medium">Factures</th>
                <th className="py-3 px-4 font-medium">Total facturé</th>
                <th className="py-3 px-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-gray-900">{client.name}</td>
                    <td className="py-3.5 px-4 text-gray-500">{client.email}</td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">{client.invoicesCount}</td>
                    <td className="py-3.5 px-4 text-gray-900 font-semibold">{client.totalBilled.toLocaleString('fr-FR')} FCFA</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === "Actif" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        client.status === "Impayé" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Aucun client trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-semibold text-gray-900">Créer un nouveau client</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewClient} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nom du client *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Abidjan Logistics"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="contact@societe.ci"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  placeholder="+225 07 00 00 00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              {formError && <p className="text-xs text-rose-600">{formError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-black flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isSubmitting ? "Création..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
