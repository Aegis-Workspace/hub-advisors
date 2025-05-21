export type Role = 'admin' | 'assessor' | 'client'; // Adapte conforme seus enums reais
export type UserStatus = 'ATIVO' | 'INATIVO';
export type InvestmentStatus = 'ABERTO' | 'FECHADO' | 'ENCERRADO'; // Exemplo
export type ReservationStatus = 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA'; // Exemplo

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  createdAt: string; // ou Date, dependendo da origem dos dados
  reservations: Reservation[];
}

export interface Investment {
  id: number;
  name: string;
  description: string;
  category?: string;
  minAmount: number;
  totalAmount?: number;
  availableAmount?: number;
  yieldRate?: number;
  yieldIndex?: string;
  term?: number;
  profitability?: number;
  status: InvestmentStatus;
  createdAt: string;
  reservations: Reservation[];
}

export interface Reservation {
  id: number;
  investmentId: number;
  userId: number;
  amount: number;
  status: ReservationStatus;
  createdAt: string;
  investment: Investment;
  user: User;
}
