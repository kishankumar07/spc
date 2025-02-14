"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function Header() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuthStore();

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white">
      {/* Logo */}
      <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        Under Progress!! (Thank you for your patience)
      </div>

      {/* Right Side: Login & Cart */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
              <ShoppingCart size={24} />
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="flex items-center gap-2 border px-3 py-1 rounded-md hover:bg-gray-100"
            >
              <LogOut size={20} />
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 border px-3 py-1 rounded-md hover:bg-gray-100"
          >
            <User size={20} />
            Login
          </button>
        )}
      </div>
    </header>
  );
}
