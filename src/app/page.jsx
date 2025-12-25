
import Navbar from "@components/base components/ModernNavbar";
import Footer from "@components/base components/ModernFooter";
import ModernHome from "@components/home/ModernHome";

const page = () => {


  return (
    <div className="w-full flex flex-col relative">
      <Navbar onFocusNavigate={true}/>
      <ModernHome />
      <Footer />
      
    </div>
  );
}

export default page;
