import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/Cart";

interface CartItem {
  productId: string,
  quantity: number,
}


export const POST = async (req: Request) => {
  try {
    await connectToDatabase();
    const { userId, product } = await req.json();

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [product] });
    } else {
      const existingItem = cart.items.find((item: CartItem) => item.productId === product.productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push(product);
      }
    }

    await cart.save();
    return new Response(JSON.stringify({ message: "Added to cart successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error adding to cart:", (error as Error).message);
    return new Response(JSON.stringify({ message: "Error adding to cart" }), { status: 500 });
  }
};
