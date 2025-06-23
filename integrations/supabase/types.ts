export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_config_history: {
        Row: {
          change_reason: string | null
          changed_by: string | null
          config_key: string
          created_at: string | null
          id: number
          new_value: Json | null
          old_value: Json | null
        }
        Insert: {
          change_reason?: string | null
          changed_by?: string | null
          config_key: string
          created_at?: string | null
          id?: number
          new_value?: Json | null
          old_value?: Json | null
        }
        Update: {
          change_reason?: string | null
          changed_by?: string | null
          config_key?: string
          created_at?: string | null
          id?: number
          new_value?: Json | null
          old_value?: Json | null
        }
        Relationships: []
      }
      ai_config_templates: {
        Row: {
          category: string | null
          color: string | null
          config_data: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          id: number
          is_active: boolean | null
          is_system_template: boolean | null
          name: string
          updated_at: string | null
          updated_by: string | null
          usage_stats: Json | null
        }
        Insert: {
          category?: string | null
          color?: string | null
          config_data?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          is_system_template?: boolean | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
          usage_stats?: Json | null
        }
        Update: {
          category?: string | null
          color?: string | null
          config_data?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          is_system_template?: boolean | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
          usage_stats?: Json | null
        }
        Relationships: []
      }
      ai_model_monitoring: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          id: string
          last_trained_at: string | null
          model_name: string
          model_version: string | null
          performance_metrics: Json | null
          status: string | null
          training_data_count: number | null
          updated_at: string | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          last_trained_at?: string | null
          model_name: string
          model_version?: string | null
          performance_metrics?: Json | null
          status?: string | null
          training_data_count?: number | null
          updated_at?: string | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          last_trained_at?: string | null
          model_name?: string
          model_version?: string | null
          performance_metrics?: Json | null
          status?: string | null
          training_data_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_provider_config: {
        Row: {
          config: Json
          cost_per_token: number | null
          created_at: string | null
          id: number
          is_enabled: boolean | null
          priority: number | null
          provider_name: string
          rate_limit: number | null
          updated_at: string | null
        }
        Insert: {
          config?: Json
          cost_per_token?: number | null
          created_at?: string | null
          id?: number
          is_enabled?: boolean | null
          priority?: number | null
          provider_name: string
          rate_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          config?: Json
          cost_per_token?: number | null
          created_at?: string | null
          id?: number
          is_enabled?: boolean | null
          priority?: number | null
          provider_name?: string
          rate_limit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_template_applications: {
        Row: {
          application_reason: string | null
          applied_by: string | null
          applied_config: Json | null
          created_at: string | null
          id: number
          previous_config: Json | null
          rollback_data: Json | null
          template_id: number | null
        }
        Insert: {
          application_reason?: string | null
          applied_by?: string | null
          applied_config?: Json | null
          created_at?: string | null
          id?: number
          previous_config?: Json | null
          rollback_data?: Json | null
          template_id?: number | null
        }
        Update: {
          application_reason?: string | null
          applied_by?: string | null
          applied_config?: Json | null
          created_at?: string | null
          id?: number
          previous_config?: Json | null
          rollback_data?: Json | null
          template_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_template_applications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "ai_config_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_training_materials: {
        Row: {
          approved_by: string | null
          content: string
          created_at: string | null
          description: string | null
          file_url: string | null
          grade_level: string | null
          id: string
          keywords: string[] | null
          material_type: string
          status: string | null
          subject_area: string | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          approved_by?: string | null
          content: string
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          grade_level?: string | null
          id?: string
          keywords?: string[] | null
          material_type: string
          status?: string | null
          subject_area?: string | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          approved_by?: string | null
          content?: string
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          grade_level?: string | null
          id?: string
          keywords?: string[] | null
          material_type?: string
          status?: string | null
          subject_area?: string | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          cost: number | null
          created_at: string | null
          error_message: string | null
          id: number
          model_used: string
          provider: string
          response_time_ms: number | null
          session_id: string | null
          success: boolean | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: number
          model_used: string
          provider: string
          response_time_ms?: number | null
          session_id?: string | null
          success?: boolean | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: number
          model_used?: string
          provider?: string
          response_time_ms?: number | null
          session_id?: string | null
          success?: boolean | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      app_user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          session_token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          session_token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          session_token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_users: {
        Row: {
          county_id: number | null
          created_at: string | null
          email: string
          full_name: string
          grade_level: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_login: string | null
          parent_id: string | null
          password_hash: string
          phone: string | null
          school_id: string | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
          username: string
        }
        Insert: {
          county_id?: number | null
          created_at?: string | null
          email: string
          full_name: string
          grade_level?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          parent_id?: string | null
          password_hash: string
          phone?: string | null
          school_id?: string | null
          updated_at?: string | null
          user_type: Database["public"]["Enums"]["user_type"]
          username: string
        }
        Update: {
          county_id?: number | null
          created_at?: string | null
          email?: string
          full_name?: string
          grade_level?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          parent_id?: string | null
          password_hash?: string
          phone?: string | null
          school_id?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_users_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_users_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_users_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_progress: {
        Row: {
          assessment_type: string
          created_at: string | null
          current_step: number
          id: string
          is_completed: boolean | null
          responses: Json | null
          session_id: string
          time_spent: number | null
          total_steps: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assessment_type: string
          created_at?: string | null
          current_step?: number
          id?: string
          is_completed?: boolean | null
          responses?: Json | null
          session_id: string
          time_spent?: number | null
          total_steps: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assessment_type?: string
          created_at?: string | null
          current_step?: number
          id?: string
          is_completed?: boolean | null
          responses?: Json | null
          session_id?: string
          time_spent?: number | null
          total_steps?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      assessment_results: {
        Row: {
          assessment_type: string
          completed_at: string | null
          created_at: string | null
          id: string
          pathway_suggestions: Json | null
          recommendations: Json | null
          scores: Json
          user_id: string | null
        }
        Insert: {
          assessment_type: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          pathway_suggestions?: Json | null
          recommendations?: Json | null
          scores: Json
          user_id?: string | null
        }
        Update: {
          assessment_type?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          pathway_suggestions?: Json | null
          recommendations?: Json | null
          scores?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_credentials: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password_hash: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password_hash: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password_hash?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auth_credentials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      career_materials: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          file_url: string | null
          grade_levels: string[] | null
          id: string
          is_published: boolean | null
          material_type: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          grade_levels?: string[] | null
          id?: string
          is_published?: boolean | null
          material_type: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          grade_levels?: string[] | null
          id?: string
          is_published?: boolean | null
          material_type?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "career_materials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          course_id: string | null
          id: string
          issued_at: string | null
          level: string
          score: number
          topic_id: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          id?: string
          issued_at?: string | null
          level: string
          score: number
          topic_id?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          id?: string
          issued_at?: string | null
          level?: string
          score?: number
          topic_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      code_projects: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          language: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          language: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          language?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "code_projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      counties: {
        Row: {
          code: string
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          id: string
          subject: string
          title: string
          total_topics: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          subject: string
          title: string
          total_topics?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          subject?: string
          title?: string
          total_topics?: number | null
        }
        Relationships: []
      }
      email_verification_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_verification_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      global_ai_config: {
        Row: {
          category: string | null
          config_key: string
          config_value: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          is_active: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          config_key: string
          config_value: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          config_key?: string
          config_value?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      parent_child_relationships: {
        Row: {
          approved_at: string | null
          child_id: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          parent_id: string
          relationship_type: string | null
        }
        Insert: {
          approved_at?: string | null
          child_id: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_id: string
          relationship_type?: string | null
        }
        Update: {
          approved_at?: string | null
          child_id?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_id?: string
          relationship_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_child_relationships_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_child_relationships_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: number
          name: string
          resource: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          resource: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          resource?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_questions: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          difficulty_level: number | null
          id: string
          is_active: boolean | null
          options: Json | null
          question_text: string
          question_type: string
          subcategory: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: number | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          question_text: string
          question_type: string
          subcategory?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: number | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          question_text?: string
          question_type?: string
          subcategory?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          correct_answer: string
          explanation: string | null
          id: string
          options: Json
          question: string
          question_number: number
          topic_id: string | null
        }
        Insert: {
          correct_answer: string
          explanation?: string | null
          id?: string
          options: Json
          question: string
          question_number: number
          topic_id?: string | null
        }
        Update: {
          correct_answer?: string
          explanation?: string | null
          id?: string
          options?: Json
          question?: string
          question_number?: number
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          granted_at: string | null
          id: number
          permission_id: number | null
          role_name: Database["public"]["Enums"]["user_role_type"]
        }
        Insert: {
          granted_at?: string | null
          id?: number
          permission_id?: number | null
          role_name: Database["public"]["Enums"]["user_role_type"]
        }
        Update: {
          granted_at?: string | null
          id?: number
          permission_id?: number | null
          role_name?: Database["public"]["Enums"]["user_role_type"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: Database["public"]["Enums"]["user_role_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: Database["public"]["Enums"]["user_role_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: Database["public"]["Enums"]["user_role_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          county_id: number | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          max_students: number | null
          name: string
          phone: string | null
          principal_name: string | null
          registration_number: string | null
          school_type: string | null
          sub_county: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at: string | null
          ward: string | null
        }
        Insert: {
          county_id?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          max_students?: number | null
          name: string
          phone?: string | null
          principal_name?: string | null
          registration_number?: string | null
          school_type?: string | null
          sub_county?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
          ward?: string | null
        }
        Update: {
          county_id?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          max_students?: number | null
          name?: string
          phone?: string | null
          principal_name?: string | null
          registration_number?: string | null
          school_type?: string | null
          sub_county?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
          ward?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["id"]
          },
        ]
      }
      student_performance_reports: {
        Row: {
          academic_year: string
          areas_for_improvement: string[] | null
          generated_at: string | null
          grade: string | null
          id: string
          overall_average: number | null
          position: number | null
          strengths: string[] | null
          student_id: string
          teacher_comments: string | null
          term: number
          total_students: number | null
        }
        Insert: {
          academic_year: string
          areas_for_improvement?: string[] | null
          generated_at?: string | null
          grade?: string | null
          id?: string
          overall_average?: number | null
          position?: number | null
          strengths?: string[] | null
          student_id: string
          teacher_comments?: string | null
          term: number
          total_students?: number | null
        }
        Update: {
          academic_year?: string
          areas_for_improvement?: string[] | null
          generated_at?: string | null
          grade?: string | null
          id?: string
          overall_average?: number | null
          position?: number | null
          strengths?: string[] | null
          student_id?: string
          teacher_comments?: string | null
          term?: number
          total_students?: number | null
        }
        Relationships: []
      }
      termly_marks: {
        Row: {
          academic_year: string
          created_at: string | null
          grade: string | null
          id: string
          marks: number
          remarks: string | null
          student_id: string
          subject_area: string
          teacher_id: string
          term: number
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          grade?: string | null
          id?: string
          marks: number
          remarks?: string | null
          student_id: string
          subject_area: string
          teacher_id: string
          term: number
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          grade?: string | null
          id?: string
          marks?: number
          remarks?: string | null
          student_id?: string
          subject_area?: string
          teacher_id?: string
          term?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      topics: {
        Row: {
          content: string | null
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string
          topic_number: number
        }
        Insert: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          topic_number: number
        }
        Update: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          topic_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          allow_messages: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          push_notifications: boolean | null
          screen_time_limit: number | null
          share_progress: boolean | null
          show_profile: boolean | null
          sms_notifications: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allow_messages?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          push_notifications?: boolean | null
          screen_time_limit?: number | null
          share_progress?: boolean | null
          show_profile?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allow_messages?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          push_notifications?: boolean | null
          screen_time_limit?: number | null
          share_progress?: boolean | null
          show_profile?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          certificate_issued: boolean | null
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          id: string
          quiz_score: number | null
          topic_id: string | null
          user_id: string | null
        }
        Insert: {
          certificate_issued?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          quiz_score?: number | null
          topic_id?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_issued?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          quiz_score?: number | null
          topic_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: number
          is_active: boolean | null
          role_name: Database["public"]["Enums"]["user_role_type"]
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: number
          is_active?: boolean | null
          role_name: Database["public"]["Enums"]["user_role_type"]
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: number
          is_active?: boolean | null
          role_name?: Database["public"]["Enums"]["user_role_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_accessed: string | null
          refresh_token: string
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_accessed?: string | null
          refresh_token: string
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_accessed?: string | null
          refresh_token?: string
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string
          grade_level: string | null
          id: string
          is_verified: boolean | null
          last_login_at: string | null
          locked_until: string | null
          login_attempts: number | null
          parent_id: string | null
          phone: string | null
          school_organization: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name: string
          grade_level?: string | null
          id?: string
          is_verified?: boolean | null
          last_login_at?: string | null
          locked_until?: string | null
          login_attempts?: number | null
          parent_id?: string | null
          phone?: string | null
          school_organization?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string
          grade_level?: string | null
          id?: string
          is_verified?: boolean | null
          last_login_at?: string | null
          locked_until?: string | null
          login_attempts?: number | null
          parent_id?: string | null
          phone?: string | null
          school_organization?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      visual_login_patterns: {
        Row: {
          created_at: string | null
          id: string
          pattern_sequence: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pattern_sequence: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pattern_sequence?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visual_login_patterns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_ai_config_template: {
        Args: {
          template_id_param: number
          applied_by_param: string
          reason_param?: string
        }
        Returns: Json
      }
      calculate_student_performance: {
        Args: { p_student_id: string; p_term: number; p_academic_year: string }
        Returns: undefined
      }
      generate_username: {
        Args: {
          full_name: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Returns: string
      }
      rollback_ai_config_template: {
        Args: { application_id_param: number; rolled_back_by_param: string }
        Returns: Json
      }
    }
    Enums: {
      subscription_status: "active" | "inactive" | "suspended" | "trial"
      user_role_type: "admin" | "student" | "teacher"
      user_type:
        | "student"
        | "teacher"
        | "parent"
        | "school_admin"
        | "system_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      subscription_status: ["active", "inactive", "suspended", "trial"],
      user_role_type: ["admin", "student", "teacher"],
      user_type: [
        "student",
        "teacher",
        "parent",
        "school_admin",
        "system_admin",
      ],
    },
  },
} as const
