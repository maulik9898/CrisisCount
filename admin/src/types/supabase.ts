export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attendance: {
        Row: {
          employee_id: number
          event_id: number
          id: number
          location_id: number
          timestamp: string
        }
        Insert: {
          employee_id: number
          event_id: number
          id?: number
          location_id: number
          timestamp?: string
        }
        Update: {
          employee_id?: number
          event_id?: number
          id?: number
          location_id?: number
          timestamp?: string
        }
      }
      employees: {
        Row: {
          employee_type: string
          id: number
          name: string
        }
        Insert: {
          employee_type?: string
          id: number
          name: string
        }
        Update: {
          employee_type?: string
          id?: number
          name?: string
        }
      }
      events: {
        Row: {
          end_time: string | null
          id: number
          is_active: boolean
          start_time: string
          total: number
        }
        Insert: {
          end_time?: string | null
          id?: number
          is_active?: boolean
          start_time?: string
          total?: number
        }
        Update: {
          end_time?: string | null
          id?: number
          is_active?: boolean
          start_time?: string
          total?: number
        }
      }
      location: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_total_employees: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      delete_event: {
        Args: {
          event: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
