import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/Cart";

export const POST = async (req: Request) => {
  try {
    await connectToDatabase();
    const { userId } = await req.json();

    const cart = await Cart.findOne({ userId }) || { items: [] };
    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    return new Response(JSON.stringify({ message: "Error fetching cart" }), { status: 500 });
  }
};
