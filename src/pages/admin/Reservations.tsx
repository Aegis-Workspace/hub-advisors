import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download } from 'lucide-react';
import type { Reservation } from '../../types';
import api from '../../lib/api.lib';
export function AdminReservations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Reservation['status'] | ''>('');

  const { data: reservations = [], isLoading } = useQuery<Reservation[]>({
    queryKey: ['investments'],
    queryFn: async () => {
      const res = await api.get('/admin/reservas');
      return res.data;
    }
  });
  const filteredReservations = reservations?.filter((r) => {
    const matchesSearch =
      r.investment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.investorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? r.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Controle de Reservas</h1>
            <p className="mt-1 text-sm text-gray-500">Acompanhe e gerencie as reservas de investimentos</p>
          </div>
          <button
            className="bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar reservas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Reservation['status'] | '')}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Todos os Status</option>
              <option value="PENDING_SIGNATURE">Aguardando Assinatura</option>
              <option value="SIGNED">Assinado</option>
              <option value="CONFIRMED">Confirmado</option>
            </select>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investidor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    Nenhuma reserva encontrada.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{r.investment?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{r.user?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{r.investorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">R$ {r.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{r.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-indigo-600 hover:text-indigo-900">Detalhes</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
