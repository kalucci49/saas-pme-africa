export type Product = {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  tax_rate: number;
  track_inventory: boolean;
  is_active: boolean;
  image_url: string | null;
  warranty: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductInput = {
  name: string;
  description?: string;
  category?: string;
  price: number;
  tax_rate: number;
  is_active?: boolean;
  image_url?: string;
  warranty?: string;
};
