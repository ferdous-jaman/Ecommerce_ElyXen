import type { MockOrder, ActivityEvent, RevenueDataPoint } from "@/types";

export const revenueData: RevenueDataPoint[] = [
  { month: "Jan", revenue: 42000, orders: 320 },
  { month: "Feb", revenue: 38500, orders: 298 },
  { month: "Mar", revenue: 51200, orders: 412 },
  { month: "Apr", revenue: 47800, orders: 380 },
  { month: "May", revenue: 63400, orders: 490 },
  { month: "Jun", revenue: 58900, orders: 455 },
  { month: "Jul", revenue: 71200, orders: 541 },
  { month: "Aug", revenue: 68700, orders: 523 },
  { month: "Sep", revenue: 79400, orders: 612 },
  { month: "Oct", revenue: 83100, orders: 634 },
  { month: "Nov", revenue: 91500, orders: 702 },
  { month: "Dec", revenue: 104200, orders: 810 },
];

export const weeklyRevenue = [
  { day: "Mon", revenue: 12400, orders: 94 },
  { day: "Tue", revenue: 15800, orders: 118 },
  { day: "Wed", revenue: 11200, orders: 86 },
  { day: "Thu", revenue: 18600, orders: 142 },
  { day: "Fri", revenue: 22100, orders: 167 },
  { day: "Sat", revenue: 19400, orders: 148 },
  { day: "Sun", revenue: 14700, orders: 115 },
];

export const orderStatusBreakdown = [
  { status: "Delivered", count: 412, color: "#10b981" },
  { status: "Processing", count: 186, color: "#3b82f6" },
  { status: "Pending", count: 98, color: "#f59e0b" },
  { status: "Shipped", count: 74, color: "#8b5cf6" },
  { status: "Cancelled", count: 32, color: "#ef4444" },
  { status: "Refunded", count: 8, color: "#94a3b8" },
];

export const topProducts = [
  { name: "iPhone 15 Pro", sku: "IPH-15P", revenue: 38400, units: 32, trend: 12.4 },
  { name: "MacBook Air M3", sku: "MBA-M3", revenue: 31200, units: 16, trend: 8.1 },
  { name: "AirPods Pro 2", sku: "APP-2", revenue: 18900, units: 84, trend: 22.7 },
  { name: "iPad Pro 13", sku: "IPD-P13", revenue: 14600, units: 14, trend: -3.2 },
  { name: "Apple Watch S9", sku: "AWS-9", revenue: 11800, units: 31, trend: 15.9 },
];

export const customerGrowth = [
  { month: "Jul", new: 142, returning: 298 },
  { month: "Aug", new: 168, returning: 312 },
  { month: "Sep", new: 195, returning: 334 },
  { month: "Oct", new: 221, returning: 358 },
  { month: "Nov", new: 248, returning: 391 },
  { month: "Dec", new: 284, returning: 422 },
];

export const inventoryAlerts = [
  { name: "iPhone 15 Pro", sku: "IPH-15P", stock: 3, threshold: 10 },
  { name: "Sony WH-1000XM5", sku: "SNY-WH5", stock: 5, threshold: 15 },
  { name: "Samsung 4K TV 65\"", sku: "SAM-4K65", stock: 2, threshold: 8 },
  { name: "DJI Mini 4 Pro", sku: "DJI-M4P", stock: 4, threshold: 10 },
];

export const recentOrders: MockOrder[] = [
  {
    id: "1",
    orderNumber: "#ORD-7823",
    customer: { name: "Sarah Johnson", email: "sarah.j@email.com" },
    status: "delivered",
    total: 249.99,
    items: 3,
    createdAt: "2024-12-10T10:30:00Z",
  },
  {
    id: "2",
    orderNumber: "#ORD-7824",
    customer: { name: "Michael Chen", email: "m.chen@email.com" },
    status: "processing",
    total: 1299.0,
    items: 1,
    createdAt: "2024-12-10T11:15:00Z",
  },
  {
    id: "3",
    orderNumber: "#ORD-7825",
    customer: { name: "Emily Davis", email: "emily.d@email.com" },
    status: "shipped",
    total: 89.5,
    items: 2,
    createdAt: "2024-12-10T12:00:00Z",
  },
  {
    id: "4",
    orderNumber: "#ORD-7826",
    customer: { name: "James Wilson", email: "j.wilson@email.com" },
    status: "pending",
    total: 459.0,
    items: 4,
    createdAt: "2024-12-10T13:45:00Z",
  },
  {
    id: "5",
    orderNumber: "#ORD-7827",
    customer: { name: "Aisha Patel", email: "aisha.p@email.com" },
    status: "cancelled",
    total: 179.99,
    items: 2,
    createdAt: "2024-12-10T14:20:00Z",
  },
  {
    id: "6",
    orderNumber: "#ORD-7828",
    customer: { name: "Lucas Martinez", email: "l.martinez@email.com" },
    status: "delivered",
    total: 599.0,
    items: 5,
    createdAt: "2024-12-10T15:00:00Z",
  },
];

export const activityFeed: ActivityEvent[] = [
  {
    id: "1",
    type: "order",
    title: "New order received",
    description: "Order #ORD-7828 from Lucas Martinez — $599.00",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    type: "customer",
    title: "New customer registered",
    description: "Priya Sharma created an account",
    timestamp: "14 min ago",
  },
  {
    id: "3",
    type: "payment",
    title: "Payment confirmed",
    description: "Order #ORD-7824 payment of $1,299.00 confirmed",
    timestamp: "32 min ago",
  },
  {
    id: "4",
    type: "product",
    title: "Low stock alert",
    description: "iPhone 15 Pro — only 3 units remaining",
    timestamp: "1 hr ago",
  },
  {
    id: "5",
    type: "order",
    title: "Order shipped",
    description: "Order #ORD-7825 has been dispatched",
    timestamp: "2 hr ago",
  },
  {
    id: "6",
    type: "system",
    title: "System backup completed",
    description: "Automated daily backup finished successfully",
    timestamp: "3 hr ago",
  },
];
