import mongoose, { Schema, Document } from "mongoose";

interface CartItem {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface CartDocument extends Document {
  userId: string;
  items: CartItem[];
}

const CartSchema = new Schema<CartDocument>({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      productId: { type: Number, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      thumbnail: { type: String, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const Cart = mongoose.models.Cart || mongoose.model<CartDocument>("Cart", CartSchema);
export default Cart;
