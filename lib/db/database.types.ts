export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "student" | "teacher" | "admin" | "parent"
          avatar_url: string | null
          created_at: string
          updated_at: string
          last_login: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: "student" | "teacher" | "admin" | "parent"
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "student" | "teacher" | "admin" | "parent"
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          code: string
          county: string | null
          sub_county: string | null
          type: "primary" | "secondary" | "mixed"
          contact_email: string | null
          contact_phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          county?: string | null
          sub_county?: string | null
          type?: "primary" | "secondary" | "mixed"
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          county?: string | null
          sub_county?: string | null
          type?: "primary" | "secondary" | "mixed"
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      curriculum_learning_areas: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          grade_levels: number[]
          color_code: string
          icon: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          grade_levels?: number[]
          color_code?: string
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string | null
          grade_levels?: number[]
          color_code?: string
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      curriculum_strands: {
        Row: {
          id: string
          learning_area_id: string
          name: string
          code: string
          description: string | null
          grade_levels: number[]
          sequence_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          learning_area_id: string
          name: string
          code: string
          description?: string | null
          grade_levels?: number[]
          sequence_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          learning_area_id?: string
          name?: string
          code?: string
          description?: string | null
          grade_levels?: number[]
          sequence_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      curriculum_outcomes: {
        Row: {
          id: string
          sub_strand_id: string
          grade_level: number
          outcome_text: string
          outcome_code: string | null
          learning_indicators: string[]
          suggested_activities: string[]
          assessment_criteria: string[]
          resources: string[]
          difficulty_level: "easy" | "medium" | "hard"
          estimated_duration_minutes: number
          prerequisites: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sub_strand_id: string
          grade_level: number
          outcome_text: string
          outcome_code?: string | null
          learning_indicators?: string[]
          suggested_activities?: string[]
          assessment_criteria?: string[]
          resources?: string[]
          difficulty_level?: "easy" | "medium" | "hard"
          estimated_duration_minutes?: number
          prerequisites?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sub_strand_id?: string
          grade_level?: number
          outcome_text?: string
          outcome_code?: string | null
          learning_indicators?: string[]
          suggested_activities?: string[]
          assessment_criteria?: string[]
          resources?: string[]
          difficulty_level?: "easy" | "medium" | "hard"
          estimated_duration_minutes?: number
          prerequisites?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      student_progress: {
        Row: {
          id: string
          user_id: string
          learning_area_id: string
          strand_id: string | null
          sub_strand_id: string | null
          outcome_id: string | null
          grade_level: number
          mastery_level: number
          attempts_count: number
          total_time_minutes: number
          last_activity_at: string
          strengths: string[]
          weaknesses: string[]
          recommendations: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          learning_area_id: string
          strand_id?: string | null
          sub_strand_id?: string | null
          outcome_id?: string | null
          grade_level: number
          mastery_level?: number
          attempts_count?: number
          total_time_minutes?: number
          last_activity_at?: string
          strengths?: string[]
          weaknesses?: string[]
          recommendations?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          learning_area_id?: string
          strand_id?: string | null
          sub_strand_id?: string | null
          outcome_id?: string | null
          grade_level?: number
          mastery_level?: number
          attempts_count?: number
          total_time_minutes?: number
          last_activity_at?: string
          strengths?: string[]
          weaknesses?: string[]
          recommendations?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      ai_interactions: {
        Row: {
          id: string
          user_id: string
          session_id: string | null
          interaction_type: "chat" | "tutor" | "assessment" | "feedback" | "content_generation"
          prompt: string
          response: string | null
          context: Json
          learning_area_id: string | null
          strand_id: string | null
          grade_level: number | null
          ai_model: string
          tokens_used: number
          response_time_ms: number | null
          quality_rating: number | null
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string | null
          interaction_type?: "chat" | "tutor" | "assessment" | "feedback" | "content_generation"
          prompt: string
          response?: string | null
          context?: Json
          learning_area_id?: string | null
          strand_id?: string | null
          grade_level?: number | null
          ai_model?: string
          tokens_used?: number
          response_time_ms?: number | null
          quality_rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string | null
          interaction_type?: "chat" | "tutor" | "assessment" | "feedback" | "content_generation"
          prompt?: string
          response?: string | null
          context?: Json
          learning_area_id?: string | null
          strand_id?: string | null
          grade_level?: number | null
          ai_model?: string
          tokens_used?: number
          response_time_ms?: number | null
          quality_rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
