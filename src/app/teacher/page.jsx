import Navbar from "@components/base components/ModernNavbar";
import Footer from "@components/base components/ModernFooter";
import TeacherMode from "@components/base components/TeacherMode";

export default function TeacherPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar onFocusNavigate={true}/>
      <TeacherMode />
      <Footer />
    </div>
  );
}
