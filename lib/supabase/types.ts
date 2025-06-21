export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: "student" | "teacher" | "admin" | "parent"
          grade_level:
            | "playgroup"
            | "pp1"
            | "pp2"
            | "grade1"
            | "grade2"
            | "grade3"
            | "grade4"
            | "grade5"
            | "grade6"
            | "grade7"
            | "grade8"
            | "grade9"
            | null
          school_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: "student" | "teacher" | "admin" | "parent"
          grade_level?:
            | "playgroup"
            | "pp1"
            | "pp2"
            | "grade1"
            | "grade2"
            | "grade3"
            | "grade4"
            | "grade5"
            | "grade6"
            | "grade7"
            | "grade8"
            | "grade9"
            | null
          school_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: "student" | "teacher" | "admin" | "parent"
          grade_level?:
            | "playgroup"
            | "pp1"
            | "pp2"
            | "grade1"
            | "grade2"
            | "grade3"
            | "grade4"
            | "grade5"
            | "grade6"
            | "grade7"
            | "grade8"
            | "grade9"
            | null
          school_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      learning_areas: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          grade_level:
            | "playgroup"
            | "pp1"
            | "pp2"
            | "grade1"
            | "grade2"
            | "grade3"
            | "grade4"
            | "grade5"
            | "grade6"
            | "grade7"
            | "grade8"
            | "grade9"
          weekly_lessons: number
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          grade_level:
            | "playgroup"
            | "pp1"
            | "pp2"
            | "grade1"
            | "grade2"
            | "grade3"
            | "grade4"
            | "grade5"
            | "grade6"
            | "grade7"
            | "grade8"
            | "grade9"
          weekly_lessons?: number
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          grade_level?:
            | "playgroup"
            | "pp1"
            | "pp2"
            | "grade1"
            | "grade2"
            | "grade3"
            | "grade4"
            | "grade5"
            | "grade6"
            | "grade7"
            | "grade8"
            | "grade9"
          weekly_lessons?: number
          created_at?: string
        }
      }
      student_progress: {
        Row: {
          id: string
          student_id: string
          learning_area_id: string | null
          strand_id: string | null
          sub_strand_id: string | null
          learning_outcome_id: string | null
          learning_objective_id: string | null
          status: "not_started" | "in_progress" | "completed" | "mastered"
          completion_percentage: number
          time_spent_minutes: number
          last_accessed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          learning_area_id?: string | null
          strand_id?: string | null
          sub_strand_id?: string | null
          learning_outcome_id?: string | null
          learning_objective_id?: string | null
          status?: "not_started" | "in_progress" | "completed" | "mastered"
          completion_percentage?: number
          time_spent_minutes?: number
          last_accessed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          learning_area_id?: string | null
          strand_id?: string | null
          sub_strand_id?: string | null
          learning_outcome_id?: string | null
          learning_objective_id?: string | null
          status?: "not_started" | "in_progress" | "completed" | "mastered"
          completion_percentage?: number
          time_spent_minutes?: number
          last_accessed?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_analytics: {
        Row: {
          id: string
          student_id: string
          date: string
          total_time_minutes: number
          lessons_completed: number
          assessments_taken: number
          average_score: number
          tokens_used: number
          activities: any
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          date: string
          total_time_minutes?: number
          lessons_completed?: number
          assessments_taken?: number
          average_score?: number
          tokens_used?: number
          activities?: any
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          date?: string
          total_time_minutes?: number
          lessons_completed?: number
          assessments_taken?: number
          average_score?: number
          tokens_used?: number
          activities?: any
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_progress_summary: {
        Args: {
          student_id: string
          grade_level:
            | "playgroup"
            | "pp1"
            | "pp2"
            | "grade1"
            | "grade2"
            | "grade3"
            | "grade4"
            | "grade5"
            | "grade6"
            | "grade7"
            | "grade8"
            | "grade9"
        }
        Returns: {
          learning_area_name: string
          total_objectives: number
          completed_objectives: number
          in_progress_objectives: number
          completion_percentage: number
          total_time_minutes: number
          average_score: number
        }[]
      }
      update_daily_analytics: {
        Args: {
          p_student_id: string
          p_date: string
          p_time_spent: number
          p_lessons_completed?: number
          p_assessments_taken?: number
          p_average_score?: number
          p_tokens_used?: number
          p_activities?: any
        }
        Returns: void
      }
    }
    Enums: {
      grade_level:
        | "playgroup"
        | "pp1"
        | "pp2"
        | "grade1"
        | "grade2"
        | "grade3"
        | "grade4"
        | "grade5"
        | "grade6"
        | "grade7"
        | "grade8"
        | "grade9"
      user_role: "student" | "teacher" | "admin" | "parent"
      assessment_type: "formative" | "summative" | "practical" | "project"
      progress_status: "not_started" | "in_progress" | "completed" | "mastered"
    }
  }
}
