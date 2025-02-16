"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
      if (password !== confirmPassword) {
        Swal.fire("Error", "Passwords do not match", "error");
        return;
      }
  
      try {
        // Call signUp method from Zustand store, passing email and password
        await signUp(email, password);
  
        Swal.fire("Success", "Account created successfully. You are now logged in.", "success");
        router.push("/products"); // Redirect after successful sign-up
      } catch (error) {
        Swal.fire("Error", (error as Error).message || "Something went wrong", "error");
      }
    };
  

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
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
        <div className="mb-4">
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
        <div className="mb-6">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Confirm your password"
          />
        </div>
        <button
          onClick={handleSignUp}
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          Sign Up
        </button>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <button onClick={() => router.push("/login")} className="text-blue-600 hover:underline">Login</button>
        </div>
      </div>
    </div>
  );
}
