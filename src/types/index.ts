// ============================================
// TYPES GLOBAUX - Base de données
// ============================================

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  currency: string;
  country: string;
  date_format: string;
  invoice_prefix: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  organization_id: string;
  full_name: string;
  avatar_url?: string;
  language: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  invited_at: string;
  joined_at?: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout';
  entity_type: string;
  entity_id: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Notification {
  id: string;
  organization_id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  link?: string;
  created_at: string;
}

// ============================================
// TYPES - Dépenses (Phase 2)
// ============================================

export interface Expense {
  id: string;
  organization_id: string;
  supplier_id?: string;
  category_id: string;
  amount: number;
  description: string;
  date: string;
  receipt_url?: string;
  status: 'draft' | 'submitted' | 'approved' | 'paid';
  created_at: string;
  updated_at: string;
  category?: ExpenseCategory;
  supplier?: Supplier;
}

export interface ExpenseCategory {
  id: string;
  organization_id: string;
  name: string;
  budget_limit?: number;
  color: string;
  icon: string;
  created_at: string;
}

export interface CreateExpenseDto {
  supplier_id?: string;
  category_id: string;
  amount: number;
  description: string;
  date: string;
  receipt_file?: File;
}

// ============================================
// TYPES - Fournisseurs (Phase 2 & 14.2)
// ============================================

export interface Supplier {
  id: string;
  organization_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  category?: string;
  rating?: number;
  notes?: string;
  total_purchases: number;
  total_paid: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface SupplierTransaction {
  id: string;
  supplier_id: string;
  type: 'purchase' | 'payment' | 'credit_note';
  amount: number;
  date: string;
  reference_id: string;
  reference_type: 'purchase_order' | 'invoice' | 'payment';
  description: string;
  created_at: string;
}

// ============================================
// TYPES - Projets (Phase 6 & 14.6)
// ============================================

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  client_id?: string;
  status: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  budget: number;
  start_date: string;
  end_date?: string;
  progress: number;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectExpense {
  id: string;
  project_id: string;
  expense_id: string;
  allocated_amount: number;
  notes?: string;
  created_at: string;
}

export interface ProjectInvoice {
  id: string;
  project_id: string;
  invoice_id: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid';
  created_at: string;
}

// ============================================
// TYPES - Stock (Phase 14.1)
// ============================================

export interface Product {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category_id: string;
  unit: string;
  purchase_price: number;
  selling_price: number;
  current_stock: number;
  min_stock: number;
  max_stock?: number;
  location?: string;
  track_inventory: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference_id?: string;
  reference_type?: 'purchase_order' | 'invoice' | 'inventory_adjustment';
  created_at: string;
  user_id: string;
  user?: Profile;
}

export interface InventoryAdjustment {
  id: string;
  product_id: string;
  previous_quantity: number;
  new_quantity: number;
  reason: string;
  created_at: string;
  user_id: string;
}

// ============================================
// TYPES - Immobilier (Phase 5)
// ============================================

export interface Property {
  id: string;
  organization_id: string;
  name: string;
  type: 'apartment' | 'house' | 'office' | 'commercial' | 'land';
  address: string;
  surface_area: number;
  bedrooms?: number;
  bathrooms?: number;
  rent_amount: number;
  deposit_amount?: number;
  status: 'available' | 'occupied' | 'under_maintenance';
  description?: string;
  photos: string[];
  owner_name?: string;
  owner_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  id_card_number?: string;
  address?: string;
  emergency_contact?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Lease {
  id: string;
  organization_id: string;
  property_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  deposit_paid: boolean;
  deposit_amount: number;
  payment_frequency: 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'expired' | 'terminated' | 'renewed';
  notes?: string;
  created_at: string;
  updated_at: string;
  property?: Property;
  tenant?: Tenant;
}

export interface RentPayment {
  id: string;
  lease_id: string;
  due_date: string;
  paid_date?: string;
  amount: number;
  late_fee?: number;
  status: 'pending' | 'paid' | 'late' | 'waived';
  payment_id?: string;
  notes?: string;
  lease?: Lease;
}

// ============================================
// TYPES - IA Control Center (Phase 14.7)
// ============================================

export interface AIInsight {
  id: string;
  organization_id: string;
  type: 'overdue_invoice' | 'low_stock' | 'budget_alert' | 'lease_expiring' | 'project_risk' | 'cash_flow_alert';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  action: string;
  target_id?: string;
  resolved: boolean;
  created_at: string;
  resolved_at?: string;
}

export interface AIRecommendation {
  id: string;
  organization_id: string;
  type: 'increase_price' | 'reorder_stock' | 'follow_up_client' | 'optimize_budget' | 'renew_lease';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  estimated_gain?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  created_at: string;
}

export default { Organization, Profile, OrganizationMember, AuditLog, Notification };
