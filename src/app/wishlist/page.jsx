"use client"
import Navbar from "@components/base components/Navbar";
import Footer from "@components/base components/Footer";
import WishList from "@components/base components/WishList";

export default function WishListPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar onFocusNavigate={true}/>
      <WishList />
      <Footer />
    </div>
  );
}
