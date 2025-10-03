"use client"
import Footer from '@components/base components/Footer';
import Navbar from '@components/base components/Navbar';
import CourseOverview from '@components/course overview/CourseOverview';

export default function DynamicCourseOverviewPage({ params }) {
  // Pass the dynamic id as a prop to CourseOverview
  return <div className="w-full flex flex-col min-h-screen">
        <Navbar onFocusNavigate={true} />
  <CourseOverview id={params.id} />
  <Footer />
      </div>
}
