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


const allProducts: Product[] = [
  {
    id: 1,
    title: "rightACRYLIC",
    price: 80,
    thumbnail: "/imageAssets/rightAcrylic.webp",
  },
  {
    id: 2,
    title: "Solid Surface",
    price: 625,
    thumbnail: "/imageAssets/solidSurface.webp",
  },
  {
    id: 3,
    title: "rightLAM",
    price: 29,
    thumbnail: "/imageAssets/rightLam.webp",
  },
  {
    id: 4,
    title: "PP Wall Decor Panels",
    price: 65,
    thumbnail: "/imageAssets/pp wall decor.webp",
  },
  {
    id: 5,
    title: "rightTAPES",
    price: 5,
    thumbnail: "/imageAssets/rightTapes.webp",
  },
  {
    id: 6,
    title: "Digital Signage",
    price: 914,
    thumbnail: "/imageAssets/dsignage.webp",
  },
  {
    id: 7,
    title: "rightPC",
    price: 171,
    thumbnail: "/imageAssets/rightPc.webp",
  },
  {
    id: 8,
    title: "rightCAL",
    price: 80,
    thumbnail: "/imageAssets/rcal.webp",
  },
  {
    id: 9,
    title: "rightGRAPHICS",
    price: 26,
    thumbnail: "/imageAssets/rgraphics.webp",
  },
  {
    id: 10,
    title: "rightPET",
    price: 6,
    thumbnail: "/imageAssets/rpet.webp",
  },
  {
    id: 11,
    title: "rightABS",
    price: 6,
    thumbnail: "/imageAssets/rabs.webp",
  },
  {
    id: 12,
    title: "Roll up Stands",
    price: 20,
    thumbnail: "/imageAssets/rstands.webp",
  },
];




export default function ProductListing() {
  // in the products state below this line, the dummy content will be stored
  const [products, setProducts] = useState<Product[]>([]);
  const {isLoggedIn} = useAuthStore();
  const { cartItems, addToCart } = useCartStore(); // Get cart state and function
  const router = useRouter();




const fetchRandomProducts = () => {

  if (typeof window === "undefined") return; // Ensures it's a client-side operation

     const shuffled = allProducts.sort(() => 0.5 - Math.random());
     setProducts(shuffled.slice(0,6)); // Get 6 random products from the array.
    };
  
    useEffect(() => {
      fetchRandomProducts()
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
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-blue-600 transition-all duration-300"
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
