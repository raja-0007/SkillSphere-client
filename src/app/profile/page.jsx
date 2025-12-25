"use client"
import Navbar from "@components/base components/ModernNavbar";
import Footer from "@components/base components/ModernFooter";
import Profile from "@components/profile components/Profile";

export default function ProfilePage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar onFocusNavigate={true}/>
      <Profile />
      <Footer />
    </div>
  );
}
