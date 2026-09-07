// API Contract Types for Physio Center Management System

export type HealthStatus = {
  status: "ok" | "unavailable" | "error";
  service: "api";
  timestamp?: string;
};

// ============================================
// User & Authentication Types
// ============================================

export type UserRole = "OWNER" | "THERAPIST" | "SECRETARY" | "PATIENT";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token: string;
  expiresAt: string;
};

// ============================================
// Patient Types
// ============================================

export type Patient = {
  id: string;
  userId: string | null;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  medicalHistory: string | null;
  dateOfBirth: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePatientInput = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  medicalHistory?: string;
  dateOfBirth?: string;
};

// ============================================
// Appointment Types
// ============================================

export type AppointmentStatus = 
  | "REQUESTED"
  | "CONFIRMED" 
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type Appointment = {
  id: string;
  patientId: string;
  therapistId: string;
  roomId: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  patient: Patient;
  therapist: User;
  room: Room;
};

export type CreateAppointmentInput = {
  patientId: string;
  therapistId: string;
  roomId: string;
  startsAt: string;
  endsAt: string;
  notes?: string;
};

// ============================================
// Room Types
// ============================================

export type Room = {
  id: string;
  number: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateRoomInput = {
  number: number;
  name: string;
};

// ============================================
// Therapy Session Types
// ============================================

export type TherapySession = {
  id: string;
  appointmentId: string;
  therapistId: string;
  diagnosis: string | null;
  treatmentPlan: string | null;
  notes: string | null;
  durationMin: number | null;
  painLevel: number | null;
  attendedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTherapySessionInput = {
  appointmentId: string;
  therapistId: string;
  diagnosis?: string;
  treatmentPlan?: string;
  notes?: string;
  durationMin?: number;
  painLevel?: number;
  attendedAt?: string;
};

// ============================================
// Invoice Types
// ============================================

export type InvoiceStatus = 
  | "DRAFT"
  | "ISSUED" 
  | "PAID"
  | "PARTIALLY_PAID"
  | "VOID";

export type Invoice = {
  id: string;
  patientId: string;
  appointmentId: string;
  subtotal: string;
  tax: string;
  total: string;
  currency: string;
  dueDate: string | null;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
  patient: Patient;
  appointment: Appointment;
};

export type CreateInvoiceInput = {
  patientId: string;
  appointmentId: string;
  subtotal: string;
  tax: string;
  total: string;
  currency?: string;
  dueDate?: string;
};

// ============================================
// Payment Types
// ============================================

export type Payment = {
  id: string;
  invoiceId: string;
  amount: string;
  method: string;
  reference: string | null;
  paidAt: string;
};

export type CreatePaymentInput = {
  invoiceId: string;
  amount: string;
  method: string;
  reference?: string;
};

// ============================================
// Settings Types
// ============================================

export type Setting = {
  id: string;
  centerName: string;
  centerLogo: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  googleMapsLink: string | null;
  workingHours: unknown | null;
  sessionPrice: string | null;
  currency: string;
  taxRate: string;
  defaultLanguage: string;
  timezone: string;
  whatsappMessageTemplate: string | null;
  updatedAt: string;
};

export type UpdateSettingsInput = {
  centerName?: string;
  centerLogo?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  googleMapsLink?: string | null;
  workingHours?: unknown | null;
  sessionPrice?: string | null;
  currency?: string;
  taxRate?: string;
  defaultLanguage?: string;
  timezone?: string;
  whatsappMessageTemplate?: string | null;
};

// ============================================
// API Response Types
// ============================================

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// ============================================
// Query Parameters
// ============================================

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type DateRangeParams = {
  startDate?: string;
  endDate?: string;
};
