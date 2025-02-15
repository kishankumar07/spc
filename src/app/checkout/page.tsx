/* Checkout UI in Next.js 13+ (App Router) */

"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, CreditCard, CheckCircle, CircleX, SquarePlus, SquareMinus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import Image from 'next/image'

export default function Checkout() {
  const [step, setStep] = useState(1);
  const cartStore = useCartStore();
  const [loading, setLoading] = useState(true); // Track client loading state

  useEffect(() => {
    cartStore.fetchCart().then(() => setLoading(false)); // Ensure data is fetched before rendering
  }, [cartStore]);

  const handleIncrease = (productId:number) =>{
    cartStore.updateCartItemQuantity(productId,1);
  };

  const handleDecrease = (productId:number, quantity:number) =>{
    if(quantity > 1) {
      cartStore.updateCartItemQuantity(productId, -1);
    }else{
      cartStore.removeFromCart(productId);
    }
  }

  // Calculate total price of the cart
  const calculateTotal = useCallback(() => {
    return cartStore.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }, [cartStore.cartItems]);

  // Calculate shipping fee
  const calculateShippingFee = useMemo(() => {
    return calculateTotal() < 50 ? 5 : 0;
  }, [cartStore.cartItems]); // Add cartItems as dependency

  // Total Calculation (include shipping fee)
  const calculateFinalTotal = useMemo(() => {
    return (calculateTotal() + calculateShippingFee).toFixed(2);
  }, [calculateTotal, calculateShippingFee]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading cart...</p>
      </div>
    );
  }

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
            {cartStore.cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartStore.cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between border-b pb-2">
                    <Image src={item.thumbnail} alt={item.title} width={60} height={60} className="rounded" />
                    <div className="flex-1 ml-4">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-gray-600">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-2 rounded" onClick={() => handleDecrease(item.productId, item.quantity)}>
                        <SquareMinus />
                      </button>
                      <span className="text-xl font-bold">{item.quantity}</span>
                      <button className="px-2 rounded" onClick={() => handleIncrease(item.productId)}>
                        <SquarePlus />
                      </button>
                    </div>
                    <div className="ml-4 flex items-center">

                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>

                    </div>
                    <button onClick={() => cartStore.removeFromCart(item.productId)}>
                      <CircleX size={20} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Total Price Calculation */}
            
            {cartStore.cartItems.length > 0 && (
  <>
    <div className="mt-10 flex justify-between font-semibold">
      <span className="text-2xl">Shipping Fee:</span>
      <span className="text-2xl">${calculateShippingFee}</span>
    </div>
    <div className="mt-4 flex justify-between font-semibold">
      <span className="text-3xl">Total:</span>
      <span className="text-3xl">${parseFloat(calculateFinalTotal).toFixed(2)}</span>
    </div>
  </>
)}



            <button
              onClick={() => setStep(2)}
              className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={cartStore.cartItems.length === 0}
            >
              Proceed to Payment
            </button>
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
