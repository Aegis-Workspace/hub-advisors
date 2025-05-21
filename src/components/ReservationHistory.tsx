import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import type { Reservation } from "../types";

interface ReservationHistoryProps {
  reservations: Reservation[];
}

export function ReservationHistory({ reservations }: ReservationHistoryProps) {
  console.log(reservations);

  const getStatusIcon = (status: Reservation["status"]) => {
    switch (status) {
      case "PENDING_SIGNATURE":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "SIGNED":
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case "CONFIRMED":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: Reservation["status"]) => {
    switch (status) {
      case "PENDING_SIGNATURE":
        return "Aguardando Assinatura";
      case "SIGNED":
        return "Assinado";
      case "CONFIRMED":
        return "Confirmado";
      default:
        return "Status Desconhecido";
    }
  };

  return (
    <div className="shadow-lg border rounded-lg p-12">
      <h3 className="text-xl font-bold text-gray-900 mb-8">
        Histórico de Reservas
      </h3>
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">
                {reservation.investorName}
              </p>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(reservation.amount)}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(reservation.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(reservation.status)}
              <span className="text-sm font-medium text-gray-700">
                {getStatusText(reservation.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
