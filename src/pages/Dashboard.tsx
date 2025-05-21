import { Users, Briefcase, PiggyBank, Loader } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { NotificationPanel } from "../components/NotificationPanel";
import { NextDividends } from "../components/NextDividends";
import type { Advisor, Notification } from "../types";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api.lib";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const advisor: Advisor = {
  nextDividends: [
    {
      date: "2024-04-15",
      amount: 12500,
      investment: "CDB Banco XYZ",
    },
    {
      date: "2024-04-20",
      amount: 8750,
      investment: "LCI Incorporadora ABC",
    },
  ],
};

const notifications: Notification[] = [
  {
    id: 1,
    type: "NEW_OPPORTUNITY",
    title: "New Investment Opportunity",
    message: "CDB XYZ Bank - 120% CDI, minimum R$10,000",
    date: "2024-03-20",
    read: false,
  },
  {
    id: 2,
    type: "RESERVATION_STATUS",
    title: "Reservation Confirmed",
    message: "Investment reservation for client Maria Santos was confirmed",
    date: "2024-03-19",
    read: true,
  },
];

export function Dashboard() {
  const { usuario } = useAuth();
  const {
    data: kpis = {
      totalInvested: 0,
      totalInvestments: 0,
      totalReservations: 0,
      totalInvestors: 0,
    },
    isLoading: loadingKpis,
  } = useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: async () => {
      return await api.get<any, any>("/dashboard");
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: captacao = [], isLoading: loadingChart } = useQuery({
    queryKey: ["dashboard-captacao"],
    queryFn: async () => {
      return await api.get<any, any>("/dashboard/captacao");
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Seja bem vindo, <span className="font-bold">{usuario?.name}</span>
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{usuario?.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Investido"
            value={kpis.totalInvested ?? kpis.data.totalInvested}
            icon={Briefcase}
            iconBg="bg-green-500/20"
            iconText="text-green-500"
            is_money
          />
          <DashboardCard
            title="Investimentos Ativos"
            value={kpis.totalInvestments ?? kpis.data.totalInvestments}
            icon={PiggyBank}
            iconBg="bg-blue-500/20"
            iconText="text-blue-500"
            is_money={false}
          />
          <DashboardCard
            title="Investidores Ativos"
            value={kpis.totalInvestors ?? kpis.data.totalInvestors}
            icon={Users}
            iconBg="bg-purple-500/20"
            iconText="text-purple-500"
            is_money={false}
          />
        </div>

        <div className="bg-white rounded-xl border shadow-lg p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Evolução da Captação
          </h2>
          {loadingChart ? (
            <Loader />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={captacao.data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis
                  tickFormatter={(v) =>
                    v.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  }
                />
                <Tooltip
                  formatter={(v) =>
                    v.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  }
                  labelFormatter={(l) => `Mês: ${l}`}
                />
                <Line
                  type="monotone"
                  dataKey="captado"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Notifications and Dividends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NotificationPanel notifications={notifications} />
          <NextDividends dividends={advisor.nextDividends} />
        </div>
      </main>
    </div>
  );
}
