import { useState, useEffect } from "react";
import { InvestmentStatus } from "../../types";
import api from "../../lib/api.lib";

interface EditInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  idUpdated: number | null;
  refetch: () => void;
}

export function EditInvestmentModal({
  isOpen,
  onClose,
  idUpdated,
  refetch,
}: EditInvestmentModalProps) {
  const [type, setType] = useState<string | null>(null);
  const [yieldRate, setYieldRate] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [status, setStatus] = useState<InvestmentStatus>("DRAFT");

  const [errors, setErrors] = useState<{
    type?: string;
    yieldRate?: string;
    totalAmount?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) {
      setType(null);
      setYieldRate(null);
      setTotalAmount(null);
      setStatus("DRAFT");
      setErrors({});
    }
  }, [isOpen]);

  const bodyParams = {
    type: type,
    yieldRate,
    totalAmount: totalAmount,
    status,
  };

  const filteredData = Object.fromEntries(
    Object.entries(bodyParams).filter(([, value]) => value !== undefined)
  );

  const updateInvestment = async (idUpdated: number | null) => {
    if (idUpdated) {
      await api.put("/investments/", {
        investmentId: idUpdated,
        ...filteredData,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-md p-8 w-1/3 h-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Editar Investimento</h2>
          <button onClick={onClose}>X</button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Garantia
          </label>
          <select
            value={type ?? ""}
            onChange={(e) =>
              setType(e.target.value === "" ? null : e.target.value)
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.type ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value="CDB">CDB</option>
            <option value="LCI">LCI</option>
            <option value="LCA">LCA</option>
            <option value="DEBENTURE">DEBENTURE</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rentabilidade Base (% ao ano)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={yieldRate ?? ""}
            onChange={(e) =>
              setYieldRate(
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.yieldRate ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.yieldRate && (
            <p className="mt-1 text-sm text-red-600">{errors.yieldRate}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor Total da Captação
          </label>
          <input
            type="number"
            min="0"
            step="100000"
            value={totalAmount ?? ""}
            onChange={(e) =>
              setTotalAmount(
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.totalAmount ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.totalAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status da Oferta
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as InvestmentStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="PAUSED">Pausada</option>
            <option value="DRAFT">Rascunho</option>
            <option value="OPEN">Em Captação</option>
            <option value="RESERVED">Reservado</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-red-500 transition"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              await updateInvestment(idUpdated);
              refetch();
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
