import { Category, Product, CustomerProfile, Order, ProductSize } from "../types";
import { supabase } from "../lib/supabase";

// --- Service Layer ---

export const AuthService = {
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },
  async signOut() {
    return supabase.auth.signOut();
  },
  async getSession() {
    return supabase.auth.getSession();
  },
  async getUserRole() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return null;
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();
    return data?.role as string | null;
  },
};

export const MenuService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
    return data as Category[];
  },

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*, sizes:product_sizes(*)")
      .eq("category_id", categoryId)
      .eq("is_available", true);

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    return data as Product[];
  },

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*, sizes:product_sizes(*)")
      .eq("is_available", true);

    if (error) {
      console.error("Error fetching all products:", error);
      return [];
    }
    return data as Product[];
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*, sizes:product_sizes(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Error fetching product:", error);
      return null;
    }
    return data as Product;
  },
};

export const CustomerService = {
  async saveProfile(profile: CustomerProfile): Promise<void> {
    let customerId = profile.id;

    if (profile.primary_phone) {
      // Try to find existing profile
      const { data: existing } = await supabase
        .from("customer_profiles")
        .select("id")
        .eq("primary_phone", profile.primary_phone)
        .maybeSingle();

      if (existing) {
        customerId = existing.id;
        // Update
        const { error } = await supabase
          .from("customer_profiles")
          .update({
            full_name: profile.full_name,
            main_address: profile.main_address,
            secondary_address: profile.secondary_address,
            secondary_phone: profile.secondary_phone,
          })
          .eq("id", customerId);

        if (error) console.error("Error updating profile", error);
      }
    }

    if (!customerId) {
      customerId = crypto.randomUUID();
      // Insert
      const { error } = await supabase.from("customer_profiles").insert({
        id: customerId,
        full_name: profile.full_name,
        main_address: profile.main_address,
        secondary_address: profile.secondary_address,
        primary_phone: profile.primary_phone,
        secondary_phone: profile.secondary_phone,
      });

      if (error) console.error("Error inserting profile", error);
    }

    const updatedProfile = { ...profile, id: customerId };
    localStorage.setItem("customerProfile", JSON.stringify(updatedProfile));
  },

  async getProfile(): Promise<CustomerProfile | null> {
    const saved = localStorage.getItem("customerProfile");
    if (!saved) return null;
    try {
      return JSON.parse(saved) as CustomerProfile;
    } catch {
      return null;
    }
  },
};

export const OrderService = {
  async createOrder(order: Order): Promise<{ id: string }> {
    const orderId = crypto.randomUUID();

    let customerId = order.customer_details.id;

    // Check by phone if no ID is provided, to reuse profile
    if (!customerId && order.customer_details.primary_phone) {
      const { data: existing } = await supabase
        .from("customer_profiles")
        .select("id")
        .eq("primary_phone", order.customer_details.primary_phone)
        .maybeSingle();

      if (existing) {
        customerId = existing.id;
      }
    }

    if (!customerId) {
      customerId = crypto.randomUUID();
      // Insert inline if not exists (in case saveProfile wasn't called)
      const { error } = await supabase.from("customer_profiles").insert({
        id: customerId,
        full_name: order.customer_details.full_name,
        main_address: order.customer_details.main_address,
        secondary_address: order.customer_details.secondary_address,
        primary_phone: order.customer_details.primary_phone,
        secondary_phone: order.customer_details.secondary_phone,
      });
      if (error) {
        console.error("Error inserting profile inline:", error);
      }
    }

    // Insert order
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      customer_id: customerId,
      status: order.status || "pending",
      subtotal: order.subtotal,
      delivery_fee: order.delivery_fee,
      total_amount: order.total_amount,
      notes: order.notes,
      city: order.city,
      area: order.area,
    });

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw orderError;
    }

    // Insert order items
    if (order.items && order.items.length > 0) {
      const orderItems = order.items.map((item) => ({
        id: crypto.randomUUID(),
        order_id: orderId,
        product_id: item.product_id,
        product_name: item.product_name,
        size_name: item.size_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        throw itemsError;
      }
    }

    return { id: orderId };
  },
};

export const AdminService = {
  async getCategories() {
    return supabase.from("categories").select("*").order("sort_order", { ascending: true });
  },
  async createCategory(category: Partial<Category>) {
    return supabase.from("categories").insert(category).select().single();
  },
  async updateCategory(id: string, category: Partial<Category>) {
    return supabase.from("categories").update(category).eq("id", id).select().single();
  },
  async deleteCategory(id: string) {
    return supabase.from("categories").delete().eq("id", id);
  },
  async getProducts() {
    return supabase
      .from("products")
      .select("*, sizes:product_sizes(*)")
      .order("created_at", { ascending: false });
  },
  async createProduct(product: Partial<Product>) {
    return supabase.from("products").insert(product).select().single();
  },
  async updateProduct(id: string, product: Partial<Product>) {
    return supabase.from("products").update(product).eq("id", id).select().single();
  },
  async deleteProduct(id: string) {
    return supabase.from("products").delete().eq("id", id);
  },
  async createProductSize(size: Partial<ProductSize>) {
    return supabase.from("product_sizes").insert(size).select().single();
  },
  async updateProductSize(id: string, size: Partial<ProductSize>) {
    return supabase.from("product_sizes").update(size).eq("id", id).select().single();
  },
  async deleteProductSize(id: string) {
    return supabase.from("product_sizes").delete().eq("id", id);
  },
};
