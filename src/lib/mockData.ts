import type { MockOrder, ActivityEvent, RevenueDataPoint } from "@/types";

export const revenueData: RevenueDataPoint[] = [
  { month: "Jan", revenue: 142000,  orders: 320  },
  { month: "Feb", revenue: 128500,  orders: 298  },
  { month: "Mar", revenue: 171200,  orders: 412  },
  { month: "Apr", revenue: 157800,  orders: 380  },
  { month: "May", revenue: 193400,  orders: 490  },
  { month: "Jun", revenue: 178900,  orders: 455  },
  { month: "Jul", revenue: 221200,  orders: 541  },
  { month: "Aug", revenue: 208700,  orders: 523  },
  { month: "Sep", revenue: 249400,  orders: 612  },
  { month: "Oct", revenue: 263100,  orders: 634  },
  { month: "Nov", revenue: 291500,  orders: 702  },
  { month: "Dec", revenue: 324200,  orders: 810  },
];

export const weeklyRevenue = [
  { day: "Mon", revenue: 42400,  orders: 94  },
  { day: "Tue", revenue: 55800,  orders: 118 },
  { day: "Wed", revenue: 41200,  orders: 86  },
  { day: "Thu", revenue: 68600,  orders: 142 },
  { day: "Fri", revenue: 82100,  orders: 167 },
  { day: "Sat", revenue: 79400,  orders: 148 },
  { day: "Sun", revenue: 54700,  orders: 115 },
];

export const orderStatusBreakdown = [
  { status: "Delivered",  count: 412, color: "#10b981" },
  { status: "Processing", count: 186, color: "#3b82f6" },
  { status: "Pending",    count: 98,  color: "#f59e0b" },
  { status: "Shipped",    count: 74,  color: "#8b5cf6" },
  { status: "Cancelled",  count: 32,  color: "#ef4444" },
  { status: "Refunded",   count: 8,   color: "#94a3b8" },
];

export const topProducts = [
  { name: "Samsung Galaxy S24 Ultra",     sku: "SAM-S24U",   revenue: 238400, units: 32, trend: 12.4  },
  { name: "Apple iPhone 15 Pro Max",      sku: "APL-I15PM",  revenue: 201200, units: 16, trend: 8.1   },
  { name: "Sony WH-1000XM5 Headphones",   sku: "SNY-WH5",    revenue: 118900, units: 84, trend: 22.7  },
  { name: "Dell XPS 15 Laptop",           sku: "DLL-XPS15",  revenue: 114600, units: 14, trend: -3.2  },
  { name: "Xiaomi Smart TV 55\"",         sku: "XMI-TV55",   revenue: 91800,  units: 31, trend: 15.9  },
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
  { name: "Samsung Galaxy S24 Ultra",   sku: "SAM-S24U",  stock: 3,  threshold: 10 },
  { name: "Sony WH-1000XM5",            sku: "SNY-WH5",   stock: 5,  threshold: 15 },
  { name: "Xiaomi Smart TV 55\"",       sku: "XMI-TV55",  stock: 2,  threshold: 8  },
  { name: "DJI Mini 4 Pro Drone",       sku: "DJI-M4P",   stock: 4,  threshold: 10 },
];

export const recentOrders: MockOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-ELX4821",
    customer: { name: "Rafiqul Islam",    email: "rafiq.islam@gmail.com"   },
    status: "delivered",
    total: 12499,
    items: 3,
    createdAt: "2025-05-18T10:30:00Z",
  },
  {
    id: "2",
    orderNumber: "ORD-ELX4822",
    customer: { name: "Nusrat Jahan",     email: "nusrat.jahan@yahoo.com"  },
    status: "processing",
    total: 84999,
    items: 1,
    createdAt: "2025-05-18T11:15:00Z",
  },
  {
    id: "3",
    orderNumber: "ORD-ELX4823",
    customer: { name: "Tanvir Ahmed",     email: "tanvir.a@hotmail.com"    },
    status: "shipped",
    total: 3450,
    items: 2,
    createdAt: "2025-05-18T12:00:00Z",
  },
  {
    id: "4",
    orderNumber: "ORD-ELX4824",
    customer: { name: "Sumaiya Khatun",   email: "sumaiya.k@gmail.com"     },
    status: "pending",
    total: 22800,
    items: 4,
    createdAt: "2025-05-18T13:45:00Z",
  },
  {
    id: "5",
    orderNumber: "ORD-ELX4825",
    customer: { name: "Mehedi Hasan",     email: "mehedi.h@gmail.com"      },
    status: "cancelled",
    total: 8799,
    items: 2,
    createdAt: "2025-05-18T14:20:00Z",
  },
  {
    id: "6",
    orderNumber: "ORD-ELX4826",
    customer: { name: "Fatema Begum",     email: "fatema.b@gmail.com"      },
    status: "delivered",
    total: 31500,
    items: 5,
    createdAt: "2025-05-18T15:00:00Z",
  },
  {
    id: "7",
    orderNumber: "ORD-ELX4827",
    customer: { name: "Abid Hossain",     email: "abid.hossain@gmail.com"  },
    status: "processing",
    total: 5999,
    items: 1,
    createdAt: "2025-05-18T15:45:00Z",
  },
  {
    id: "8",
    orderNumber: "ORD-ELX4828",
    customer: { name: "Sabrina Sultana",  email: "sabrina.s@outlook.com"   },
    status: "shipped",
    total: 18750,
    items: 3,
    createdAt: "2025-05-18T16:10:00Z",
  },
];

