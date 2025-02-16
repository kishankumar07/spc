/* Checkout UI in Next.js 13+ (App Router) */

"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  CreditCard,
  CheckCircle,
  CircleX,
  SquarePlus,
  SquareMinus,
  MapPinHouse,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { stripePromise } from "@/utility/stripe";
import Swal from "sweetalert2";

// Payment form for Stripe starts here----------------
function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardBrand, setCardBrand] = useState<string | null>(null);

  // Handle card brand detection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCardChange = (event: any) => {
    console.log("Card brand detected:", event.brand);
    setCardBrand(event.brand);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or Elements are not initialized");
      return;
    }

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

      const cardNumberElement = elements.getElement(CardNumberElement);
      const expiryElement = elements.getElement(CardExpiryElement);
      const cvcElement = elements.getElement(CardCvcElement);

      if (!cardNumberElement) {
        setError("cardNumberElement element not found.");
        setLoading(false);
        return;
      }
      if (!expiryElement) {
        setError("expiryElement element not found.");
        setLoading(false);
        return;
      }
      if (!cvcElement) {
        setError("cvcElement element not found.");
        setLoading(false);
        return;
      }

      // Confirm payment using the client secret
      const { paymentIntent, error: stripeError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: "Kishan.ta",
            },
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

  const defaultCardLogo =
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Credit_card_font_awesome.svg"; // Generic card icon

  // Get card brand logo dynamically
  const getCardBrandLogo = (brand: string | null) => {
    switch (brand) {
      case "visa":
        return "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg";
      case "mastercard":
        return "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg";
      case "amex":
        return defaultCardLogo;
      case "discover":
        return defaultCardLogo;
      default:
        return defaultCardLogo;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto border border-gray-200">
      <h3 className="text-sm sm:text-lg font-semibold mb-4 text-center">
        Enter Card Details
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div className="p-4 border rounded-lg bg-gray-50 shadow-sm relative">
          <label className="font-medium text-gray-700 mb-2 text-sm sm:text-lg">
            Card Number
          </label>
          <div className="relative">
            <CardNumberElement
              className="p-3 bg-white border rounded-md w-full pr-12"
              options={{
                style: {
                  base: { fontSize: "13px", color: "#333" },
                },
              }}
              onChange={handleCardChange}
            />
            {cardBrand && (
              <Image
                src={getCardBrandLogo(cardBrand) || defaultCardLogo}
                alt={cardBrand || "Card brand logo"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6"
                width={24}
                height={24}
              />
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p className="font-medium">Test Card Numbers (for Stripe Demo):</p>
            <ul className="list-disc pl-5">
              <li>
                Visa: <span className="font-mono">4242 4242 4242 4242</span>
              </li>
              <li>
                Mastercard:{" "}
                <span className="font-mono">5555 5555 5555 4444</span>
              </li>
              <li>
                Amex: <span className="font-mono">3782 822463 10005</span>
              </li>
              <li>
                Discover: <span className="font-mono">6011 1111 1111 1117</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Expiry Date */}
        <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
          <label className="font-medium text-gray-700 mb-2 text-sm sm:text-lg">
            Expiry Date
          </label>
          <CardExpiryElement
            className="p-3 bg-white border rounded-md w-full"
            options={{
              style: {
                base: { fontSize: "13px", color: "#333" },
              },
            }}
          />

          <div className="mt-2 text-xs text-gray-500">
            <p className="font-medium">
              Please provide a future date (for Stripe Demo):
            </p>
          </div>
        </div>

        {/* CVC */}
        <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
          <label className="font-medium text-gray-700 mb-2 text-sm sm:text-lg">
            CVC
          </label>
          <CardCvcElement
            className="p-3 bg-white border rounded-md w-full"
            options={{
              style: {
                base: { fontSize: "13px", color: "#333" },
              },
            }}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 sm:text-sm text-xs"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ----------- payment form ends here==========

// The loading component for UX------------------
const LoadingComponent = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div> {/* Custom Spinner */}
      </div>
    );
  }
  return null; // No loader if loading is false
};

// ------- Loading component ends here----------------

export default function Checkout() {
  const router = useRouter();
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

  const handleIncrease = (productId: number) => {
    cartStore.updateCartItemQuantity(productId, 1);
  };

  const handleDecrease = (productId: number, quantity: number) => {
    if (quantity > 1) {
      cartStore.updateCartItemQuantity(productId, -1);
    } else {
      cartStore.removeFromCart(productId);
    }
  };

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
  }, [calculateTotal]); // Add cartItems as dependency

  // Total Calculation (include shipping fee)
  const calculateFinalTotal = useMemo(() => {
    return (calculateTotal() + calculateShippingFee).toFixed(2);
  }, [calculateTotal, calculateShippingFee]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <p>Loading cart...</p>
  //     </div>
  //   );
  // }

  return (
    <>
      {/* Show loading spinner if loading is true */}
      <LoadingComponent loading={loading} />

      {/* The above spinner is shown only initially, rest of them below is just the UI of checkout page */}

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl w-full max-w-full sm:max-w-3xl">
          {/* Step Indicator */}
          <div className="flex justify-between mb-6 text-gray-500">
            {["Cart", "Shipping", "Payment", "Confirmed"].map(
              (label, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center  ${
                    step > index ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {
                    [
                      <ShoppingCart key="cart" className="size-4 sm:size-6" />,
                      <MapPinHouse
                        key="shipping"
                        className="size-4 sm:size-6"
                      />,
                      <CreditCard key="payment" className="size-4 sm:size-6" />,
                      <CheckCircle
                        key="confirmation"
                        className="size-4 sm:size-6"
                      />,
                    ][index]
                  }
                  <span className="mt-1 text-xs sm:text-sm font-medium">
                    {label}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Checkout Steps */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-md sm:text-xl font-semibold ">Your Cart</h2>
              {cartStore.cartItems.length === 0 ? (
                <p className="text-gray-600 sm:text-xl font-semi-bold mb-4">
                  Your cart is empty.
                </p>
              ) : (
                <div className="space-y-2 sm:space-y-4">
                  {cartStore.cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between border-b pb-2 sm:space-x-4"
                      style={{ height: "90px" }}
                    >
                      {/* Image of each product */}
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={60}
                        height={60}
                        className="rounded object-cover sm:block hidden"
                      />

                      <div className="flex-1 ">
                        <p className="font-semibold sm:text-sm text-xs">
                          {item.title}
                        </p>
                        <p className="text-gray-600 sm:text-sm text-xs sm:mt-0 mt-2">
                          ${item.price}
                        </p>
                      </div>

                      {/* Quantity control buttons */}
                      <div className="flex items-center sm:gap-2">
                        <button
                          className="px-2 rounded"
                          onClick={() =>
                            handleDecrease(item.productId, item.quantity)
                          }
                        >
                          <SquareMinus className="sm:size-5 size-4" />
                        </button>
                        <span className="sm:text-sm font-bold text-xs">
                          {item.quantity}
                        </span>
                        <button
                          className="px-2 rounded"
                          onClick={() => handleIncrease(item.productId)}
                        >
                          <SquarePlus className="sm:size-5 size-4" />
                        </button>
                      </div>

                      <div
                        className="sm:ml-4 flex"
                        style={{ minWidth: "80px", justifyContent: "flex-end" }}
                      >
                        <p className="font-semibold sm:text-sm text-xs">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <button
                        className="ml-2"
                        onClick={() => cartStore.removeFromCart(item.productId)}
                      >
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
                    <span className="text-sm sm:text-xl">Shipping Fee:</span>
                    <span className="text-sm sm:text-xl">
                      ${calculateShippingFee}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between font-semibold">
                    <span className="text-sm sm:text-2xl">Total:</span>
                    <span className="text-sm sm:text-2xl">
                      ${parseFloat(calculateFinalTotal).toFixed(2)}
                    </span>
                  </div>
                </>
              )}

              {/* Proceed to payment and Click to go back button */}
              <button
                onClick={() => setStep(2)}
                className="mt-4 w-full  bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={cartStore.cartItems.length === 0}
              >
                <span className="text-sm sm:text-lg">Proceed to Address</span>
              </button>
              <button
                className="mt-4 w-full bg-orange-600 text-white px-4 py-2 rounded-lg"
                onClick={() => router.push("/products")}
              >
                <span className="text-sm sm:text-lg">Back to products</span>
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="sm:text-lg text-sm font-semibold mb-4">
                Shipping Address
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg">
                Enter your shipping details.
              </p>

              <textarea
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
                <span className="text-sm sm:text-lg">Proceed to Payment</span>
              </button>
              <button
                className="mt-4 w-full bg-orange-600 text-white px-4 py-2 rounded-lg"
                onClick={() => router.push("/products")}
              >
                <span className="text-sm sm:text-lg">Cancel</span>
              </button>
            </motion.div>
          )}

          {/*------------- Payment area - both COD and online payment */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="sm:text-xl text-sm font-semibold mb-4">
                Select Payment Method
              </h2>
              <div className="space-y-4">
                <div
                  className="border p-4 rounded-lg cursor-pointer flex items-center gap-4"
                  onClick={() => cartStore.setPaymentMethod("COD")}
                >
                  <input
                    type="radio"
                    checked={cartStore.selectedPaymentMethod === "COD"}
                    readOnly
                  />
                  <span className="font-semibold text-sm sm:text-lg">
                    Cash on Delivery (COD)
                  </span>
                </div>
                <div
                  className="border p-4 rounded-lg cursor-pointer flex items-center gap-4"
                  onClick={() => cartStore.setPaymentMethod("Stripe")}
                >
                  <input
                    type="radio"
                    checked={cartStore.selectedPaymentMethod === "Stripe"}
                    readOnly
                  />
                  <span className="font-semibold text-sm sm:text-lg">
                    Pay with Card (Stripe)
                  </span>
                </div>
              </div>
              {cartStore.selectedPaymentMethod === "Stripe" && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                  <Elements stripe={stripePromise}>
                    <PaymentForm onSuccess={() => setStep(4)} />
                  </Elements>
                </div>
              )}

              {/* Button to confirm COD and go to payment success step */}
              {cartStore.selectedPaymentMethod === "COD" && (
  <button
    onClick={() => {
      // Show the SweetAlert loading animation
      let timerInterval: NodeJS.Timeout | undefined;
      Swal.fire({
        title: "Processing Payment...",
        html: "Please do not press back button",
        timer: 2000, // Timer set to 2 seconds (2000ms)
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          if (timerInterval) {
            clearInterval(timerInterval);
          }
        }
      }).then(() => {
        // After the 2-second delay, transition to step 4 (Payment Success)
        setStep(4);
      });
    }}
    className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg"
  >
    <span className="text-sm sm:text-lg">Confirm Payment (COD)</span>
  </button>
)}


              <button
                className="mt-4 w-full bg-orange-600 text-white px-4 py-2 rounded-lg"
                onClick={() => router.push("/products")}
              >
                <span className="text-sm sm:text-lg">Cancel</span>
              </button>

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-green-600">
                Payment Successful!
              </h2>
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
    </>
  );
}
