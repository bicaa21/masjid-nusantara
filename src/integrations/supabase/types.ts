export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
        Relationships: [];
      };
      donations: {
        Row: {
          amount: number;
          created_at: string;
          donor_email: string;
          donor_name: string | null;
          donor_phone: string;
          id: string;
          is_anonymous: boolean;
          message: string | null;
          payment_method: string;
          program_id: string;
          receipt_code: string;
          status: "pending" | "verified" | "rejected";
        };
        Insert: {
          amount: number;
          created_at?: string;
          donor_email: string;
          donor_name?: string | null;
          donor_phone: string;
          id?: string;
          is_anonymous?: boolean;
          message?: string | null;
          payment_method: string;
          program_id: string;
          receipt_code?: string;
          status?: "pending" | "verified" | "rejected";
        };
        Update: Partial<Database["public"]["Tables"]["donations"]["Insert"]>;
        Relationships: [];
      };
      news: {
        Row: {
          excerpt: string;
          id: string;
          image_url: string | null;
          is_published: boolean;
          published_at: string;
          slug: string;
          title: string;
        };
        Insert: {
          excerpt: string;
          id?: string;
          image_url?: string | null;
          is_published?: boolean;
          published_at?: string;
          slug: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["news"]["Insert"]>;
        Relationships: [];
      };
      program_updates: {
        Row: {
          body: string;
          id: string;
          is_published: boolean;
          occurred_at: string;
          program_id: string;
        };
        Insert: {
          body: string;
          id?: string;
          is_published?: boolean;
          occurred_at: string;
          program_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["program_updates"]["Insert"]>;
        Relationships: [];
      };
      programs: {
        Row: {
          build_progress: number;
          category: string;
          created_at: string;
          description: string;
          display_order: number;
          donors_count: number;
          excerpt: string;
          id: string;
          image_url: string | null;
          is_published: boolean;
          location: string;
          raised_amount: number;
          slug: string;
          target_amount: number;
          title: string;
        };
        Insert: {
          build_progress?: number;
          category: string;
          created_at?: string;
          description: string;
          display_order?: number;
          donors_count?: number;
          excerpt: string;
          id?: string;
          image_url?: string | null;
          is_published?: boolean;
          location: string;
          raised_amount?: number;
          slug: string;
          target_amount: number;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["programs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      submit_donation: {
        Args: {
          p_amount: number;
          p_donor_email: string;
          p_donor_name: string | null;
          p_donor_phone: string;
          p_is_anonymous: boolean;
          p_message: string | null;
          p_payment_method: string;
          p_program_slug: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
