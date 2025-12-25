"use client"
import Navbar from "@components/base components/ModernNavbar";
import Footer from "@components/base components/ModernFooter";
import ModernCart from "@components/cart/ModernCart";

export default function CartPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar onFocusNavigate={true}/>
      <ModernCart />
      <Footer />
    </div>
  );
}
