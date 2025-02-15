"use client";

import { useEffect,useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, LogOut, CircleX } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";



export default function Header() {

  const cartRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isLoggedIn, logOut } = useAuthStore();
  const cartStore = useCartStore();

  // Handle Next.js hydration issue by ensuring cartCount is accessed only on the client
  // cartCount is a variable with type of number from cart 

  // Handle Next.js hydration issue
  // Prevent accessing Zustand store during SSR
  const [cartCount, setCartCount] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    cartStore.fetchCart(); // Fetch cart on mount
  }, [])

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
    <header className="flex justify-between items-center p-4 shadow-md bg-white">
      {/* Logo */}
      <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        Under Progress!! (Thank you for your patience)
      </div>

      {/* Right Side: Login & Cart */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
         
         <>
         {/* Cart Icon with Dropdown on Hover */}
         <div ref={cartRef}
           className="relative cursor-pointer"
          //  onMouseEnter={() => setShowDropdown(true)}
          //  onMouseLeave={() => setShowDropdown(false)}
           onClick={()=>setShowDropdown((prev)=>!prev)}
         >
           <div
             className="cursor-pointer"
            //  onClick={() => router.push("/cart")}
           >
             <ShoppingCart size={24} />
             {cartCount !== null && cartCount > 0 && (
               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                 {cartCount}
               </span>
             )}
           </div>

           {showDropdown && (
             <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded z-50 p-4">
               <h3 className="font-semibold mb-2">Your Cart</h3>
               <div className="max-h-60 overflow-y-auto">
                 {cartStore.cartItems.length === 0 ? (
                   <p className="text-gray-500">Cart is empty</p>
                 ) : (
                   cartStore.cartItems.map((item) => (
                     <div
                       key={item.productId}
                       className="flex justify-between items-center border-b py-1"
                     >
                       <div>
                         <p className="text-sm font-semibold">
                           {item.title}
                         </p>
                         <p className="text-xs text-gray-600">
                           Qty: {item.quantity} x ${item.price}
                         </p>
                       </div>
                       <button onClick={(event) => handleRemove(item.productId, event)}>
                         <CircleX size={24} className="text-red-500" />
                       </button>
                     </div>
                   ))
                 )}
               </div>
               <div className="mt-2 border-t pt-2">
                 <p className="text-sm">Total Items: {totalItems}</p>
                 <p className="text-sm">
                   Total Price: ${totalPrice.toFixed(2)}
                 </p>
               </div>
               <button
                 onClick={() => router.push("/checkout")}
                 className="mt-2 w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                 disabled={cartStore.cartItems.length === 0}
               >
                 Proceed to Checkout
               </button>
             </div>
           )}
         </div>

         {/* Logout Button */}
         <button
           onClick={() => {
             logOut();
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
