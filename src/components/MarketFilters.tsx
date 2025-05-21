import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface FiltersState {
  search: string;
  type: string;
  minYield: string;
  maxTerm: string;
  guarantee: string;
  minAmount: string;
}

interface MarketFiltersProps {
  filters: FiltersState;
  onFilterChange: (name: keyof FiltersState, value: string) => void;
}

export function MarketFilters({ filters, onFilterChange }: MarketFiltersProps) {
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="rounded-lg mb-16">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar oportunidades..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="w-full pl-10 pr-4 py-2 border shadow-sm border-gray-300 rounded-lg focus:border-transparent"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <select
            value={filters.type}
            onChange={(e) => onFilterChange("type", e.target.value)}
            className="border border-gray-300 shadow-lg rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Tipo de Investimento</option>
            <option value="CDB">CDB</option>
            <option value="LCI">LCI</option>
            <option value="LCA">LCA</option>
            <option value="DEBENTURE">Debênture</option>
          </select>

          <select
            value={filters.minYield}
            onChange={(e) => onFilterChange("minYield", e.target.value)}
            className="border border-gray-300 shadow-lg rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Rentabilidade Mínima</option>
            <option value="8">Acima de 8% CDI</option>
            <option value="10">Acima de 10% CDI</option>
            <option value="12">Acima de 12% CDI</option>
            <option value="15">Acima de 15% CDI</option>
          </select>

          <select
            value={filters.maxTerm}
            onChange={(e) => onFilterChange("maxTerm", e.target.value)}
            className="border border-gray-300 shadow-lg rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Prazo Máximo</option>
            <option value="12">Até 12 meses</option>
            <option value="24">Até 24 meses</option>
            <option value="36">Até 36 meses</option>
            <option value="48">Até 48 meses</option>
          </select>

          <select
            value={filters.guarantee}
            onChange={(e) => onFilterChange("guarantee", e.target.value)}
            className="border border-gray-300 shadow-lg rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Tipo de Garantia</option>
            <option value="REAL">Garantia Real</option>
            <option value="FIDEJUSSORIA">Garantia Fidejussória</option>
            <option value="FLUTUANTE">Garantia Flutuante</option>
          </select>

          <select
            value={filters.minAmount}
            onChange={(e) => onFilterChange("minAmount", e.target.value)}
            className="border border-gray-300 shadow-lg rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Valor Mínimo</option>
            <option value="5000">R$ 5.000</option>
            <option value="10000">R$ 10.000</option>
            <option value="25000">R$ 25.000</option>
            <option value="50000">R$ 50.000</option>
          </select>
        </div>
      )}
    </div>
  );
}
