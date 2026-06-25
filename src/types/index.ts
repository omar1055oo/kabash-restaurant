export interface Category {
  id: string;
  name: string;
  sort_order?: number;
}

export interface ProductSize {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string;
  is_available: boolean;
  sizes: ProductSize[];
}

export interface CustomerProfile {
  id?: string;
  full_name: string;
  main_address: string;
  secondary_address?: string;
  primary_phone: string;
  secondary_phone?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  size_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id?: string;
  customer_phone: string; // Used as the identifier for now instead of auth user_id
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  customer_details: CustomerProfile;
  notes?: string;
  city?: string;
  area?: string;
  created_at?: string;
  items: OrderItem[];
}
