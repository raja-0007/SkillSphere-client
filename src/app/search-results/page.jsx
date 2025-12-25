"use client"
import Navbar from "@components/base components/ModernNavbar";
import Footer from "@components/base components/ModernFooter";
import ModernSearchResults from "@components/search/ModernSearchResults";

export default function SearchResultsPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar />
      <ModernSearchResults />
      <Footer />
    </div>
  );
}
