import { useState } from "react";
import { X } from "lucide-react";

interface CreateAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export function CreateAdvisorModal({ isOpen, onClose, onCreate }: CreateAdvisorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    rg: "",
    password: "",
    role: "advisor",
    status: "ATIVO",
    address: { street: "", number: "", city: "", state: "" },
    bankAccount: { bank: "", agency: "", account: "" },
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section: string, key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Novo Assessor</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campos básicos */}
          <input placeholder="Nome" required value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="Email" required type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="Telefone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="CPF" value={formData.cpf} onChange={(e) => handleChange("cpf", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="RG" value={formData.rg} onChange={(e) => handleChange("rg", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="Senha" required type="password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />

          <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
            <option value="SUSPENSO">Suspenso</option>
          </select>

          {/* Endereço */}
          <input placeholder="Rua" value={formData.address.street} onChange={(e) => handleNestedChange("address", "street", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="Número" value={formData.address.number} onChange={(e) => handleNestedChange("address", "number", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="Cidade" value={formData.address.city} onChange={(e) => handleNestedChange("address", "city", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="Estado" value={formData.address.state} onChange={(e) => handleNestedChange("address", "state", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />

          {/* Conta Bancária */}
          <input placeholder="Banco" value={formData.bankAccount.bank} onChange={(e) => handleNestedChange("bankAccount", "bank", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="Agência" value={formData.bankAccount.agency} onChange={(e) => handleNestedChange("bankAccount", "agency", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="Conta" value={formData.bankAccount.account} onChange={(e) => handleNestedChange("bankAccount", "account", e.target.value)} className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500" />

          {/* Botão de envio */}
          <div className="col-span-full flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Criar Assessor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
