
import Navbar from "@components/base components/ModernNavbar";
import Footer from "@components/base components/ModernFooter";
import Home from "@components/base components/Home";

const page = () => {


  return (
    <div className="w-full flex flex-col relative">
      <Navbar onFocusNavigate={true}/>
      <Home />
      <Footer />
      
    </div>
  );
}

export default page;
