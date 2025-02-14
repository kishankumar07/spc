"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const { isLoggedIn, logIn } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

   // Use useEffect to redirect once logged in
   useEffect(() => {
    if (isLoggedIn) {
      router.push("/products");
    }
  }, [isLoggedIn, router]);


  const handleLogin = async() => {
      try {
        await logIn(email,password);
        await Swal.fire({
                  title: "Success",
                  text: "Logged In Successfully",
                  icon: "success",
                  showConfirmButton:true,
                });

      } catch (error) {
         Swal.fire("Error", error.message || "Something went wrong", "error");
      }


    
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <button onClick={() => router.push("/register")} className="text-blue-600 hover:underline">Register</button>
        </div>
      </div>
    </div>
  );
}
