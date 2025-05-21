import { useState } from "react";
import { Search, Phone, Mail } from "lucide-react";
import type { Investment, User } from "../types";
import { InvestmentStatus } from "@prisma/client";
import api from "../lib/api.lib";
import { useQuery } from "@tanstack/react-query";
import { LuArrowUpRight, LuPlus } from "react-icons/lu";

function InvestorCard({ investor }: { investor: User }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${investor.phone?.replace(/\D/g, "")}`,
      "_blank"
    );
  };

  const handleEmail = () => {
    window.open(`mailto:${investor.email}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="p-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {investor.name}
            </h3>
            <p className="text-sm text-gray-500">CPF: {investor.cpf}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleWhatsApp}
              className="h-8 w-8 bg-black text-white rounded-full transition-colors flex items-center justify-center shadow-lg"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={handleEmail}
              className="h-8 w-8 bg-black text-white rounded-lg transition-colors flex items-center justify-center shadow-lg"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 mb-4 flex flex-col gap-2">
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="w-4 h-4 mr-2" />
            {investor.email}
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Phone className="w-4 h-4 mr-2" />
            {investor.phone}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Investimentos Ativos
          </h4>
          <div className="space-y-2">
            {investor.investments?.map((inv: Investment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{inv.name}</p>
                    <p className="text-gray-500">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(inv.totalAmount ?? 0)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inv.status === InvestmentStatus.RESERVED
                        ? "bg-green-100 text-green-800"
                        : inv.status === InvestmentStatus.OPEN
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {inv.status === InvestmentStatus.RESERVED
                      ? "Ativo"
                      : inv.status === InvestmentStatus.OPEN
                      ? "Pendente"
                      : "Concluído"}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(inv.createdAt).toLocaleDateString("pt-BR")} até{" "}
                  {inv.autoCloseDate
                    ? new Date(inv.autoCloseDate).toLocaleDateString("pt-BR")
                    : "Indeterminado"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-8 flex gap-2 items-center text-sm font-medium text-black group"
        >
          {showDetails ? "Ocultar detalhes" : "Ver detalhes"}
          <LuArrowUpRight className="transform transition-transform duration-300 group-hover:-translate-y-1 group:hover:translate-x-2" />
        </button>

        {showDetails && (
          <div className="mt-10 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Endereço
              </h4>
              <div className="mt-5 rounded-lg">
                <p className="text-sm text-gray-600">
                  {investor.address?.street}, {investor.address?.number}
                  <br />
                  {investor.address?.neighborhood}
                  <br />
                  {investor.address?.city} - {investor.address?.state}
                  <br />
                  CEP: {investor.address?.zipCode}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Dados Bancários
              </h4>
              <div className="mt-5 rounded-lg">
                <p className="text-sm text-gray-600">
                  Banco: {investor.bankAccount?.bank}
                  <br />
                  Agência: {investor.bankAccount?.agency}
                  <br />
                  Conta: {investor.bankAccount?.account}
                  <br />
                  Tipo: Corrente
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Investors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewInvestorModal, setShowNewInvestorModal] = useState(false);
  const { data: investors = [], isLoading } = useQuery<User[]>({
    queryKey: ["investments"],
    queryFn: async () => {
      const res = await api.get("/investors");
      return res.data;
    },
  });
  const filteredInvestors = investors.filter(
    (investor) =>
      investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.cpf?.includes(searchTerm)
  );

  return (
    <div className="h-full ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investidores</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie seus investidores e acompanhe seus investimentos
            </p>
          </div>
          <button
            onClick={() => setShowNewInvestorModal(true)}
            className="bg-white text-black shadow-sm border px-4 py-2 rounded-lg  flex items-center gap-2 active:scale-105"
          >
            <LuPlus />
            Novo Investidor
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border shadow-sm border-gray-300 rounded-lg focus:border-transparent"
            />
          </div>
        </div>

        {/* Investors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestors.map((investor) => (
            <InvestorCard key={investor.id} investor={investor} />
          ))}
        </div>
      </div>
    </div>
  );
}
