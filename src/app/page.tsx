import { redirect } from "next/navigation";

export default function Home() {
  redirect("/products");
  return null; // To redirect the default page to the route /products
}
