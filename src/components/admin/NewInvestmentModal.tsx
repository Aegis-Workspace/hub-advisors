import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { InvestmentType, PaymentFrequency, type Investment } from "../../types";
import api from "../../lib/api.lib";

interface ValidationErrors {
  name?: string;
  category?: string;
  description?: string;
  type?: string;
  term?: string;
  yield?: string;
  minAmount?: string;
  totalAmount?: string;
  guarantee?: string;
  riskLevel?: string;
}

interface NewInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (investment: Partial<Investment>) => void;
}

type DocumentItem = {
  name: string;
  description: string;
  file?: File | null;
};

export function NewInvestmentModal({
  isOpen,
  onClose,
  onSubmit,
}: NewInvestmentModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      name: "Contrato de Investimento",
      description: "PDF ou DOC contendo o contrato completo",
      file: null,
    },
    {
      name: "Balanço Patrimonial",
      description: "PDF do balanço patrimonial da empresa",
      file: null,
    },
    {
      name: "DRE",
      description: "PDF ou Excel com demonstrativos financeiros",
      file: null,
    },
    {
      name: "Prospecto",
      description: "PDF com o prospecto detalhado do ativo",
      file: null,
    },
  ]);
  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const file = event.target.files?.[0] ?? null;

    setDocuments((prevDocs) => {
      const newDocs = [...prevDocs];
      newDocs[index] = { ...newDocs[index], file };
      return newDocs;
    });
  }
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    image: "",
    category: "",
    riskLevel: "",
    description: "",
    type: InvestmentType.CDB,
    term: 12,
    yield: {
      rate: 17,
      index: "CDI",
    },
    yieldAdjustment: {
      enabled: false,
      minRate: 15,
      maxRate: 18,
    },
    paymentFrequency: PaymentFrequency.MONTHLY,
    minAmount: 5000,
    totalAmount: 1500000,
    status: "DRAFT",
    isVisible: false,
    isHighlighted: false,
    notifyAdvisors: true,
    autoCloseDate: "",

    // Advisor Commission
    commission: {
      upfront: {
        rate: 3,
        payment: "ON_INVESTMENT",
      },
      recurring: {
        rate: 1,
        frequency: "MONTHLY",
      },
    },

    // Guarantees
    guarantee: {
      type: "REAL",
      description: "",
      registrations: [] as string[],
    },

    // Documents
    documents: [] as File[],
  });

  if (!isOpen) return null;

  const handleInputChange = (
    field: string,
    value: string | number | boolean | object
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = "Nome é obrigatório";
          isValid = false;
        }
        if (!formData.category) {
          newErrors.category = "Categoria é obrigatória";
          isValid = false;
        }
        if (!formData.description.trim()) {
          newErrors.description = "Descrição é obrigatória";
          isValid = false;
        }
        if (formData.term <= 0) {
          newErrors.term = "Prazo deve ser maior que zero";
          isValid = false;
        }
        if (formData.minAmount <= 0) {
          newErrors.minAmount = "Valor mínimo deve ser maior que zero";
          isValid = false;
        }
        if (formData.totalAmount <= 0) {
          newErrors.totalAmount = "Valor total deve ser maior que zero";
          isValid = false;
        }
        if (formData.totalAmount < formData.minAmount) {
          newErrors.totalAmount =
            "Valor total deve ser maior que o valor mínimo";
          isValid = false;
        }
        break;

      case 3:
        if (!formData.guarantee.type) {
          newErrors.guarantee = "Tipo de garantia é obrigatório";
          isValid = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("term", String(formData.term));
      formDataToSend.append("paymentFrequency", formData.paymentFrequency);
      formDataToSend.append("minAmount", String(formData.minAmount));
      formDataToSend.append("totalAmount", String(formData.totalAmount));
      formDataToSend.append("status", formData.status);
      formDataToSend.append("isVisible", String(formData.isVisible));
      formDataToSend.append("isHighlighted", String(formData.isHighlighted));
      formDataToSend.append("notifyAdvisors", String(formData.notifyAdvisors));
      formDataToSend.append("autoCloseDate", formData.autoCloseDate || "");

      // Yield
      formDataToSend.append("yieldRate", String(formData.yield.rate));
      formDataToSend.append("yieldIndex", formData.yield.index);

      // Yield Adjustment
      formDataToSend.append(
        "yieldAdjustment",
        JSON.stringify(formData.yieldAdjustment)
      );

      // Commission
      formDataToSend.append("commission", JSON.stringify(formData.commission));

      // Guarantee
      formDataToSend.append("guarantee", JSON.stringify(formData.guarantee));

      // Imagens
      formDataToSend.append("logo", formData.logo);
      formDataToSend.append("image", formData.image);

      // Documentos
      documents.forEach((document) => {
        if (document.file) {
          formDataToSend.append(`documents`, document.file);
          formDataToSend.append(`documentNames`, document.name);
        }
      });

      await api.post("/investments", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar dados");
    } finally {
      setSubmitting(false);
    }
  };
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Informações Gerais da Oferta
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo da Empresa
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => handleInputChange("logo", e.target.value)}
                    placeholder="URL da logo (ex: https://...)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {formData.logo && (
                    <img
                      src={formData.logo}
                      alt="Logo preview"
                      className="w-10 h-10 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${formData.name}&background=fff&color=000&size=48`;
                      }}
                    />
                  )}
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem de Capa
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="URL da imagem (ex: https://...)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Cover preview"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Empresa/Ativo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.category ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="CREDITO_CORPORATIVO">
                      Crédito Corporativo
                    </option>
                    <option value="IMOBILIARIO">Imobiliário</option>
                    <option value="ENERGIA">Energia</option>
                    <option value="INFRAESTRUTURA">Infraestrutura</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Risco
                  </label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) =>
                      handleInputChange("riskLevel", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.riskLevel ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="" disabled>
                      Selecione uma categoria
                    </option>
                    <option value="CREDITO_CORPORATIVO">LOW</option>
                    <option value="IMOBILIARIO">MODERATE</option>
                    <option value="ENERGIA">HIGH</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do Ativo
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Investimento
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.type ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  {Object.values(InvestmentType).map((type) => (
                    <option key={type} value={type}>
                      {type === "DEBENTURE" ? "Debênture" : type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo (meses)
                </label>
                <input
                  type="number"
                  value={formData.term}
                  onChange={(e) =>
                    handleInputChange("term", Number(e.target.value))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.term ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.term && (
                  <p className="mt-1 text-sm text-red-600">{errors.term}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rentabilidade Base (% ao ano)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.yield.rate}
                  onChange={(e) =>
                    handleInputChange("yield", {
                      ...formData.yield,
                      rate: Number(e.target.value),
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.yield ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.yield && (
                  <p className="mt-1 text-sm text-red-600">{errors.yield}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Indexador
                </label>
                <select
                  value={formData.yield.index}
                  onChange={(e) =>
                    handleInputChange("yield", {
                      ...formData.yield,
                      index: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="CDI">CDI</option>
                  <option value="IPCA">IPCA</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.yieldAdjustment.enabled}
                  onChange={(e) =>
                    handleInputChange("yieldAdjustment", {
                      ...formData.yieldAdjustment,
                      enabled: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Permitir ajuste de rentabilidade pelo assessor
                </span>
              </label>

              {formData.yieldAdjustment.enabled && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taxa Mínima (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.yieldAdjustment.minRate}
                      onChange={(e) =>
                        handleInputChange("yieldAdjustment", {
                          ...formData.yieldAdjustment,
                          minRate: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taxa Máxima (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.yieldAdjustment.maxRate}
                      onChange={(e) =>
                        handleInputChange("yieldAdjustment", {
                          ...formData.yieldAdjustment,
                          maxRate: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Mínimo
                </label>
                <input
                  type="number"
                  step="1000"
                  value={formData.minAmount}
                  onChange={(e) =>
                    handleInputChange("minAmount", Number(e.target.value))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.minAmount ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.minAmount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.minAmount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Total da Captação
                </label>
                <input
                  type="number"
                  step="100000"
                  value={formData.totalAmount}
                  onChange={(e) =>
                    handleInputChange("totalAmount", Number(e.target.value))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.totalAmount ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.totalAmount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.totalAmount}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Condições da Remuneração do Assessor
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comissão Inicial (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.commission.upfront.rate}
                  onChange={(e) =>
                    handleInputChange("commission", {
                      ...formData.commission,
                      upfront: {
                        ...formData.commission.upfront,
                        rate: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forma de Pagamento
                </label>
                <select
                  value={formData.commission.upfront.payment}
                  onChange={(e) =>
                    handleInputChange("commission", {
                      ...formData.commission,
                      upfront: {
                        ...formData.commission.upfront,
                        payment: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="ON_INVESTMENT">
                    No momento do investimento
                  </option>
                  <option value="ON_CONFIRMATION">
                    Na confirmação do aporte
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comissão Recorrente (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.commission.recurring.rate}
                  onChange={(e) =>
                    handleInputChange("commission", {
                      ...formData.commission,
                      recurring: {
                        ...formData.commission.recurring,
                        rate: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequência
                </label>
                <select
                  value={formData.commission.recurring.frequency}
                  onChange={(e) =>
                    handleInputChange("commission", {
                      ...formData.commission,
                      recurring: {
                        ...formData.commission.recurring,
                        frequency: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="MONTHLY">Mensal</option>
                  <option value="QUARTERLY">Trimestral</option>
                  <option value="SEMIANNUAL">Semestral</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Garantias da Operação
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Garantia
              </label>
              <select
                value={formData.guarantee.type}
                onChange={(e) =>
                  handleInputChange("guarantee", {
                    ...formData.guarantee,
                    type: e.target.value,
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.guarantee ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="REAL">Garantia Real</option>
                <option value="FIDC">FIDC</option>
                <option value="DUPLICATAS">Duplicatas</option>
                <option value="ALIENACAO">Alienação Fiduciária</option>
                <option value="NONE">Sem Garantia</option>
              </select>
              {errors.guarantee && (
                <p className="mt-1 text-sm text-red-600">{errors.guarantee}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detalhamento das Garantias
              </label>
              <textarea
                value={formData.guarantee.description}
                onChange={(e) =>
                  handleInputChange("guarantee", {
                    ...formData.guarantee,
                    description: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registros da Operação
              </label>
              <div className="space-y-2">
                {["SPC", "CVM", "ANBIMA", "CARTORIO"].map((reg) => (
                  <label key={reg} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.guarantee.registrations.includes(reg)}
                      onChange={(e) => {
                        const newRegs = e.target.checked
                          ? [...formData.guarantee.registrations, reg]
                          : formData.guarantee.registrations.filter(
                              (r) => r !== reg
                            );
                        handleInputChange("guarantee", {
                          ...formData.guarantee,
                          registrations: newRegs,
                        });
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{reg}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Documentação Obrigatória
            </h3>

            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-gray-500">{doc.description}</p>
                    </div>
                    <div>
                      <label className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 cursor-pointer">
                        Upload
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, index)}
                        />
                      </label>
                    </div>
                  </div>
                  {doc.file && (
                    <p className="text-xs text-green-600">
                      Arquivo selecionado: {doc.file.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Visibilidade e Status da Oferta
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status da Oferta
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="PAUSED">Pausada</option>
                <option value="DRAFT">Rascunho</option>
                <option value="OPEN">Em Captação</option>
                <option value="RESERVED">Reservado</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) =>
                    handleInputChange("isVisible", e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Disponibilizar para assessores
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isHighlighted}
                  onChange={(e) =>
                    handleInputChange("isHighlighted", e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Destacar no mercado
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Encerramento Automático
              </label>
              <input
                type="date"
                value={formData.autoCloseDate}
                onChange={(e) =>
                  handleInputChange("autoCloseDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    Importante
                  </h4>
                  <p className="mt-1 text-sm text-yellow-700">
                    Ao publicar esta oferta, ela ficará visível para todos os
                    assessores selecionados. Certifique-se de que todas as
                    informações e documentos estão corretos antes de prosseguir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-scroll">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Novo Investimento
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 overflow-y-auto">{renderStep()}</div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Voltar
              </button>
            )}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              {currentStep < 5 ? (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Salvando..." : "Publicar Oferta"}
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
