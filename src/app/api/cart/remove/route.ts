import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/Cart";

interface CartItem{
  productId: number;
}

export const POST = async (req: Request) => {
  try {
    await connectToDatabase();
    const { userId, productId } = await req.json();

    const cart = await Cart.findOne({ userId });
    if (!cart) return new Response(JSON.stringify({ message: "Cart not found" }), { status: 400 });

    cart.items = cart.items.filter((item:CartItem) => item.productId !== productId);
    await cart.save();

    return new Response(JSON.stringify({ message: "Removed from cart" }), { status: 200 });
  } catch (error) {
    console.error("Error removing from cart:", (error as Error).message);
    return new Response(JSON.stringify({ message: "Error removing from cart" }), { status: 500 });
  }
};
