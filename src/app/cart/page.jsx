"use client"
import Navbar from "@components/base components/Navbar";
import Footer from "@components/base components/Footer";
import Cart from "@components/cart components/Cart";

export default function CartPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar />
      <Cart />
      <Footer />
    </div>
  );
}
