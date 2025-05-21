export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      investments: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          type: 'CDB' | 'LCI' | 'LCA' | 'DEBENTURE'
          logo_url: string | null
          image_url: string | null
          min_amount: number
          total_amount: number
          available_amount: number
          reserved_amount: number
          yield_rate: number
          yield_index: 'CDI' | 'IPCA'
          term: number
          guarantee: string
          payment_frequency: 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | null
          risk_level: 'LOW' | 'MODERATE' | 'HIGH' | null
          status: 'DRAFT' | 'OPEN' | 'PAUSED' | 'CLOSED'
          is_visible: boolean
          is_highlighted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          type: 'CDB' | 'LCI' | 'LCA' | 'DEBENTURE'
          logo_url?: string | null
          image_url?: string | null
          min_amount: number
          total_amount: number
          available_amount: number
          reserved_amount?: number
          yield_rate: number
          yield_index: 'CDI' | 'IPCA'
          term: number
          guarantee: string
          payment_frequency?: 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | null
          risk_level?: 'LOW' | 'MODERATE' | 'HIGH' | null
          status?: 'DRAFT' | 'OPEN' | 'PAUSED' | 'CLOSED'
          is_visible?: boolean
          is_highlighted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          type?: 'CDB' | 'LCI' | 'LCA' | 'DEBENTURE'
          logo_url?: string | null
          image_url?: string | null
          min_amount?: number
          total_amount?: number
          available_amount?: number
          reserved_amount?: number
          yield_rate?: number
          yield_index?: 'CDI' | 'IPCA'
          term?: number
          guarantee?: string
          payment_frequency?: 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | null
          risk_level?: 'LOW' | 'MODERATE' | 'HIGH' | null
          status?: 'DRAFT' | 'OPEN' | 'PAUSED' | 'CLOSED'
          is_visible?: boolean
          is_highlighted?: boolean
          updated_at?: string
        }
      }
      advisors: {
        Row: {
          id: string
          auth_id: string
          name: string
          email: string
          total_investments: number
          active_investors: number
          accumulated_commissions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          name: string
          email: string
          total_investments?: number
          active_investors?: number
          accumulated_commissions?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          name?: string
          email?: string
          total_investments?: number
          active_investors?: number
          accumulated_commissions?: number
          updated_at?: string
        }
      }
      investors: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          cpf: string
          rg: string | null
          address: Json | null
          bank_account: Json | null
          advisor_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          cpf: string
          rg?: string | null
          address?: Json | null
          bank_account?: Json | null
          advisor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          cpf?: string
          rg?: string | null
          address?: Json | null
          bank_account?: Json | null
          advisor_id?: string | null
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          investment_id: string
          investor_id: string
          advisor_id: string
          amount: number
          status: 'PENDING_SIGNATURE' | 'SIGNED' | 'CONFIRMED' | 'CANCELLED'
          created_at: string
          signed_at: string | null
          confirmed_at: string | null
        }
        Insert: {
          id?: string
          investment_id: string
          investor_id: string
          advisor_id: string
          amount: number
          status?: 'PENDING_SIGNATURE' | 'SIGNED' | 'CONFIRMED' | 'CANCELLED'
          created_at?: string
          signed_at?: string | null
          confirmed_at?: string | null
        }
        Update: {
          id?: string
          investment_id?: string
          investor_id?: string
          advisor_id?: string
          amount?: number
          status?: 'PENDING_SIGNATURE' | 'SIGNED' | 'CONFIRMED' | 'CANCELLED'
          signed_at?: string | null
          confirmed_at?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          investment_id: string
          name: string
          url: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          investment_id: string
          name: string
          url: string
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          investment_id?: string
          name?: string
          url?: string
          type?: string
        }
      }
      commissions: {
        Row: {
          id: string
          advisor_id: string
          reservation_id: string
          amount: number
          type: 'UPFRONT' | 'RECURRING'
          status: 'PENDING' | 'PAID'
          due_date: string
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          advisor_id: string
          reservation_id: string
          amount: number
          type: 'UPFRONT' | 'RECURRING'
          status?: 'PENDING' | 'PAID'
          due_date: string
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          advisor_id?: string
          reservation_id?: string
          amount?: number
          type?: 'UPFRONT' | 'RECURRING'
          status?: 'PENDING' | 'PAID'
          due_date?: string
          paid_at?: string | null
        }
      }
    }
  }
}