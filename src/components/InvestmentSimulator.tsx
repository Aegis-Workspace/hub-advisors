import { useState } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
} from "lucide-react";
import { jsPDF } from "jspdf";
import type { Investment, User, Commission } from "../types";
import { ReservationModal } from "./ReservationModal";

interface InvestmentSimulatorProps {
  investment: Investment;
  commission: Commission | null | undefined;
  onReserve: (
    investor: User,
    amount: number,
    investmentId: number,
    investorId: number
  ) => void;
}

export function InvestmentSimulator({
  investment,
  commission,
  onReserve,
}: InvestmentSimulatorProps) {
  const [amount, setAmount] = useState(investment.minAmount);
  const [adjustedRate, setAdjustedRate] = useState<number>(
    investment?.yieldRate ?? 17
  );
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [riskProfile, setRiskProfile] = useState<
    "conservative" | "moderate" | "aggressive"
  >("moderate");

  const calculateReturn = () => {
    const rateMap = {
      conservative: adjustedRate * 0.8,
      moderate: adjustedRate,
      aggressive: adjustedRate * 1.2,
    };

    const monthlyRate = rateMap[riskProfile] / 100 / 12;
    const months = investment.term ?? 0;
    const futureValue = amount * Math.pow(1 + monthlyRate, months);
    const totalReturn = futureValue - amount;
    return totalReturn;
  };

  const calculateSchedule = () => {
    const schedule = [];
    const monthlyRate = adjustedRate / 100 / 12;
    const monthlyPayment =
      (amount *
        (monthlyRate * Math.pow(1 + monthlyRate, investment.term ?? 0))) /
      (Math.pow(1 + monthlyRate, investment.term ?? 0) - 1);

    let remainingBalance = amount;

    for (let month = 1; month <= (investment.term ?? 0); month++) {
      const interest = remainingBalance * monthlyRate;
      const principal = monthlyPayment - interest;
      remainingBalance -= principal;
      const advisorCommission = interest * 0.2;

      const date = new Date();
      date.setMonth(date.getMonth() + month);

      schedule.push({
        date: date.toISOString().split("T")[0],
        principal,
        interest,
        advisorCommission,
      });
    }

    return schedule;
  };

  const calculateCommission = () => {
    const upfrontCommission = amount * ((commission?.upfrontRate ?? 0) / 100);
    const schedule = calculateSchedule();
    const totalRecurringCommission = schedule.reduce(
      (sum, payment) => sum + payment.advisorCommission,
      0
    );

    return {
      upfront: upfrontCommission,
      recurring: totalRecurringCommission / (investment.term ?? 0),
      total: upfrontCommission + totalRecurringCommission,
    };
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Simulação de Investimento", 20, 20);

    // Investment Details
    doc.setFontSize(12);
    doc.text(`Investimento: ${investment.name}`, 20, 40);
    doc.text(`Valor Investido: R$ ${amount.toLocaleString("pt-BR")}`, 20, 50);
    doc.text(
      `Perfil de Risco: ${
        riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)
      }`,
      20,
      60
    );
    doc.text(`Prazo: ${investment.term} meses`, 20, 70);

    // Return Calculation
    const totalReturn = calculateReturn();
    doc.text("Retorno Estimado:", 20, 90);
    doc.setTextColor(0, 128, 0);
    doc.text(`R$ ${totalReturn.toLocaleString("pt-BR")}`, 20, 100);

    // Save the PDF
    doc.save(`simulacao-${investment.name.toLowerCase()}.pdf`);
  };

  const commissionValues = calculateCommission();

  return (
    <div className="shadow-lg border rounded-xl p-12">
      <h3 className="text-xl font-bold text-gray-900 mb-8">Simulador</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-md font-semibold text-gray-900 mb-3">
            Qual valor você gostaria de investir?
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              R$
            </span>
            <input
              type="number"
              min={investment.minAmount}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full pl-12 pr-4 py-3 text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Payment Schedule */}
          <div className="mt-3 flex items-center text-gray-600 mb-8">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Receba em <span className="font-medium">3x</span> até{" "}
              <span className="font-medium">
                {new Date(
                  Date.now() + (investment.term ?? 0) * 30 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("pt-BR")}
              </span>
            </span>
          </div>
        </div>

        {/* Return Preview */}
        <div className="shadow-md border rounded-xl p-6">
          <div className="mb-4">
            <h4 className="text-gray-600 mb-2">Previsão de retorno:</h4>
            <div className="flex items-center gap-3 mt-5">
              <div className="h-8 w-8 bg-green-600/20 flex items-center justify-center rounded-lg shadow-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(amount + calculateReturn())}
              </span>
            </div>
          </div>

          <h4 className="text-gray-600 mb-3">Rendimentos:</h4>

          {/* Return Comparison */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Esta oportunidade</span>
              <div className="flex items-center">
                <div className="w-48 h-2 bg-gradient-to-r from-blue-500 to-indigo-100 rounded-full mr-2" />
                <span className="text-blue-500 font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(calculateReturn())}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Índice CDI</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full mr-2" />
                <span className="text-gray-600 font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(calculateReturn() * 0.7)}
                </span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 text-xs text-gray-500">
            <p>
              Índice CDI utilizado: {investment.yieldRate}% | Fonte: Banco
              Central
            </p>
            <p>
              Os valores mencionados acima são previsões, e podem variar
              conforme desempenho dos ativos.
            </p>
          </div>
        </div>
        {/* Commission Preview */}
        <div className="mt-6 shadow-md border rounded-xl p-6">
          <h4 className="text-gray-700 font-medium mb-4">Sua Remuneração</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Comissão Inicial</span>
              <span className="font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(commissionValues.upfront)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Repasse Mensal</span>
              <span className="font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(commissionValues.recurring)}
              </span>
            </div>
            <div className="pt-3 border-t border-indigo-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">
                  Total Estimado
                </span>
                <span className="font-bold ">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(commissionValues.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="mt-6 p-6">
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-medium">
              {showSchedule
                ? "Ocultar Cronograma"
                : "Ver Cronograma de Pagamentos"}
            </span>
          </button>

          {showSchedule && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Data
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                      Principal
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                      Juros
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                      Comissão
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {calculateSchedule().map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(payment.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(payment.principal)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(payment.interest)}
                      </td>
                      <td className="px-4 py-2 text-sm text-blue-500 font-medium text-right">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(payment.advisorCommission)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={generatePDF}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center font-medium shadow-sm  active:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </button>
          <button
            onClick={() => setShowReservationModal(true)}
            className="flex-1 bg-green-600/10 px-6 py-3 rounded-xl text-green-600 border-green-500/40 border transition-colors flex items-center justify-center font-medium active:scale-105 shadow-sm"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Reservar Cota
          </button>
        </div>

        <ReservationModal
          isOpen={showReservationModal}
          onClose={() => setShowReservationModal(false)}
          onConfirm={(investor, amount, investorId) =>
            onReserve(investor, amount, investment.id, investorId)
          }
          amount={amount}
          investmentId={investment.id}
        />
      </div>
    </div>
  );
}
