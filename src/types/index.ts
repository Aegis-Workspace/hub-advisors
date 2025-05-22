export type Role = "admin" | "advisor" | "cliente";
export type UserStatus = "ATIVO" | "INATIVO";

export enum InvestmentType {
  CDB = "CDB",
  LCI = "LCI",
  LCA = "LCA",
  DEBENTURE = "DEBENTURE",
}

export type YieldIndex = "CDI" | "IPCA";

export enum PaymentFrequency {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
}

export type RiskLevel = "LOW" | "MODERATE" | "HIGH";

export type InvestmentStatus = "OPEN" | "CLOSED" | "RESERVED" | "DRAFT";

export type ReservationStatus = "PENDING_SIGNATURE" | "SIGNED" | "CONFIRMED";

export type CommissionPaymentTiming = "ON_CONFIRMATION" | "MONTHLY";

export interface Address {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface BankAccount {
  bank?: string;
  account?: string; // Conta Corrente
  agency?: string; // Agência
  digit?: string; // Dígito
  pix?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
  status: UserStatus;
  cpf?: string;
  rg?: string;
  address?: Address;
  bankAccount?: BankAccount;
  createdAt: string; // ISO string
  totalRaised?: number;
  totalCommission?: number;
  activeInvestors?: [number];
  reservations?: Reservation[];
  investments?: Investment[];
}

export interface Investment {
  id: number;
  name: string;
  description: string;
  category?: string | null;
  type: InvestmentType;
  yieldRate?: number | null;
  yieldIndex?: YieldIndex | null;
  minAmount: number;
  totalAmount?: number | null;
  availableAmount?: number | null;
  reservedAmount?: number | null;
  term?: number | null;
  guarantee: any;
  paymentFrequency?: PaymentFrequency | null;
  registeredWith: string[];
  riskLevel?: RiskLevel | null;
  logo?: string | null;
  status: InvestmentStatus;
  image: string;
  news?: News[];
  schedule?: Schedule[];
  documents?: Document[];
  createdAt: Date;
  autoCloseDate?: Date;
  reservations?: Reservation[];
  yieldAdjustment?: YieldAdjustment | null;
  commission?: Commission | null;
}

export interface YieldAdjustment {
  id: number;
  enabled: boolean;
  minRate: number;
  maxRate: number;
  investmentId: number;
}

export interface Commission {
  id: number;
  investmentId: number;
  upfrontRate: number;
  upfrontPayment: CommissionPaymentTiming;
  recurringRate: number;
  recurringFrequency: PaymentFrequency;
  yieldAdjustment?: {
    minRate: number;
    maxRate: number;
  } | null;
  amount: number;
  status: "PENDING" | "PAID";
  dueDate: string;
  paidDate?: string;
}

export interface News {
  id: number;
  investmentId: number;
  date: string;
  title: string;
  content: string;
}

export interface Schedule {
  id: number;
  investmentId: number;
  date: string;
  principal: number;
  interest: number;
}

export interface Document {
  id: number;
  investmentId: number;
  name: string;
  url: string;
}

export interface Reservation {
  id: number;
  investmentId: number;
  userId: number;
  investorName: string;
  amount: number;
  status: ReservationStatus;
  createdAt: string;
  signedAt?: string | null;
  confirmedAt?: string | null;
  investment?: Investment;
  user?: User;
}

export interface Advisor {
  nextDividends: {
    date: string;
    amount: number;
    investment: string;
  }[];
}

export interface Notification {
  id: number;
  type: "NEW_OPPORTUNITY" | "RESERVATION_STATUS" | "DIVIDEND_PAYMENT";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AdvisorCommission {
  upfront: {
    rate: number;
    minValue?: number;
    maxValue?: number;
  };
  recurring: {
    rate: number;
    frequency: PaymentFrequency;
  };
  yieldAdjustment: {
    minRate: number;
    maxRate: number;
  };
}
