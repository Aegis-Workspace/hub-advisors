import { useState } from "react";
import { Search, DollarSign, Users, TrendingUp, Plus } from "lucide-react";
import type { User } from "../../types";
import api from "../../lib/api.lib";
import { CreateAdvisorModal } from "./CreateAdvisorModal";
import { useQuery } from "@tanstack/react-query";

export function AdminAdvisors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { data: advisors = [], refetch } = useQuery<User[]>({
    queryKey: ["advisors"],
    queryFn: async () => {
      const response = await api.get("/advisors");
      return response.data;
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await api.post("/register", data);
      alert("Assessor criado com sucesso!");
      refetch();
    } catch (error: any) {
      console.error("Erro ao criar assessor:", error);
      alert("Erro ao criar assessor. Tente novamente.");
    }
  };
  const filteredAdvisors = advisors.filter((advisor) => advisor.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-100">
      <CreateAdvisorModal isOpen={showModal} onClose={() => setShowModal(false)} onCreate={onSubmit} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Assessores</h1>
            <p className="mt-1 text-sm text-gray-500">Monitore o desempenho e gerencie as comissões dos assessores</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Novo Acessor
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Buscar assessores..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total em Comissões</h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(advisors.reduce((acc, a) => acc + (a.totalCommission || 0), 0))}
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Assessores Ativos</h3>
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{advisors.length}</span>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Média de Captação</h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(advisors.length ? advisors.reduce((acc, a) => acc + (a.totalRaised || 0), 0) / advisors.length : 0)}
            </span>
          </div>
        </div>

        {/* Advisors Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investidores Ativos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Captado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comissões</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdvisors.map((advisor) => (
                <tr key={advisor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advisor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{advisor.activeInvestors?.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(advisor.totalRaised || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(advisor.totalCommission || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-indigo-600 font-medium">Ver detalhes</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
