import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Market } from "./pages/Market";
import { InvestmentDetails } from "./pages/InvestmentDetails";
import { Navigation } from "./components/Navigation";
import { AdminNavigation } from "./components/admin/AdminNavigation";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminInvestments } from "./pages/admin/Investments";
import { AdminAdvisors } from "./pages/admin/Advisors";
import { AdminReservations } from "./pages/admin/Reservations";
import { Investors } from "./pages/Investors";
import { Portfolio } from "./pages/Portfolio";
import PrivateRoute from "./components/PrivateRoute";

// Layout para usuários autenticados
function ProtectedLayout() {
  return (
    <section className="flex bg-white h-screen items-center">
      <Navigation />
      <div className="bg-white w-screen h-[90%] ">
        <Outlet />
      </div>
    </section>
  );
}

// Layout para administradores
function AdminProtectedLayout() {
  return (
    <>
      <AdminNavigation />
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirecionamento inicial */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas de usuários comuns */}
        <Route
          element={
            <PrivateRoute>
              <ProtectedLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/market" element={<Market />} />
          <Route path="/market/:id" element={<InvestmentDetails />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Route>

        {/* Rotas protegidas de administradores */}
        <Route
          element={
            <PrivateRoute role="admin">
              <AdminProtectedLayout />
            </PrivateRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/investments" element={<AdminInvestments />} />
          <Route path="/admin/advisors" element={<AdminAdvisors />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
