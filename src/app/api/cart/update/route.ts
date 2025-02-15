import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/Cart";

export const POST = async (req: Request) => {
  try {
    await connectToDatabase();
    const { userId, productId, change } = await req.json(); // 'change' will be +1 or -1

    const cart = await Cart.findOne({ userId });
    if (!cart) return new Response(JSON.stringify({ message: "Cart not found" }), { status: 400 });

    const item = cart.items.find((item) => item.productId === productId);
    if (!item) return new Response(JSON.stringify({ message: "Item not found in cart" }), { status: 404 });

    // Update quantity
    item.quantity += change;

    // If quantity is zero or negative, remove the item
    if (item.quantity <= 0) {
      cart.items = cart.items.filter((item) => item.productId !== productId);
    }

    await cart.save();
    return new Response(JSON.stringify({ message: "Cart updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating cart:", error.message);
    return new Response(JSON.stringify({ message: "Error updating cart" }), { status: 500 });
  }
};
