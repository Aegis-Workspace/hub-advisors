import React from "react";
import { DollarSign } from "lucide-react";
import type { Advisor } from "../types";

interface NextDividendsProps {
  dividends: Advisor["nextDividends"];
}

export function NextDividends({ dividends }: NextDividendsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Próximos Dividendos
        </h3>
        <div className="w-8 h-8 text-white rounded-lg bg-amber-500/20 flex items-center justify-center shadow-lg">
          <DollarSign className="w-4 h-4 text-amber-500" />
        </div>
      </div>
      <div className="space-y-4">
        {dividends.map((dividend, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-sky-100 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">{dividend.investment}</p>
              <p className="text-sm text-gray-500">
                {new Date(dividend.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <span className="text-lg font-semibold text-black">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(dividend.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
