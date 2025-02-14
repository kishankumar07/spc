/* Checkout UI in Next.js 13+ (App Router) */

"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, CreditCard, CheckCircle } from "lucide-react";

export default function Checkout() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {["Cart", "Payment", "Confirmation"].map((label, index) => (
            <div key={index} className={`flex flex-col items-center ${step > index ? "text-green-600" : "text-gray-400"}`}>
              {index === 0 && <ShoppingCart size={24} />}
              {index === 1 && <CreditCard size={24} />}
              {index === 2 && <CheckCircle size={24} />}
              <span className="mt-1 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Checkout Steps */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
            <p className="text-gray-600">Review your items before proceeding.</p>
            <button onClick={() => setStep(2)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">Proceed to Payment</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <p className="text-gray-600">Enter your payment details securely.</p>
            <button onClick={() => setStep(3)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">Confirm Payment</button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-semibold mb-4 text-green-600">Payment Successful!</h2>
            <p className="text-gray-600">Thank you for your purchase.</p>
            <button onClick={() => setStep(1)} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg">Go Back</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
