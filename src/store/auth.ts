import { create } from "zustand";

interface AuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  signUp: (email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
}

// Function to safely retrieve the auth state from localStorage
const getInitialAuthState = () => {
  
    return JSON.parse(localStorage.getItem("isLoggedIn") || "false");
};


export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: getInitialAuthState(),
  login: () => {
    set({ isLoggedIn: true });
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
  },
  logout: () => {
    set({ isLoggedIn: false });
    localStorage.removeItem("isLoggedIn"); // Remove auth state from localStorage
  },

  signUp: async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.message === "User created successfully") {
        set({ isLoggedIn: true });

        // To save the isLoggedIn value in localStorage
        localStorage.setItem("isLoggedIn",JSON.stringify(true))
      } else {
        throw new Error(data.message || "Failed to create user");
      }
    } catch (error: any) {
      throw new Error(error.message || "Something went wrong");
    }
  },

  logIn: async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.message === "Login successful") {
        set({ isLoggedIn: true });

        // setting isLoggedIn value in localStorage
        localStorage.setItem("isLoggedIn",JSON.stringify(true))
      } else {
        throw new Error(data.message || "Failed to log in");
      }
    } catch (error: any) {
      throw new Error(error.message || "Something went wrong");
    }
  },
}));
