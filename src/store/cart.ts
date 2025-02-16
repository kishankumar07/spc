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
  updateCartItemQuantity:(productId:number, change:number) => Promise<void>;
  address: string;
  setAddress: (newAddress: string) => void;
  selectedPaymentMethod: "COD" | "Stripe" | null;
  setPaymentMethod : (method: "COD" | "Stripe") => void;
  clearCart : () => void;
}

export const useCartStore = create<CartState>((set) => ({
  // this below variable cartItems get filled with what all cart items this user has 
  cartItems: [],
  address: "",
  setAddress: (newAddress: string) => set({ address: newAddress }),

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
  updateCartItemQuantity: async (productId, change) => {
    const { userId } = useAuthStore.getState();
    if (!userId) return;
  
    await fetch("/api/cart/update", {
      method: "POST",
      body: JSON.stringify({ userId, productId, change }),
    });
  
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + change } : item
      ).filter(item => item.quantity > 0) // Remove if quantity is 0
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
  selectedPaymentMethod: null,
  setPaymentMethod: (method) => set(()=>({selectedPaymentMethod: method})),

  clearCart: async () => {
  const { userId } = useAuthStore.getState();
  if (!userId) return;

  try {
    await fetch("/api/cart/clear", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    
    set(() => ({ cartItems: [], address: "", selectedPaymentMethod: null }));
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
},


}));
