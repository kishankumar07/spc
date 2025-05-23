import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, LogOut, CircleX, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Header() {


  const [mounted, setMounted] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null); // ✅ hook above early return
  const router = useRouter();
  const { isLoggedIn, logOut } = useAuthStore();
  const cartStore = useCartStore();
  const [cartCount, setCartCount] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // all hooks first — no conditionals before this point
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    cartStore.fetchCart();
  }, []);

  useEffect(() => {
    setCartCount(cartStore.cartItems.length);
  }, [cartStore.cartItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) return null; // ✅ only after ALL hooks have been declared

  const handleRemove = async (productId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dropdown from closing
    await cartStore.removeFromCart(productId);
  };

  // Compute total items and total price
  const totalItems = cartStore.cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const totalPrice = cartStore.cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  // Handle removal of an item from the cart

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 shadow-md bg-white sm:px-32">
        {/* Logo */}
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src={"/JustRightLogo.svg"}
            alt={"justRightLogo"}
            width={150}
            height={100}
            className="rounded"
          />
        </div>

        {/* Desktop View: Cart & Logout ---------- It is visible only from medium screen only*/}
        <div className="hidden sm:flex items-center gap-7">
          {isLoggedIn ? (
            <>
              {/* Cart */}
              <div
                ref={cartRef}
                className="relative cursor-pointer"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <div className="relative flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <ShoppingCart size={28} className="text-gray-700" />
                  <span className="font-medium text-gray-800">Cart</span>
                  {cartCount !== null && cartCount > 0 && (
                    <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </div>

                {/* Cart Dropdown - Only for large screens */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded z-50 p-4">
                    <h3 className="font-bold mb-2 text-lg">Your Cart</h3>
                    {cartStore.cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <DotLottieReact
                          src="https://lottie.host/a43cbbd0-0045-4bbb-b3bb-d31a55ed4fbf/2bbeNL9YAf.lottie"
                          loop
                          autoplay
                          className="w-50 h-50"
                        />
                        <p className="text-gray-500 mt-2 text-xl">
                          Oops.. Empty cart
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Scrollable cart items section */}
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                          {cartStore.cartItems.map((item) => (
                            <div
                              key={item.productId}
                              className="flex justify-between items-center border-b py-2"
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src={item.thumbnail}
                                  alt={item.title}
                                  width={50}
                                  height={50}
                                  className="rounded"
                                />
                                <div>
                                  <p className="text-sm font-semibold">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Qty: {item.quantity} x ${item.price}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={(event) =>
                                  handleRemove(item.productId, event) 
                                } className="mr-2"
                              >
                                <CircleX
                                  size={24}
                                  className="text-red-500 hover:text-red-600 transition-colors"
                                />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Total and checkout button - always visible */}
                        <div className="mt-2 border-t pt-4">
                          <p className="text-lg">Total Items: {totalItems}</p>
                          <p className="text-lg">
                            Total Price: ${totalPrice.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => router.push("/checkout")}
                          className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all"
                        >
                          Proceed to Checkout
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logOut();
                  router.push("/login");
                }}
                className="flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <User size={20} />
              Login
            </button>
          )}
        </div>

        {/* Mobile View: Hamburger Menu */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={28} />
        </button>
      </header>

      {/* Mobile Sidebar (Slide in) ----------------- only in small screen*/}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-5 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Close Button */}
              <button
                className="self-end mb-4"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={28} />
              </button>

              {/* Sidebar Content */}
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      router.push("/checkout");
                    }}
                    className="flex items-center gap-2 text-lg py-2"
                  >
                    <ShoppingCart size={24} />
                    Cart ({cartCount})
                  </button>

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      logOut();
                      router.push("/login");
                    }}
                    className="flex items-center gap-2 text-lg py-2"
                  >
                    <LogOut size={24} />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push("/login");
                  }}
                  className="flex items-center gap-2 text-lg py-2"
                >
                  <User size={24} />
                  Login
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
