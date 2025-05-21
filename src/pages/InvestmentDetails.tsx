import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Shield,
  Clock,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Newspaper,
} from "lucide-react";
import { InvestmentSimulator } from "../components/InvestmentSimulator";
import { ReservationHistory } from "../components/ReservationHistory";
import {
  type Investment,
  type Reservation,
  type AdvisorCommission,
  PaymentFrequency,
  User,
} from "../types";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api.lib";
import { useAuth } from "../contexts/AuthContext";
import { LuArrowUpLeft } from "react-icons/lu";

export function InvestmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const { data: investment } = useQuery<Investment>({
    queryKey: ["investment", id],
    queryFn: async () => {
      const response = await api.get<Investment>(`/investments/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (!investment) {
    return <div>Investment not found</div>;
  }
  const handleReserve = async (
    investor: User,
    amount: number,
    investmentId: number,
    investorId: number
  ) => {
    try {
      const payload = {
        userId: usuario?.id,
        investorId: investorId,
        amount,
      };

      const response = await api.post(
        `/investimentos/${investmentId}/reservar`,
        payload
      );

      console.log("Reserva criada:", response.data.reservation);
      alert("Reserva criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      alert("Erro ao criar reserva");
    }
  };

  const calculateProgress = () => {
    const reserved = investment.reservedAmount || 0;
    const sold =
      (investment.totalAmount ?? 0) - (investment.availableAmount ?? 0);
    const pending = reserved;

    return {
      sold: (sold / (investment.totalAmount ?? 0)) * 100,
      pending: (pending / (investment.totalAmount ?? 0)) * 100,
    };
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/market")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <LuArrowUpLeft className="transform transition-transform duration-300 group-hover:-translate-y-1 group:hover:translate-x-2" />
          Voltar
        </button>

        {/* Investment Header */}
        <div className="bg-white rounded-lg shadow-lg border p-12 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${investment.name}&background=fff&color=000&size=48`}
                  alt={`${investment.name} logo`}
                  className="w-12 h-12 rounded-lg bg-white shadow-lg border"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {investment.name}
                  </h1>
                  <p className="text-gray-500">{investment.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-gray-100 rounded-full h-2 mb-12 overflow-hidden relative flex">
            <div
              className="bg-green-600 h-full transition-all duration-500"
              style={{ width: `${progress.sold}%` }}
            />
            {progress.pending > 0 && (
              <div
                className="h-full bg-orange-500 bg-stripes animate-move-stripes"
                style={{
                  width: `${progress.pending}%`,
                }}
              />
            )}
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-600 rounded-full mr-2" />
                <span>
                  Captado:{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(
                    (investment.totalAmount ?? 0) -
                      (investment.availableAmount ?? 0)
                  )}
                </span>
              </div>
              {progress.pending > 0 && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 bg-stripes rounded-full mr-2" />
                  <span>
                    Reservado:{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(investment.reservedAmount || 0)}
                  </span>
                </div>
              )}
            </div>
            <span>
              Objetivo:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(investment.totalAmount ?? 0)}
            </span>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="shadow-sm border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Rentabilidade</span>
                <div className="h-8 w-8 bg-green-600/20 flex items-center justify-center rounded-lg shadow-lg">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {investment.yieldRate}% {investment.yieldIndex}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Pagamento{" "}
                {investment.paymentFrequency === "MONTHLY"
                  ? "Mensal"
                  : "Trimestral"}
              </p>
            </div>

            <div className="shadow-sm border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Prazo</span>
                <div className="h-8 w-8 bg-orange-600/20 flex items-center justify-center rounded-lg shadow-lg">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {investment.term} meses
              </p>
            </div>

            <div className="shadow-sm border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Valor Mínimo</span>
                <div className="h-8 w-8 bg-slate-100 flex items-center justify-center rounded-lg shadow-lg">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(investment.minAmount)}
              </p>
            </div>

            <div className="shadow-sm border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Garantia</span>
                <div className="h-8 w-8 bg-blue-400/20 flex items-center justify-center rounded-lg shadow-lg">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-900 whitespace-pre-wrap">
                <p>{investment.guarantee.type}</p>
                <p className="text-sm text-gray-400">
                  {investment.guarantee.description}
                </p>
              </p>
            </div>
          </div>

          {/* Registration and Risk */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="shadow-sm border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Registros e Certificações
                </h3>
                <div className="h-8 w-8 bg-green-600/20 flex items-center justify-center rounded-lg shadow-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex gap-2">
                {investment.guarantee.registrations?.map((reg: any) => (
                  <span
                    key={reg}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {reg}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Nível de Risco</h3>
                <div className="h-8 w-8 bg-yellow-400/20 flex items-center justify-center rounded-lg shadow-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {investment.riskLevel}
              </span>
            </div>
          </div>

          {/* News Section */}
          {investment.news && investment.news.length > 0 && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Últimas Atualizações
                </h3>
                <Newspaper className="w-5 h-5 text-green-600" />
              </div>
              {investment.news.map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-green-500 pl-4 py-2"
                >
                  <p className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                  </p>
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 mt-1">{item.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Documents */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Documentos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investment.documents?.map((doc) => (
                <a
                  key={doc.name}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 shadow-sm border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-700">
                    {doc.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Simulator and Reservations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InvestmentSimulator
            investment={investment}
            commission={investment.commission}
            onReserve={handleReserve}
          />
          <ReservationHistory reservations={investment.reservations ?? []} />
        </div>
      </div>
    </div>
  );
}
