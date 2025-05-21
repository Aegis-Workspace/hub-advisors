import React, { useState } from 'react';
import { X, Plus, Search } from 'lucide-react';
import type {  User } from '../types';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api.lib';
import { useAuth } from '../contexts/AuthContext';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (investor: User, amount: number, investmentId: number,investorId: number) => void;
  investmentId:number
  amount: number;
}


export function ReservationModal({ isOpen, onClose, onConfirm, amount,investmentId  }: ReservationModalProps) {
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvestor, setSelectedInvestor] = useState<User | null>(null);
  const [newInvestor, setNewInvestor] = useState<Partial<User> | null>(null);
  const {usuario} = useAuth()
  const { data: investors = [], isLoading } = useQuery<User[]>({
    queryKey: ['investments'],
    queryFn: async () => {
      const res = await api.get('/investors');
      return res.data;
    }
  });
  if (!isOpen) return null;

  const filteredInvestors = investors.filter(investor =>
    investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.cpf?.includes(searchTerm)
  );

  const handleConfirm = async () => {
    if (mode === 'select' && selectedInvestor) {
      onConfirm(selectedInvestor, amount, investmentId, selectedInvestor.id);
      onClose();
    } else if (mode === 'create' && isValidNewInvestor()) {
      try {
        const response = await api.post('/register', {
          ...newInvestor,
          parentId:usuario?.id,
          password: 'defaultPassword123', // defina uma senha padrão ou lógica para isso
          role: 'cliente', // ajuste conforme necessário
        });
        console.log(response);
        
        if (response.data.id) {
          onConfirm(newInvestor as User,amount, investmentId, response.data.id);
          onClose();
        } else {
          alert(response.data.message || 'Erro ao criar investidor');
        }
      } catch (error) {
        alert('Erro ao conectar com o servidor');
      }
    }
  };

  const isValidNewInvestor = () => {
    // Add validation logic here
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Reservar Cotas</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Valor da reserva:{' '}
            <span className="font-medium text-gray-900">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(amount)}
            </span>
          </p>
        </div>

        <div className="p-6">
          {/* Mode Selection */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setMode('select')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                mode === 'select'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Selecionar Investidor
            </button>
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                mode === 'create'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Novo Investidor
            </button>
          </div>

          {mode === 'select' ? (
            <>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Investors List */}
              <div className="space-y-4">
                {filteredInvestors.map((investor) => (
                  <div
                    key={investor.id}
                    onClick={() => setSelectedInvestor(investor)}
                    className={`p-4 rounded-lg border-2 cursor-pointer ${
                      selectedInvestor?.id === investor.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-600'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{investor.name}</h3>
                        <p className="text-sm text-gray-500">{investor.email}</p>
                        <p className="text-sm text-gray-500">CPF: {investor.cpf}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* New Investor Form */
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={newInvestor?.name || ''}
                    onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newInvestor?.email || ''}
                    onChange={(e) => setNewInvestor({ ...newInvestor, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={newInvestor?.cpf || ''}
                    onChange={(e) => setNewInvestor({ ...newInvestor, cpf: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RG
                  </label>
                  <input
                    type="text"
                    value={newInvestor?.rg || ''}
                    onChange={(e) => setNewInvestor({ ...newInvestor, rg: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
    <h4 className="font-medium text-gray-900 mb-2">Endereço</h4>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logradouro
        </label>
        <input
          type="text"
          value={newInvestor?.address?.street || ''}
          onChange={(e) =>
            setNewInvestor({
              ...newInvestor,
              address: { ...newInvestor?.address, street: e.target.value }
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          N° da residência
        </label>
        <input
          type="text"
          value={newInvestor?.address?.number || ''}
          onChange={(e) =>
            setNewInvestor({
              ...newInvestor,
              address: { ...newInvestor?.address, number: e.target.value }
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Complemento
        </label>
        <input
          type="text"
          value={newInvestor?.address?.complement || ''}
          onChange={(e) =>
            setNewInvestor({
              ...newInvestor,
              address: { ...newInvestor?.address, complement: e.target.value }
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </div>
  </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Dados Bancários</h4>
                <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
        <input
          type="text"
          value={newInvestor?.bankAccount?.bank || ''}
          onChange={(e) =>
            setNewInvestor({
              ...newInvestor,
              bankAccount: { ...newInvestor?.bankAccount, bank: e.target.value }
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conta Corrente</label>
        <input
          type="text"
          value={newInvestor?.bankAccount?.account || ''}
          onChange={(e) =>
            setNewInvestor({
              ...newInvestor,
              bankAccount: { ...newInvestor?.bankAccount, account: e.target.value }
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Agência</label>
        <input
          type="text"
          value={newInvestor?.bankAccount?.agency || ''}
          onChange={(e) =>
            setNewInvestor({
              ...newInvestor,
              bankAccount: { ...newInvestor?.bankAccount, agency: e.target.value }
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dígito</label>
        <input
          type="text"
          value={newInvestor?.bankAccount?.digit || ''}
          onChange={(e) =>
            setNewInvestor({
              ...newInvestor,
              bankAccount: { ...newInvestor?.bankAccount, digit: e.target.value }
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pix</label>
        <input
          type="text"
          value={newInvestor?.bankAccount?.pix || ''}
          onChange={(e) =>
            setNewInvestor({
              ...newInvestor,
              bankAccount: { ...newInvestor?.bankAccount, pix: e.target.value }
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleConfirm}
            disabled={mode === 'select' ? !selectedInvestor : !isValidNewInvestor()}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
}