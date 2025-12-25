"use client"
import Navbar from "@components/base components/ModernNavbar";
import Footer from "@components/base components/ModernFooter";
import SearchResults from "@components/search results/SearchResults";

export default function SearchResultsPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar />
      <SearchResults />
      <Footer />
    </div>
  );
}
