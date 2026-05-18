import type { ComponentType } from "react";

export type Theme = "light" | "dark" | "system";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
};

export type StatCard = {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: ComponentType<{ className?: string }>;
  color: "indigo" | "emerald" | "amber" | "rose" | "violet" | "sky";
};

export type ActivityEvent = {
  id: string;
  type: "order" | "customer" | "product" | "payment" | "system";
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
};

export type RevenueDataPoint = {
  month: string;
  revenue: number;
  orders: number;
};

export type MockOrder = {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  total: number;
  items: number;
  createdAt: string;
};

export type { UserRole } from "@/types/database";
export type { Profile } from "@/types/database";
