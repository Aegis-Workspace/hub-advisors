import React from "react";
import { useNavigate } from "react-router-dom";
import { Investment } from "../types";
import { MarketFilters } from "../components/MarketFilters";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api.lib";

function InvestmentCard({ investment }: { investment: Investment }) {
  const navigate = useNavigate();
  console.log(investment);

  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="relative h-48">
        <img
          src={investment.image}
          alt={investment.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 p-4">
          <img
            src={`https://ui-avatars.com/api/?name=${investment.name}&background=fff&color=000&size=48`}
            alt={`${investment.name} logo`}
            className="w-12 h-12 rounded-lg bg-white shadow-sm"
          />
        </div>
        <div className="absolute top-4 right-4 p-4">
          <span className="inline-flex items-center w-24 h-8 justify-center rounded-full text-xs font-bold bg-white border shadow-lg text-black">
            {investment.category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 p-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white">
            INVESTIMENTO MÍNIMO: R${" "}
            {investment.minAmount.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {investment.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{investment.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Valor objetivo</p>
              <p className="text-base font-medium text-gray-900">
                R$ {investment.totalAmount?.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Rentabilidade</p>
              <p className="text-base font-medium text-gray-900">
                {investment.yieldRate}% {investment.yieldIndex}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/market/${investment.id}`)}
            className="mt-10 w-full bg-sky-500/10 text-sky-600 p-3 rounded-lg  transition-colors font-semibold text-sm shadow-sm border border-sky-600/10 active:scale-105"
          >
            Ver oferta
          </button>
        </div>
      </div>
    </div>
  );
}

export function Market() {
  const { data: investments } = useQuery<Investment[]>({
    queryKey: ["investimentos"],
    queryFn: async () => {
      const response = await api.get<Investment[]>("/investments");
      return response.data;
    },
  });
  const [filters, setFilters] = React.useState({
    search: "",
    type: "",
    minYield: "",
    maxTerm: "",
    guarantee: "",
    minAmount: "",
  });

  const handleFilterChange = (name: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredInvestments =
    investments?.filter((investment) => {
      if (
        filters.search &&
        !investment.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.type && investment.type !== filters.type) {
        return false;
      }
      if (
        filters.minYield &&
        (investment.yieldRate ?? 0) < Number(filters.minYield)
      ) {
        return false;
      }
      if (filters.maxTerm && (investment.term ?? 0) > Number(filters.maxTerm)) {
        return false;
      }
      if (
        filters.guarantee &&
        !investment.guarantee.includes(filters.guarantee)
      ) {
        return false;
      }
      if (
        filters.minAmount &&
        investment.minAmount < Number(filters.minAmount)
      ) {
        return false;
      }
      return true;
    }) ?? [];

  return (
    <div className="h-full ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Ofertas de investimento disponíveis
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Invista em startups criteriosamente selecionadas a partir de R$
            5.000
          </p>
        </div>

        <MarketFilters filters={filters} onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestments?.map((investment) => (
            <InvestmentCard key={investment.id} investment={investment} />
          ))}
        </div>
      </div>
    </div>
  );
}
