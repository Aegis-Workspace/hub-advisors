import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Investment } from "../../types";
import { NewInvestmentModal } from "../../components/admin/NewInvestmentModal";
import api from "../../lib/api.lib";
import { EditInvestmentModal } from "../../components/admin/EditInvestment";

export function AdminInvestments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [yieldRate, setYieldRate] = useState<number | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [showNewInvestmentModal, setShowNewInvestmentModal] = useState(false);
  const [showEditInvestmentModal, setEditInvestmentModal] = useState(false);
  const [investmentIdToEdit, setInvestmentIdToEdit] = useState<number | null>(
    null
  );
  const queryClient = useQueryClient();

  const {
    data: investments = [],
    isLoading,
    refetch,
  } = useQuery<Investment[]>({
    queryKey: ["investments"],
    queryFn: async () => {
      const res = await api.get("/investments");
      console.log(res.data);

      return res.data;
    },
  });

  const createInvestmentMutation = useMutation({
    mutationFn: async (investment: Partial<Investment>) => {
      const res = await api.post("/investments", investment);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      setShowNewInvestmentModal(false);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Erro ao cadastrar investimento");
    },
  });

  const updateInvestmentMutation = useMutation({
    mutationFn: async (updateData: {
      investmentId: number;
      type?: string;
      yieldRate?: number;
      yieldIndex?: string;
      totalAmount?: number;
      status?: string;
    }) => {
      const res = await api.put("/investments", updateData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Erro ao atualizar investimento");
    },
  });

  const handleCreateInvestment = (investment: Partial<Investment>) => {
    createInvestmentMutation.mutate(investment);
  };

  const deleteInvestment = async (investmentId: any) => {
    await api.delete("/investments", {
      data: { investmentId },
    });
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestão de Investimentos
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie as oportunidades de investimento disponíveis na
              plataforma
            </p>
          </div>
          <button
            onClick={() => setShowNewInvestmentModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Investimento
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar investimentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Investimento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Rentabilidade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Captação
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Carregando investimentos...
                  </td>
                </tr>
              ) : (
                investments
                  .filter((inv) =>
                    inv.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((investment) => (
                    <tr key={investment.id}>
                      {/* Investimento */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${investment.name}&background=fff&color=000&size=48`}
                            alt={investment.name}
                            className="w-10 h-10 rounded-lg"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {investment.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {investment.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tipo */}
                      <td className="px-4 py-3">
                        {!isReadOnly ? (
                          <select
                            value={investment.type}
                            onChange={(e) => {
                              const newType = e.target.value;
                              setType(newType);
                              updateInvestmentMutation.mutate({
                                investmentId: investment.id,
                                type: newType,
                              });
                            }}
                            className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="CDB">CDB</option>
                            <option value="LCI">LCI</option>
                            <option value="LCA">LCA</option>
                            <option value="DEBENTURE">DEBENTURE</option>
                          </select>
                        ) : (
                          <div className="text-sm text-gray-900">
                            {investment.type}
                          </div>
                        )}
                      </td>

                      {/* Rentabilidade */}
                      <td className="px-4 py-3">
                        {!isReadOnly ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={investment.yieldRate ?? ""}
                              onChange={(e) => {
                                const newRate = Number(e.target.value);
                                updateInvestmentMutation.mutate({
                                  investmentId: investment.id,
                                  yieldRate: newRate,
                                });
                              }}
                              className="w-24 h-10 px-3 text-sm border rounded-lg focus:ring-2"
                            />
                            <select
                              value={investment.yieldIndex ?? ""}
                              onChange={(e) => {
                                const yieldIndex = e.target.value;
                                updateInvestmentMutation.mutate({
                                  investmentId: investment.id,
                                  yieldIndex: yieldIndex,
                                });
                              }}
                              className="text-xs p-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="CDI">CDI</option>
                              <option value="IPCA">IPCA</option>
                            </select>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <span>
                              {investment.yieldRate?.toFixed(1) ?? "-"}
                            </span>
                            <span className="text-gray-500">%</span>
                            {investment.yieldIndex && (
                              <span className="text-xs text-gray-400">
                                {investment.yieldIndex}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Captação */}
                      <td className="px-4 py-3">
                        {!isReadOnly ? (
                          <input
                            type="number"
                            min="0"
                            step="100000"
                            value={investment.totalAmount ?? 0}
                            onChange={(e) => {
                              const newTotalAmount = Number(e.target.value);
                              updateInvestmentMutation.mutate({
                                investmentId: investment.id,
                                totalAmount: newTotalAmount,
                              });
                            }}
                            className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <div>
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(investment.totalAmount ?? 0)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {investment.totalAmount &&
                              investment.availableAmount != null
                                ? `${Math.round(
                                    (investment.availableAmount /
                                      investment.totalAmount) *
                                      100
                                  )}% disponível`
                                : "--"}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {!isReadOnly ? (
                          <select
                            value={investment.status}
                            onChange={(e) => {
                              const status = String(e.target.value);
                              updateInvestmentMutation.mutate({
                                investmentId: investment.id,
                                status,
                              });
                            }}
                            className={`w-full h-10 text-xs font-medium rounded-full text-center
                    ${
                      investment.status === "OPEN"
                        ? "bg-green-200 text-green-800"
                        : investment.status === "CLOSED"
                        ? "bg-red-200 text-red-800"
                        : investment.status === "RESERVED"
                        ? "bg-yellow-200 text-yellow-800"
                        : investment.status === "DRAFT"
                        ? "bg-gray-300 text-gray-700"
                        : "bg-gray-400 text-black"
                    }`}
                          >
                            <option value="CLOSED">CLOSED</option>
                            <option value="DRAFT">DRAFT</option>
                            <option value="OPEN">OPEN</option>
                            <option value="RESERVED">RESERVED</option>
                          </select>
                        ) : (
                          <div
                            className={`h-8 w-full rounded-full flex items-center justify-center text-xs font-medium
                    ${
                      investment.status === "OPEN"
                        ? "bg-green-200 text-green-800"
                        : investment.status === "CLOSED"
                        ? "bg-red-200 text-red-800"
                        : investment.status === "RESERVED"
                        ? "bg-yellow-200 text-yellow-800"
                        : investment.status === "DRAFT"
                        ? "bg-gray-300 text-gray-700"
                        : "bg-gray-400 text-black"
                    }`}
                          >
                            {investment.status}
                          </div>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {!isReadOnly ? (
                            <button
                              className="text-sm text-blue-600 hover:underline"
                              onClick={() => setIsReadOnly(true)}
                            >
                              Salvar
                            </button>
                          ) : (
                            <button
                              className="text-gray-400 hover:text-gray-500"
                              onClick={() => {
                                setInvestmentIdToEdit(investment.id);
                                setIsReadOnly(false);
                              }}
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => deleteInvestment(investment.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewInvestmentModal
        isOpen={showNewInvestmentModal}
        onClose={() => setShowNewInvestmentModal(false)}
        onSubmit={handleCreateInvestment}
      />

      <EditInvestmentModal
        isOpen={showEditInvestmentModal}
        onClose={() => setEditInvestmentModal(false)}
        idUpdated={investmentIdToEdit}
        refetch={refetch}
      />
    </div>
  );
}
