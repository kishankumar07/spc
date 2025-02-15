"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RotateCw, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import Swal from "sweetalert2";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export default function ProductListing() {
  // in the products state below this line, the dummy content will be stored
  const [products, setProducts] = useState<Product[]>([]);
  const {isLoggedIn} = useAuthStore();
  const { cartItems, addToCart } = useCartStore(); // Get cart state and function
  const router = useRouter();




const fetchRandomProducts = () => {

  if (typeof window === "undefined") return; // Ensures it's a client-side operation

      const randomSkip = Math.floor(Math.random() * 80); // DummyJSON has ~100 products
      fetch(`https://dummyjson.com/products?limit=6&skip=${randomSkip}`)
        .then((res) => res.json())
        .then((data) => setProducts(data.products))
        .catch((err) => console.error("Failed to fetch products:", err));
    };
  
    useEffect(() => {
      fetchRandomProducts();
    }, []);


    const handleAddToCart = async (product: Product) => {
      // checks 3 things:
      // 1) check user is loggedin ; if not shows Swal and pushes to login page.
      // 2) Check for existing Item in cart. If existing then shows Swal;
      // 3) If not existing then calls addToCart from zustand store;
      if (!isLoggedIn) {
        const loginResult = await Swal.fire({
          title: "Login Required",
          text: "Please log in to add items to your cart.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Login",
        });
    
        if (loginResult.isConfirmed) {
          router.push("/login");
        }
    
        return;
      }

      
    // cartItems is an array of objects without userId, refer cart (Zustand) store to verify 
      const existingItem = cartItems.find((item) => item.productId === product.id);


      if (existingItem) {
        Swal.fire("Already in Cart", "Product is already in your cart", "warning");
      } else {
        
        addToCart({ 
          productId: product.id,
           title: product.title,
            price: product.price,
             thumbnail: product.thumbnail,
              quantity: 1 });

        Swal.fire("Added to Cart", "Item successfully added to your cart!", "success");

      }
    };
    
    

  return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Products</h1>

        {/* This button is the refresh button when clicked will again fetch another random content */}
        <button
          onClick={fetchRandomProducts}
          className="mb-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
        >
         <span className="flex gap-3">
             Refresh Products  <RotateCw />
         </span>
        </button>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {/* This will always be greater than 0 because fetchRandomProducts is inside the useEffect hook */}
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg shadow-md bg-white">
                <img src={product.thumbnail} alt={product.title} className="w-full h-40 object-cover mb-4 rounded-md" />
                <h2 className="text-xl font-semibold">{product.title}</h2>
                <p className="text-gray-600">${product.price}</p>
                <button
  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-600"
  onClick={() => handleAddToCart(product)}
>
  <ShoppingCart size={20} /> Add to Cart
</button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Loading products...</p>
          )}
        </div>
      </div>
    );
}
