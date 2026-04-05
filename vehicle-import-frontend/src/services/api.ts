const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// --- Types ---

export interface Vehicle {
  id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  license_plate: string | null;
  engine_type: string | null;
  fuel_type: string | null;
  transmission: string | null;
  mileage: number | null;
  origin_country: string;
  destination_country: string;
  purchase_price: number | null;
  purchase_date: string | null;
  owner_name: string | null;
  owner_contact: string | null;
  assigned_to: string | null;
  group: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleCreate {
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  license_plate?: string;
  engine_type?: string;
  fuel_type?: string;
  transmission?: string;
  mileage?: number;
  origin_country: string;
  destination_country?: string;
  purchase_price?: number;
  purchase_date?: string;
  owner_name?: string;
  owner_contact?: string;
  assigned_to?: string;
  group?: string;
  status?: string;
  notes?: string;
}

export interface Tool {
  id: number;
  name: string;
  tool_type: string | null;
  serial_number: string | null;
  manufacturer: string | null;
  purchase_date: string | null;
  purchase_cost: number | null;
  assigned_to: string | null;
  location: string | null;
  status: string;
  last_service_date: string | null;
  next_service_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ToolCreate {
  name: string;
  tool_type?: string;
  serial_number?: string;
  manufacturer?: string;
  purchase_date?: string;
  purchase_cost?: number;
  assigned_to?: string;
  location?: string;
  status?: string;
  last_service_date?: string;
  next_service_date?: string;
  notes?: string;
}

export interface Inspection {
  id: number;
  vehicle_id: number;
  inspection_type: string;
  inspection_date: string;
  inspector_name: string;
  status: string;
  passed: boolean;
  notes: string | null;
  created_at: string;
  items: { id: number; inspection_id: number; item_name: string; condition: string; notes: string | null }[];
}

export interface InspectionCreate {
  vehicle_id: number;
  inspection_type: string;
  inspection_date: string;
  inspector_name: string;
  status?: string;
  passed?: boolean;
  notes?: string;
  items?: { item_name: string; condition: string; notes?: string }[];
}

export interface Issue {
  id: number;
  vehicle_id: number;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  reported_by: string | null;
  assigned_to: string | null;
  reported_date: string;
  due_date: string | null;
  resolved_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IssueCreate {
  vehicle_id: number;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  reported_by?: string;
  assigned_to?: string;
  reported_date: string;
  due_date?: string;
  notes?: string;
}

export interface Reminder {
  id: number;
  vehicle_id: number | null;
  reminder_type: string;
  title: string;
  description: string | null;
  due_date: string;
  status: string;
  is_recurring: boolean;
  recurrence_interval: number | null;
  recurrence_unit: string | null;
  notified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReminderCreate {
  vehicle_id?: number;
  reminder_type: string;
  title: string;
  description?: string;
  due_date: string;
  status?: string;
  is_recurring?: boolean;
  recurrence_interval?: number;
  recurrence_unit?: string;
}

export interface ServiceEntry {
  id: number;
  vehicle_id: number;
  service_type: string;
  description: string | null;
  service_date: string;
  completed_date: string | null;
  vendor_id: number | null;
  technician: string | null;
  labor_cost: number | null;
  parts_cost: number | null;
  total_cost: number | null;
  meter_reading: number | null;
  status: string;
  priority: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceCreate {
  vehicle_id: number;
  service_type: string;
  description?: string;
  service_date: string;
  completed_date?: string;
  vendor_id?: number;
  technician?: string;
  labor_cost?: number;
  parts_cost?: number;
  total_cost?: number;
  meter_reading?: number;
  status?: string;
  priority?: string;
  notes?: string;
}

export interface Contact {
  id: number;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactCreate {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  status?: string;
  notes?: string;
}

export interface Vendor {
  id: number;
  name: string;
  vendor_type: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorCreate {
  name: string;
  vendor_type?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  status?: string;
  notes?: string;
}

export interface Part {
  id: number;
  name: string;
  part_number: string | null;
  category: string | null;
  manufacturer: string | null;
  quantity_in_stock: number;
  minimum_stock: number;
  unit_cost: number | null;
  location: string | null;
  compatible_vehicles: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartCreate {
  name: string;
  part_number?: string;
  category?: string;
  manufacturer?: string;
  quantity_in_stock?: number;
  minimum_stock?: number;
  unit_cost?: number;
  location?: string;
  compatible_vehicles?: string;
  notes?: string;
}

export interface Place {
  id: number;
  name: string;
  place_type: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  contact_name: string | null;
  contact_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlaceCreate {
  name: string;
  place_type?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  contact_name?: string;
  contact_phone?: string;
  notes?: string;
}

export interface DocRecord {
  id: number;
  vehicle_id: number | null;
  title: string;
  document_type: string;
  file_name: string | null;
  file_url: string | null;
  expiry_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocCreate {
  vehicle_id?: number;
  title: string;
  document_type: string;
  file_name?: string;
  file_url?: string;
  expiry_date?: string;
  status?: string;
  notes?: string;
}

export interface PreInspection {
  id: number;
  vehicle_id: number;
  inspection_date: string;
  inspector_name: string;
  engine_condition: number;
  body_condition: number;
  tire_condition: number;
  electrical_condition: number;
  emissions_passed: boolean;
  overall_rating: number;
  notes: string | null;
  passed: boolean;
  created_at: string;
}

export interface PreInspectionCreate {
  vehicle_id: number;
  inspection_date: string;
  inspector_name: string;
  engine_condition: number;
  body_condition: number;
  tire_condition: number;
  electrical_condition: number;
  emissions_passed: boolean;
  overall_rating: number;
  notes?: string;
  passed: boolean;
}

export interface PostInspection {
  id: number;
  vehicle_id: number;
  inspection_date: string;
  inspector_name: string;
  customs_clearance_passed: boolean;
  documentation_complete: boolean;
  safety_inspection_passed: boolean;
  roadworthiness_passed: boolean;
  compliance_passed: boolean;
  overall_rating: number;
  notes: string | null;
  passed: boolean;
  created_at: string;
}

export interface PostInspectionCreate {
  vehicle_id: number;
  inspection_date: string;
  inspector_name: string;
  customs_clearance_passed: boolean;
  documentation_complete: boolean;
  safety_inspection_passed: boolean;
  roadworthiness_passed: boolean;
  compliance_passed: boolean;
  overall_rating: number;
  notes?: string;
  passed: boolean;
}

export interface Summary {
  total_vehicles: number;
  pending: number;
  pre_inspection: number;
  in_transit: number;
  post_inspection: number;
  cleared: number;
  rejected: number;
}

// --- HTTP helper ---

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

function crud<T, C>(prefix: string) {
  return {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<T[]>(`${prefix}/${qs}`);
    },
    get: (id: number) => request<T>(`${prefix}/${id}`),
    create: (data: C) => request<T>(`${prefix}/`, { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<C>) => request<T>(`${prefix}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`${prefix}/${id}`, { method: "DELETE" }),
  };
}

export interface RolePermission {
  id: number;
  name: string;
  description: string | null;
  module: string;
  created_at: string;
}

export interface RoleRecord {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  permissions: RolePermission[];
  created_at: string;
  updated_at: string;
}

export interface RoleCreate {
  name: string;
  description?: string;
  is_active?: boolean;
  permission_ids?: number[];
}

export const api = {
  vehicles: crud<Vehicle, VehicleCreate>("/api/vehicles"),
  preInspections: crud<PreInspection, PreInspectionCreate>("/api/pre-inspections"),
  postInspections: crud<PostInspection, PostInspectionCreate>("/api/post-inspections"),
  tools: crud<Tool, ToolCreate>("/api/tools"),
  inspections: crud<Inspection, InspectionCreate>("/api/inspections"),
  issues: crud<Issue, IssueCreate>("/api/issues"),
  reminders: crud<Reminder, ReminderCreate>("/api/reminders"),
  services: crud<ServiceEntry, ServiceCreate>("/api/services"),
  contacts: crud<Contact, ContactCreate>("/api/contacts"),
  vendors: crud<Vendor, VendorCreate>("/api/vendors"),
  parts: crud<Part, PartCreate>("/api/parts"),
  places: crud<Place, PlaceCreate>("/api/places"),
  documents: crud<DocRecord, DocCreate>("/api/documents"),

  roles: crud<RoleRecord, RoleCreate>("/api/roles"),
  permissions: {
    list: () => request<RolePermission[]>("/api/permissions/"),
    get: (id: number) => request<RolePermission>(`/api/permissions/${id}`),
  },

  reports: {
    summary: () => request<Summary>("/api/reports/summary"),
    vehiclesByStatus: () => request<{ status: string; count: number }[]>("/api/reports/vehicles-by-status"),
    vehiclesByOrigin: () => request<{ country: string; count: number }[]>("/api/reports/vehicles-by-origin"),
    inspectionRates: () => request<Record<string, unknown>>("/api/reports/inspection-rates"),
    issuesSummary: () => request<Record<string, unknown>>("/api/reports/issues-summary"),
    serviceSummary: () => request<Record<string, unknown>>("/api/reports/service-summary"),
    remindersSummary: () => request<Record<string, unknown>>("/api/reports/reminders-summary"),
  },
};
