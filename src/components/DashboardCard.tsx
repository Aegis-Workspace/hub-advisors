import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  is_money: boolean;
  iconBg: string;
  iconText: string;
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconText,
  is_money,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg  border  p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div
          className={`w-8 h-8 text-white rounded-lg ${iconBg} flex items-center justify-center shadow-lg`}
        >
          <Icon className={`text-sm w-4 h-4 ${iconText}`} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900">
          {typeof value === "number" && is_money && !title.includes("Investors")
            ? new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value)
            : value}
        </span>
      </div>
    </div>
  );
}
