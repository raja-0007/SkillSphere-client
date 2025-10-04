import Navbar from "@components/base components/Navbar";
import Footer from "@components/base components/Footer";
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
