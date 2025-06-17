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
      ai_models: {
        Row: {
          created_at: string | null
          deployment_status: string | null
          id: string
          model_name: string
          model_type: string
          performance_metrics: Json | null
          updated_at: string | null
          version: string
          weights_data: Json | null
        }
        Insert: {
          created_at?: string | null
          deployment_status?: string | null
          id?: string
          model_name: string
          model_type: string
          performance_metrics?: Json | null
          updated_at?: string | null
          version: string
          weights_data?: Json | null
        }
        Update: {
          created_at?: string | null
          deployment_status?: string | null
          id?: string
          model_name?: string
          model_type?: string
          performance_metrics?: Json | null
          updated_at?: string | null
          version?: string
          weights_data?: Json | null
        }
        Relationships: []
      }
      behavioral_patterns: {
        Row: {
          created_at: string | null
          id: string
          interaction_patterns: Json | null
          keystroke_dynamics: Json | null
          risk_score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_patterns?: Json | null
          keystroke_dynamics?: Json | null
          risk_score?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_patterns?: Json | null
          keystroke_dynamics?: Json | null
          risk_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      federated_learning_updates: {
        Row: {
          aggregated: boolean | null
          contribution_score: number | null
          created_at: string | null
          id: string
          local_weights: Json
          model_id: string
          performance_delta: number | null
          training_samples: number | null
          user_id: string
        }
        Insert: {
          aggregated?: boolean | null
          contribution_score?: number | null
          created_at?: string | null
          id?: string
          local_weights: Json
          model_id: string
          performance_delta?: number | null
          training_samples?: number | null
          user_id: string
        }
        Update: {
          aggregated?: boolean | null
          contribution_score?: number | null
          created_at?: string | null
          id?: string
          local_weights?: Json
          model_id?: string
          performance_delta?: number | null
          training_samples?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "federated_learning_updates_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          id: string
          labels: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          timestamp: string | null
        }
        Insert: {
          id?: string
          labels?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          timestamp?: string | null
        }
        Update: {
          id?: string
          labels?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          timestamp?: string | null
        }
        Relationships: []
      }
      threat_analysis_logs: {
        Row: {
          analysis_type: string
          confidence_score: number | null
          created_at: string | null
          id: string
          input_data: Json
          processing_time_ms: number | null
          result_data: Json
          threat_detected: boolean | null
          user_id: string
        }
        Insert: {
          analysis_type: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          input_data: Json
          processing_time_ms?: number | null
          result_data: Json
          threat_detected?: boolean | null
          user_id: string
        }
        Update: {
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          input_data?: Json
          processing_time_ms?: number | null
          result_data?: Json
          threat_detected?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      threat_reports: {
        Row: {
          compliance_data: Json | null
          created_at: string | null
          id: string
          location_data: Json | null
          remediation_status: string | null
          resolved_at: string | null
          severity: string
          threat_type: string
          user_id: string
        }
        Insert: {
          compliance_data?: Json | null
          created_at?: string | null
          id?: string
          location_data?: Json | null
          remediation_status?: string | null
          resolved_at?: string | null
          severity: string
          threat_type: string
          user_id: string
        }
        Update: {
          compliance_data?: Json | null
          created_at?: string | null
          id?: string
          location_data?: Json | null
          remediation_status?: string | null
          resolved_at?: string | null
          severity?: string
          threat_type?: string
          user_id?: string
        }
        Relationships: []
      }
      threat_signatures: {
        Row: {
          affected_platforms: Json | null
          confidence_score: number | null
          created_at: string | null
          first_seen: string | null
          geo_heatmap: Json | null
          id: string
          last_seen: string | null
          mitigation_strategy: Json | null
          severity: string
          signature_hash: string
          threat_type: string
          updated_at: string | null
        }
        Insert: {
          affected_platforms?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          first_seen?: string | null
          geo_heatmap?: Json | null
          id?: string
          last_seen?: string | null
          mitigation_strategy?: Json | null
          severity: string
          signature_hash: string
          threat_type: string
          updated_at?: string | null
        }
        Update: {
          affected_platforms?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          first_seen?: string | null
          geo_heatmap?: Json | null
          id?: string
          last_seen?: string | null
          mitigation_strategy?: Json | null
          severity?: string
          signature_hash?: string
          threat_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_sessions_enhanced: {
        Row: {
          active_threats: Json | null
          behavioral_patterns: Json | null
          device_fingerprint: Json | null
          id: string
          last_activity: string | null
          location_data: Json | null
          risk_score: number | null
          session_end: string | null
          session_start: string | null
          session_token: string
          user_id: string
        }
        Insert: {
          active_threats?: Json | null
          behavioral_patterns?: Json | null
          device_fingerprint?: Json | null
          id?: string
          last_activity?: string | null
          location_data?: Json | null
          risk_score?: number | null
          session_end?: string | null
          session_start?: string | null
          session_token: string
          user_id: string
        }
        Update: {
          active_threats?: Json | null
          behavioral_patterns?: Json | null
          device_fingerprint?: Json | null
          id?: string
          last_activity?: string | null
          location_data?: Json | null
          risk_score?: number | null
          session_end?: string | null
          session_start?: string | null
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
      vpn_sessions: {
        Row: {
          encryption_protocol: string | null
          ended_at: string | null
          id: string
          server_location: string
          session_data: Json | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          encryption_protocol?: string | null
          ended_at?: string | null
          id?: string
          server_location: string
          session_data?: Json | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          encryption_protocol?: string | null
          ended_at?: string | null
          id?: string
          server_location?: string
          session_data?: Json | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
