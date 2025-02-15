import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    // Connect to DB
    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user
    const user = new User({ email, password: hashedPassword });
    await user.save();

    return new Response(JSON.stringify({ message: "User created successfully", userId: user.id }), { status: 201 });

  } catch (error) {

    console.error("Error in signup at api/signup:",error.message)
    return new Response(JSON.stringify({ message: "Error creating user" }), { status: 500 });
    
  }
};
