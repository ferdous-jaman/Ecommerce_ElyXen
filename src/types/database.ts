export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          parent_id?: string | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sku: string;
          price: number;
          compare_price: number | null;
          cost_price: number | null;
          category_id: string | null;
          status: ProductStatus;
          images: string[];
          tags: string[];
          weight: number | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sku: string;
          price: number;
          compare_price?: number | null;
          cost_price?: number | null;
          category_id?: string | null;
          status?: ProductStatus;
          images?: string[];
          tags?: string[];
          weight?: number | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          sku?: string;
          price?: number;
          compare_price?: number | null;
          cost_price?: number | null;
          category_id?: string | null;
          status?: ProductStatus;
          images?: string[];
          tags?: string[];
          weight?: number | null;
          updated_at?: string;
        };
      };
      inventory: {
        Row: {
          id: string;
          product_id: string;
          quantity: number;
          reserved_quantity: number;
          low_stock_threshold: number;
          location: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          quantity?: number;
          reserved_quantity?: number;
          low_stock_threshold?: number;
          location?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          quantity?: number;
          reserved_quantity?: number;
          low_stock_threshold?: number;
          location?: string | null;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          profile_id: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          address: Json | null;
          notes: string | null;
          total_orders: number;
          total_spent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          address?: Json | null;
          notes?: string | null;
          total_orders?: number;
          total_spent?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          address?: Json | null;
          notes?: string | null;
          total_orders?: number;
          total_spent?: number;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          status: OrderStatus;
          payment_status: PaymentStatus;
          subtotal: number;
          discount_amount: number;
          tax_amount: number;
          shipping_amount: number;
          total: number;
          shipping_address: Json;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_id: string;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          subtotal: number;
          discount_amount?: number;
          tax_amount?: number;
          shipping_amount?: number;
          total: number;
          shipping_address: Json;
          notes?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          subtotal?: number;
          discount_amount?: number;
          tax_amount?: number;
          shipping_amount?: number;
          total?: number;
          shipping_address?: Json;
          notes?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          product_snapshot: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          product_snapshot: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          product_snapshot?: Json;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: never;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      product_status: ProductStatus;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
    };
  };
};

export type UserRole = "admin" | "staff" | "customer";
export type ProductStatus = "active" | "draft" | "archived";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Profile = Tables<"profiles">;
export type Category = Tables<"categories">;
export type Product = Tables<"products">;
export type Inventory = Tables<"inventory">;
export type Customer = Tables<"customers">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type ActivityLog = Tables<"activity_logs">;
