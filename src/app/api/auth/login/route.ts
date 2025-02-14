import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    // Connect to DB
    await connectToDatabase();

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 400 });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Invalid password" }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Login successful" }), { status: 200 });
  } catch (error) {
    console.error("error in login:",error.message)
    return new Response(JSON.stringify({ message: "Error logging in" }), { status: 500 });
  }
};
