import { useState, useEffect, createContext, useContext, ReactNode } from "react";

export type CartItem = {
  cart_id: string;
  product_id: string;
  product_name: string;
  size_id: string;
  size_name: string;
  quantity: number;
  unit_price: number;
  image_url: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cart_id">) => void;
  updateQuantity: (cart_id: string, quantity: number) => void;
  removeItem: (cart_id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "cart_id">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product_id === newItem.product_id && i.size_id === newItem.size_id,
      );
      if (existing) {
        return prev.map((i) =>
          i.cart_id === existing.cart_id ? { ...i, quantity: i.quantity + newItem.quantity } : i,
        );
      }
      const cartId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

      return [...prev, { ...newItem, cart_id: cartId }];
    });
  };

  const updateQuantity = (cart_id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.cart_id === cart_id ? { ...i, quantity: Math.max(1, quantity) } : i)),
    );
  };

  const removeItem = (cart_id: string) => {
    setItems((prev) => prev.filter((i) => i.cart_id !== cart_id));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
