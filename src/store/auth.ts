import { create } from "zustand";

// FYI - isLoggedIn will be true and userId will be having a value only when the user is loggedin or signup.
//- once loggedout isLoggedIn will be false and userId will be null.

// The overall interfaces generally for all items in the auth zustand store
interface AuthStore {
  isLoggedIn: boolean;
  userId: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => void;
}



// Function to safely retrieve the auth state from localStorage
//Also need to check its meaning later.
const getInitialAuthState = () => {
  if (typeof window !== "undefined") {
    return {
      isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn") || "false"),
      userId: localStorage.getItem("userId") || null,
    };
  }
  return { isLoggedIn: false, userId: null };
};



// Defining the store
export const useAuthStore = create<AuthStore>((set) => ({
   ...getInitialAuthState(),
 
   //In signup, the user once created, their userId created and isLoggedIn is set in the Zustand store and also in Localstorage.
   signUp: async (email, password) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.message === "User created successfully" && data.userId) {
        set({ isLoggedIn: true, userId: data.userId });

        // Store in localStorage
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("userId", data.userId);
      } else {
        throw new Error(data.message || "Failed to create user");
      }
    } catch (error: any) {
      throw new Error(error.message || "Something went wrong");
    }
  },
// In login ; email and password will be sent through the body, finally the isLoggedIn and userId of the user will be stored in localStorage as well as in Zustand store.
  logIn: async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.message === "Login successful" && data.userId) {
        set({ isLoggedIn: true, userId: data.userId });

        // Store in localStorage
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("userId", data.userId);
      } else {
        throw new Error(data.message || "Failed to log in");
      }
    } catch (error: any) {
      throw new Error(error.message || "Something went wrong");
    }
  },

  logOut: () => {
    set({ isLoggedIn: false, userId: null });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
  },
})
)
