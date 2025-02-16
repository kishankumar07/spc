/* Checkout UI in Next.js 13+ (App Router) */

"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, CreditCard, CheckCircle, CircleX, SquarePlus, SquareMinus, MapPinHouse } from "lucide-react";
import { useCartStore } from "@/store/cart";
import Image from 'next/image'
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";


const stripePromise = loadStripe("pk_test_51QslIsC14JO60O3iErLkjrcPGJ8B8e7iOGFUHoOD92DVDQOmWAMafusG0RapoUnGFnQ1lujRvNvOXBseTq7HMEzg00c2QUuBpZ");



function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Get clientSecret from the API
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 20 }), // Change amount as needed
      });

      const { clientSecret, error } = await response.json();

      if (!clientSecret) {
        setError(error || "Failed to fetch client secret.");
        setLoading(false);
        return;
      }

      // Confirm payment using the client secret
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed.");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess(); // Move to confirmation step
      }
    } catch (err) {
      setError("An error occurred during payment.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-center">Enter Card Details</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Card Details */}
        <div className="p-4 border rounded-lg bg-gray-50 shadow-sm flex flex-col">
          <label className="font-medium text-gray-700 mb-2">Card Information</label>
          <CardElement
            className="p-3 bg-white border rounded-md w-full focus:ring-2 focus:ring-blue-400 transition"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#333",
                  "::placeholder": { color: "#888" },
                },
                invalid: { color: "#FF0000" },
              },
            }}
          />
        </div>

        {/* Step 2: Submit Button */}
        <div className="mt-4">
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
}


// ----------- payment form ends here







export default function Checkout() {

  const router = useRouter()
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (step === 4) {
      useCartStore.getState().clearCart(); // ✅ Automatically clear the cart when payment is successful
    }
  }, [step]); // Add step as dependency to ensure it runs when step changes
  const cartStore = useCartStore();
  const [loading, setLoading] = useState(true); // Track client loading state

  useEffect(() => {
    cartStore.fetchCart().then(() => setLoading(false)); // Ensure data is fetched before rendering
  }, []);

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
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">


        {/* Step Indicator */}
        <div className="flex justify-between mb-6 text-gray-500">
          {["Cart", "Shipping", "Payment", "Confirmation"].map((label, index) => (
            <div key={index} className={`flex flex-col items-center ${step > index ? "text-green-600" : "text-gray-400"}`}>
              {[
                <ShoppingCart key="cart" />,
                <MapPinHouse key="shipping" />,
                <CreditCard key="payment" />,
                <CheckCircle key="confirmation" />
              ][index]}
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
            <button className="mt-4 w-full bg-orange-600 text-white px-4 py-2 rounded-lg" onClick={()=>router.push('/products')}>Click to go back</button>
          </motion.div>
        )}

{step === 2 && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
    <p className="text-gray-600">Enter your shipping details.</p>

    <input
      type="text"
      placeholder="Enter your address"
      value={cartStore.address}
      onChange={(e) => cartStore.setAddress(e.target.value)}
      className="w-full border rounded-lg p-2 mt-4"
    />

    <button
      onClick={() => setStep(3)}
      className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
      disabled={!cartStore.address.trim()} // ✅ Prevent empty addresses
    >
      Proceed to Payment
    </button>
    <button className="mt-4 w-full bg-orange-600 text-white px-4 py-2 rounded-lg" onClick={()=>router.push('/products')}>Cancel</button>
  </motion.div>
)}


{/*------------- Payment area - both COD and online payment */}
{step === 3 && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
    <div className="space-y-4">
      <div className="border p-4 rounded-lg cursor-pointer flex items-center gap-4" onClick={() => cartStore.setPaymentMethod('COD')}>
        <input type="radio" checked={cartStore.selectedPaymentMethod === 'COD'} readOnly />
        <span className="font-semibold">Cash on Delivery (COD)</span>
      </div>
      <div className="border p-4 rounded-lg cursor-pointer flex items-center gap-4" onClick={() => cartStore.setPaymentMethod('Stripe')}>
        <input type="radio" checked={cartStore.selectedPaymentMethod === 'Stripe'} readOnly />
        <span className="font-semibold">Pay with Card (Stripe)</span>
      </div>
    </div>
    {cartStore.selectedPaymentMethod === 'Stripe' && (
      <div className="mt-4 p-4 border rounded-lg bg-gray-100">
        <Elements stripe={stripePromise}>
          <PaymentForm onSuccess={() => setStep(4)} />
        </Elements>
      </div>
    )}

<button className="mt-4 w-full bg-orange-600 text-white px-4 py-2 rounded-lg" onClick={()=>router.push('/products')}>Cancel</button>


    {/* This button is a confusion------------------------- */}


    {/* <button
      onClick={() => cartStore.selectedPaymentMethod === 'COD' ? setStep(4) : null}
      className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
      disabled={!cartStore.selectedPaymentMethod}
    >
      Confirm Payment
    </button> */}
  </motion.div>
)}
 

 {/*----------------- Success area------------------------------- */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-semibold mb-4 text-green-600">Payment Successful!</h2>
            <p className="text-gray-600">Thank you for your purchase.</p>
            <button 
      onClick={() => {
        useCartStore.getState().clearCart(); // Clear the cart
        setStep(1); // Reset checkout steps
      }} 
      className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg"
    >
      Go Back
    </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
