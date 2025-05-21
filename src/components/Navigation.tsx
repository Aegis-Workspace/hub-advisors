import { useRef, useEffect, useState } from "react";
import { LayoutDashboard, Briefcase, Users, PiggyBank } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mercado", href: "/market", icon: Briefcase },
  { name: "Investidores", href: "/investors", icon: Users },
  { name: "Carteira", href: "/portfolio", icon: PiggyBank },
];

export function Navigation() {
  const location = useLocation();
  const [barTop, setBarTop] = useState(0);
  const navContainerRef = useRef(null);
  const itemRefs = useRef([]);

  // Atualiza a posição da barrinha quando a rota mudar
  useEffect(() => {
    const activeIndex = navigation.findIndex(
      (item) => item.href === location.pathname
    );
    if (activeIndex !== -1 && itemRefs.current[activeIndex]) {
      const activeEl = itemRefs.current[activeIndex];
      const containerTop = navContainerRef.current.getBoundingClientRect().top;
      const iconTop = activeEl.getBoundingClientRect().top;
      setBarTop(iconTop - containerTop);
    }
  }, [location.pathname]);

  return (
    <nav
      className="bg-black w-32 h-[90%] shadow-sm  ml-16 rounded-2xl fixed"
      ref={navContainerRef}
    >
      <span
        className="absolute left-0 w-[3px] rounded-r bg-white transition-all duration-300"
        style={{ top: barTop + 12, height: "42px" }}
      />

      <div className="flex flex-col items-center justify-between h-full">
        <div className="mt-12 flex items-center flex-col">
          <p className="text-black flex items-center justify-center mb-12 bg-white h-12 w-12 rounded-lg text-2xl font-bold">
            A
          </p>
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`flex items-center px-3 py-5 text-sm font-medium ${
                  isActive
                    ? "text-white"
                    : "text-white/25 hover:border-gray-300"
                }`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>
        <div className="py-12">
          <LuLogOut className="text-xl text-white" />
        </div>
      </div>
    </nav>
  );
}
