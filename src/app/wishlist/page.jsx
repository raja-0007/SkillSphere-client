"use client"
import Navbar from "@components/base components/ModernNavbar";
import Footer from "@components/base components/ModernFooter";
import ModernWishList from "@components/wishlist/ModernWishList";

export default function WishListPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar onFocusNavigate={true}/>
      <ModernWishList />
      <Footer />
    </div>
  );
}
