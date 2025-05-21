import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, Users, FileText } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Investimentos", href: "/admin/investments", icon: Briefcase },
  { name: "Assessores", href: "/admin/advisors", icon: Users },
  { name: "Reservas", href: "/admin/reservations", icon: FileText },
];

export function AdminNavigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                  isActive
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
