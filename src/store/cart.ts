import { create } from "zustand";
import { useAuthStore } from "./auth";

interface CartItem {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

// This one defines the structure of the cart (Zustand) store.
interface CartState {
  cartItems: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: ( product: CartItem ) => Promise<void>;
  removeFromCart: ( productId: number ) => Promise<void>;
  
}

export const useCartStore = create<CartState>((set,get) => ({
  // this below variable cartItems get filled with what all cart items this user has 
  cartItems: [],

  fetchCart: async () => {
    if (typeof window === "undefined") return; // Prevents SSR issues
  
    const { userId } = useAuthStore.getState();
    if (!userId) return;
  
    try {
      const res = await fetch("/api/cart/get", {
        method: "POST",
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
  
      set({ cartItems: data.items || [] });
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  },
  

  addToCart: async ( product ) => {

    const { userId } = useAuthStore.getState();
    if(!userId) return;


    await fetch("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ userId, product }),
    });
    set((state) => ({
      cartItems: [...state.cartItems, { ...product, quantity: 1 }],
    }));
  },

  removeFromCart: async ( productId ) => {

    const { userId } = useAuthStore.getState();
    if(!userId) return;

    await fetch("/api/cart/remove", {
      method: "POST",
      body: JSON.stringify({ userId, productId }),
    });
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.productId !== productId),
    }));
  },

}));
