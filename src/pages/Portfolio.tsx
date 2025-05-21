import React, { useState } from "react";
import {
  DollarSign,
  Calendar,
  Download,
  Ban as Bank,
  TrendingUp,
} from "lucide-react";
import type { Investment } from "../types";
import api from "../lib/api.lib";
import { useQuery } from "@tanstack/react-query";

interface Commission {
  id: string;
  investment: string;
  investor: string;
  type: "UPFRONT" | "RECURRING";
  amount: number;
  status: "PENDING" | "PAID";
  dueDate: string;
  paidDate?: string;
}

interface BankAccount {
  bank: string;
  agency: string;
  account: string;
  type: "CHECKING" | "SAVINGS";
  holder: string;
  document: string;
}

// Mock data - Replace with real data from your backend
const mockCommissions: Commission[] = [
  {
    id: "1",
    investment: "CDB Banco XYZ",
    investor: "Maria Santos",
    amount: 1500,
    type: "UPFRONT",
    status: "PAID",
    dueDate: "2024-03-15",
    paidDate: "2024-03-15",
  },
  {
    id: "2",
    investment: "LCI Incorporadora ABC",
    investor: "João Silva",
    amount: 250,
    type: "RECURRING",
    status: "PENDING",
    dueDate: "2024-04-15",
  },
];

const mockBankAccount: BankAccount = {
  bank: "Itaú",
  agency: "1234",
  account: "56789-0",
  type: "CHECKING",
  holder: "João Assessor Silva",
  document: "123.456.789-00",
};

function CommissionCard({ commission }: { commission: Commission }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{commission.investment}</h3>
          <p className="text-sm text-gray-500">{commission.investor}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            commission.status === "PAID"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {commission.status === "PAID" ? "Pago" : "Pendente"}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Valor:</span>
          <span className="font-medium text-gray-900">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(commission.amount)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
          <span>Tipo:</span>
          <span>
            {commission.type === "UPFRONT"
              ? "Comissão Inicial"
              : "Repasse Mensal"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
          <span>Vencimento:</span>
          <span>
            {new Date(commission.dueDate).toLocaleDateString("pt-BR")}
          </span>
        </div>
        {commission.paidDate && (
          <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
            <span>Data do Pagamento:</span>
            <span>
              {new Date(commission.paidDate).toLocaleDateString("pt-BR")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Portfolio() {
  const [showBankModal, setShowBankModal] = useState(false);
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");

  const { data, isLoading } = useQuery({
    queryKey: ["commissions", period],
    queryFn: async () => {
      const res = await api.get<{
        commissions: Commission[];
        bankAccount: BankAccount;
      }>(`/portfolio?period=${period}`);
      return res.data;
    },
  });

  const commissions = data?.commissions ?? [];
  const bankAccount = data?.bankAccount;

  const totalCommissions = commissions.reduce(
    (sum, c) => sum + (c.amount ?? 0),
    0
  );

  const pendingCommissions = commissions
    .filter((c) => c.status === "PENDING")
    .reduce((sum, c) => sum + (c.amount ?? 0), 0);

  const generateReport = () => {
    console.log("Generating report...");
  };

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Carteira</h1>
            <p className="mt-1 text-sm text-gray-500">
              Acompanhe suas comissões e rendimentos
            </p>
          </div>
          <button
            onClick={generateReport}
            className="bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar Relatório
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">
                Total de Comissões
              </h3>
              <div className="w-8 h-8 text-white rounded-lg bg-green-600/20 flex items-center justify-center shadow-lg">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalCommissions)}
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">
                Comissões Pendentes
              </h3>
              <div className="w-8 h-8 text-white rounded-lg bg-yellow-600/20 flex items-center justify-center shadow-lg">
                <Calendar className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(pendingCommissions)}
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">
                Conta para Recebimento
              </h3>
              <div className="w-8 h-8 text-white rounded-lg bg-indigo-600/20 flex items-center justify-center shadow-lg">
                <Bank className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            {bankAccount ? (
              <div className="text-sm text-gray-600">
                <p>Banco: {bankAccount.bank}</p>
                <p>Agência: {bankAccount.agency}</p>
                <p>Conta: {bankAccount.account}</p>
                <p>
                  Tipo:{" "}
                  {bankAccount.type === "CHECKING" ? "Corrente" : "Poupança"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Nenhuma conta bancária cadastrada.
              </p>
            )}
            <button
              onClick={() => setShowBankModal(true)}
              className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Alterar dados bancários
            </button>
          </div>
        </div>

        {/* Period Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex space-x-4">
            {(["month", "quarter", "year"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg ${
                  period === p
                    ? "bg-black text-white border"
                    : "bg-transparent border text-gray-700 hover:bg-gray-100"
                }`}
              >
                {p === "month"
                  ? "Este Mês"
                  : p === "quarter"
                  ? "Este Trimestre"
                  : "Este Ano"}
              </button>
            ))}
          </div>
        </div>

        {/* Commissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commissions.map((commission) => (
            <CommissionCard key={commission.id} commission={commission} />
          ))}
        </div>
      </div>
    </div>
  );
}
