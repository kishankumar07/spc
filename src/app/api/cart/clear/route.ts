import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/Cart";

export const POST = async (req: Request) => {
  try {
    await connectToDatabase();
    const { userId } = await req.json();

    await Cart.findOneAndDelete({ userId });
    return new Response(JSON.stringify({ message: "Cart cleared" }), { status: 200 });
  } catch (error) {
    console.error("Error clearing cart:", (error as Error).message);
    return new Response(JSON.stringify({ message: "Error clearing cart" }), { status: 500 });
  }
};
