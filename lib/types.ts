export type Role = "customer" | "technician" | "admin";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "paid" | "unpaid";

export type Plan = "free" | "pro";

export type ServiceMode = "Home Visit" | "Shop Drop-off";

export type Category =
  | "Smartphone"
  | "Laptop & PC"
  | "AC"
  | "Refrigerator"
  | "TV"
  | "Washing Machine"
  | "Electrical";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  plan?: Plan;
  phone?: string | null;
  area?: string | null;
  bio?: string | null;
  createdAt?: string;
}

export interface Service {
  _id: string;
  title: string;
  category: Category;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  technician?: {
    name: string;
    image?: string | null;
    area?: string | null;
    bio?: string | null;
  };
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  ratingAverage?: number;
  ratingCount?: number;
  technicianPlan?: Plan;
  createdAt: string;
  updatedAt?: string;
}

export interface StatusHistoryEntry {
  status: BookingStatus;
  changedAt: string;
}

export interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: Category;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  statusHistory?: StatusHistoryEntry[];
  finalAmount: number;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paidAt?: string | null;
  rating?: number | null;
  review?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Payment {
  _id: string;
  bookingId: string;
  kind?: "booking" | "subscription";
  plan?: Plan;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTechnicians: number;
  totalCustomers: number;
  pendingServices: number;
  totalBookings: number;
  totalRevenue: number;
  bookingsByStatus: Array<{ _id: BookingStatus; count: number }>;
  revenueByMonth: Array<{ _id: string; total: number }>;
  servicesByCategory: Array<{ _id: Category; count: number }>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorBody {
  message?: string;
  issues?: Array<{ message?: string; path?: Array<string | number> }>;
}
