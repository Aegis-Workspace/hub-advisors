import React from "react";
import { LayoutDashboard, Users, FileText, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api.lib";

const recentActivity = [
  {
    type: "RESERVATION",
    advisor: "João Silva",
    investor: "Maria Santos",
    investment: "CDB Banco XYZ",
    amount: 50000,
    date: "2024-03-20T10:30:00Z",
  },
  {
    type: "SIGNATURE",
    advisor: "Ana Oliveira",
    investor: "Pedro Costa",
    investment: "LCI Incorporadora ABC",
    amount: 25000,
    date: "2024-03-20T09:15:00Z",
  },
];

type Stats = {
  totalInvestments: number;
  activeAdvisors: number;
  pendingReservations: number;
  pendingSignatures: number;
};
type Activity = {
  type: "RESERVATION" | "SIGNATURE";
  advisor: string;
  investor: string;
  investment: string;
  amount: number;
  date: string;
};

export function AdminDashboard() {
  const {
    data: stats = {
      totalInvestments: 0,
      activeAdvisors: 0,
      pendingReservations: 0,
      pendingSignatures: 0,
    },
    isLoading,
  } = useQuery<Stats>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await api.get("/admin/stats");
      return res.data;
    },
  });

  const { data: activity = [], isLoading: loadingActivity } = useQuery<
    Activity[]
  >({
    queryKey: ["adminActivity"],
    queryFn: async () => {
      const res = await api.get("/admin/activity");
      return res.data;
    },
  });
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Painel Administrativo
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            title="Total Captado"
            icon={<LayoutDashboard className="text-indigo-600" />}
          >
            {formatBRL(stats?.totalInvestments || 0)}
          </Card>

          <Card
            title="Assessores Ativos"
            icon={<Users className="text-green-600" />}
          >
            {stats?.activeAdvisors}
          </Card>

          <Card
            title="Reservas Pendentes"
            icon={<FileText className="text-yellow-600" />}
          >
            {stats?.pendingReservations}
          </Card>

          <Card
            title="Assinaturas Pendentes"
            icon={<AlertTriangle className="text-orange-600" />}
          >
            {stats?.pendingSignatures}
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Atividade Recente
          </h2>
          <div className="space-y-4">
            {loadingActivity ? (
              <div className="p-4">Carregando atividades recentes...</div>
            ) : (
              activity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.type === "RESERVATION"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {activity.type === "RESERVATION"
                          ? "Nova Reserva"
                          : "Assinatura Pendente"}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-900">
                      <span className="font-medium">{activity.advisor}</span>{" "}
                      reservou {formatBRL(activity.amount)} em{" "}
                      <span className="font-medium">{activity.investment}</span>{" "}
                      para {activity.investor}
                    </p>
                  </div>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    Ver detalhes
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Captação por Tipo de Investimento
            </h2>
            {/* Add chart component here */}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Performance dos Assessores
            </h2>
            {/* Add chart component here */}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <span className="text-2xl font-bold text-gray-900">{children}</span>
    </div>
  );
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
