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
      call_participants: {
        Row: {
          call_id: string
          id: string
          is_muted: boolean | null
          is_video_enabled: boolean | null
          joined_at: string | null
          left_at: string | null
          peer_connection_data: Json | null
          user_id: string
        }
        Insert: {
          call_id: string
          id?: string
          is_muted?: boolean | null
          is_video_enabled?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          peer_connection_data?: Json | null
          user_id: string
        }
        Update: {
          call_id?: string
          id?: string
          is_muted?: boolean | null
          is_video_enabled?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          peer_connection_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_participants_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          call_type: Database["public"]["Enums"]["call_type"]
          duration_seconds: number | null
          ended_at: string | null
          id: string
          initiator_id: string
          is_recorded: boolean | null
          recording_url: string | null
          room_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["call_status"]
          webrtc_session_data: Json | null
        }
        Insert: {
          call_type: Database["public"]["Enums"]["call_type"]
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          initiator_id: string
          is_recorded?: boolean | null
          recording_url?: string | null
          room_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["call_status"]
          webrtc_session_data?: Json | null
        }
        Update: {
          call_type?: Database["public"]["Enums"]["call_type"]
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          initiator_id?: string
          is_recorded?: boolean | null
          recording_url?: string | null
          room_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["call_status"]
          webrtc_session_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          group_key_version: number | null
          id: string
          is_encrypted: boolean
          max_members: number | null
          name: string | null
          room_type: Database["public"]["Enums"]["room_type"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          group_key_version?: number | null
          id?: string
          is_encrypted?: boolean
          max_members?: number | null
          name?: string | null
          room_type?: Database["public"]["Enums"]["room_type"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          group_key_version?: number | null
          id?: string
          is_encrypted?: boolean
          max_members?: number | null
          name?: string | null
          room_type?: Database["public"]["Enums"]["room_type"]
          updated_at?: string
        }
        Relationships: []
      }
      encrypted_messages: {
        Row: {
          created_at: string
          encrypted_content: number[]
          id: string
          iv: number[]
          mac: number[]
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          encrypted_content: number[]
          id?: string
          iv: number[]
          mac: number[]
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          encrypted_content?: number[]
          id?: string
          iv?: number[]
          mac?: number[]
          recipient_id?: string
          sender_id?: string
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
      group_keys: {
        Row: {
          created_at: string
          encrypted_key: number[]
          id: string
          key_version: number
          room_id: string
        }
        Insert: {
          created_at?: string
          encrypted_key: number[]
          id?: string
          key_version?: number
          room_id: string
        }
        Update: {
          created_at?: string
          encrypted_key?: number[]
          id?: string
          key_version?: number
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_keys_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      member_key_shares: {
        Row: {
          created_at: string
          encrypted_key_share: number[]
          group_key_id: string
          id: string
          member_id: string
        }
        Insert: {
          created_at?: string
          encrypted_key_share: number[]
          group_key_id: string
          id?: string
          member_id: string
        }
        Update: {
          created_at?: string
          encrypted_key_share?: number[]
          group_key_id?: string
          id?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_key_shares_group_key_id_fkey"
            columns: ["group_key_id"]
            isOneToOne: false
            referencedRelation: "group_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          encrypted_content: number[]
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          iv: number[]
          mac: number[]
          message_type: Database["public"]["Enums"]["message_type"]
          metadata: Json | null
          reply_to: string | null
          room_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          encrypted_content: number[]
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          iv: number[]
          mac: number[]
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          reply_to?: string | null
          room_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          encrypted_content?: number[]
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          iv?: number[]
          mac?: number[]
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          reply_to?: string | null
          room_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
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
      room_members: {
        Row: {
          id: string
          is_muted: boolean | null
          joined_at: string
          last_read_at: string | null
          role: Database["public"]["Enums"]["room_role"]
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: Database["public"]["Enums"]["room_role"]
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: Database["public"]["Enums"]["room_role"]
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
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
      user_key_pairs: {
        Row: {
          created_at: string
          id: string
          private_key: number[]
          public_key: number[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          private_key: number[]
          public_key: number[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          private_key?: number[]
          public_key?: number[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          custom_status: string | null
          is_typing: boolean | null
          last_seen: string | null
          status: string
          typing_in_room: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          custom_status?: string | null
          is_typing?: boolean | null
          last_seen?: string | null
          status?: string
          typing_in_room?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          custom_status?: string | null
          is_typing?: boolean | null
          last_seen?: string | null
          status?: string
          typing_in_room?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_typing_in_room_fkey"
            columns: ["typing_in_room"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
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
      create_direct_message_room: {
        Args: { recipient_id: string }
        Returns: string
      }
    }
    Enums: {
      call_status: "ringing" | "ongoing" | "ended" | "missed" | "declined"
      call_type: "voice" | "video" | "screen_share"
      message_type:
        | "text"
        | "image"
        | "file"
        | "voice"
        | "video"
        | "reaction"
        | "reply"
        | "system"
      room_role: "owner" | "admin" | "moderator" | "member"
      room_type: "direct" | "group" | "channel"
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
      call_status: ["ringing", "ongoing", "ended", "missed", "declined"],
      call_type: ["voice", "video", "screen_share"],
      message_type: [
        "text",
        "image",
        "file",
        "voice",
        "video",
        "reaction",
        "reply",
        "system",
      ],
      room_role: ["owner", "admin", "moderator", "member"],
      room_type: ["direct", "group", "channel"],
    },
  },
} as const