export type MockCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  joinedAt: string;
};

export const mockCustomers: MockCustomer[] = [
  { id: "c1",  name: "Rafiqul Islam",    email: "rafiq.islam@gmail.com",    phone: "01711-234567", city: "Dhaka",      totalOrders: 12, totalSpent: 84500,  status: "active",   joinedAt: "2024-08-12T09:00:00Z" },
  { id: "c2",  name: "Nusrat Jahan",     email: "nusrat.jahan@yahoo.com",   phone: "01812-345678", city: "Chittagong", totalOrders: 8,  totalSpent: 62100,  status: "active",   joinedAt: "2024-09-03T11:20:00Z" },
  { id: "c3",  name: "Tanvir Ahmed",     email: "tanvir.a@hotmail.com",     phone: "01913-456789", city: "Sylhet",     totalOrders: 5,  totalSpent: 31450,  status: "active",   joinedAt: "2024-09-20T14:30:00Z" },
  { id: "c4",  name: "Sumaiya Khatun",   email: "sumaiya.k@gmail.com",      phone: "01611-567890", city: "Rajshahi",   totalOrders: 3,  totalSpent: 22800,  status: "active",   joinedAt: "2024-10-05T10:15:00Z" },
  { id: "c5",  name: "Mehedi Hasan",     email: "mehedi.h@gmail.com",       phone: "01714-678901", city: "Dhaka",      totalOrders: 7,  totalSpent: 47200,  status: "active",   joinedAt: "2024-10-18T16:45:00Z" },
  { id: "c6",  name: "Fatema Begum",     email: "fatema.b@gmail.com",       phone: "01815-789012", city: "Khulna",     totalOrders: 15, totalSpent: 115600, status: "active",   joinedAt: "2024-07-30T08:00:00Z" },
  { id: "c7",  name: "Abid Hossain",     email: "abid.hossain@gmail.com",   phone: "01916-890123", city: "Dhaka",      totalOrders: 2,  totalSpent: 11998,  status: "inactive", joinedAt: "2024-11-10T12:00:00Z" },
  { id: "c8",  name: "Sabrina Sultana",  email: "sabrina.s@outlook.com",    phone: "01716-901234", city: "Comilla",    totalOrders: 9,  totalSpent: 58300,  status: "active",   joinedAt: "2024-10-22T09:30:00Z" },
  { id: "c9",  name: "Arif Hossain",     email: "arif.hossain@gmail.com",   phone: "01817-012345", city: "Dhaka",      totalOrders: 11, totalSpent: 79400,  status: "active",   joinedAt: "2024-08-05T11:00:00Z" },
  { id: "c10", name: "Roksana Parvin",   email: "roksana.p@gmail.com",      phone: "01617-123456", city: "Barishal",   totalOrders: 4,  totalSpent: 28950,  status: "active",   joinedAt: "2024-11-15T14:00:00Z" },
  { id: "c11", name: "Jahangir Alam",    email: "jahangir.a@yahoo.com",     phone: "01918-234567", city: "Mymensingh", totalOrders: 6,  totalSpent: 44700,  status: "active",   joinedAt: "2024-09-11T10:45:00Z" },
  { id: "c12", name: "Mitu Akter",       email: "mitu.akter@gmail.com",     phone: "01718-345678", city: "Dhaka",      totalOrders: 1,  totalSpent: 5999,   status: "inactive", joinedAt: "2025-01-20T15:30:00Z" },
];

export const activityFeed: ActivityEvent[] = [
  {
    id: "1",
    type: "order",
    title: "New order received",
    description: "ORD-ELX4828 from Sabrina Sultana — ৳18,750",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    type: "customer",
    title: "New customer registered",
    description: "Mitu Akter just created an account",
    timestamp: "14 min ago",
  },
  {
    id: "3",
    type: "payment",
    title: "Payment confirmed",
    description: "ORD-ELX4822 — ৳84,999 via bKash",
    timestamp: "32 min ago",
  },
  {
    id: "4",
    type: "product",
    title: "Low stock alert",
    description: "Samsung Galaxy S24 Ultra — only 3 units left",
    timestamp: "1 hr ago",
  },
  {
    id: "5",
    type: "order",
    title: "Order shipped",
    description: "ORD-ELX4823 dispatched to Sylhet",
    timestamp: "2 hr ago",
  },
  {
    id: "6",
    type: "order",
    title: "Order delivered",
    description: "ORD-ELX4821 delivered to Rafiqul Islam",
    timestamp: "3 hr ago",
  },
  {
    id: "7",
    type: "payment",
    title: "Cash on Delivery collected",
    description: "ORD-ELX4826 — ৳31,500 collected",
    timestamp: "4 hr ago",
  },
  {
    id: "8",
    type: "system",
    title: "System backup completed",
    description: "Automated daily backup finished successfully",
    timestamp: "5 hr ago",
  },
];
