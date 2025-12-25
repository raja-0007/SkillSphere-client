import Footer from '@components/base components/ModernFooter';
import Navbar from '@components/base components/ModernNavbar';
import CourseOverview from '@components/course overview/CourseOverview';
import axios from 'axios';


export async function generateStaticParams() {
  // Fetch all course IDs to pre-build pages at build time
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/searchResults?search=${""}`);
  const courses = res.data; // assume [{ _id: 'abc123' }, {_id:'xyz456'}]

  return courses.map(course => ({
    id: course._id,
  }));
}

export default async function DynamicCourseOverviewPage({ params }) {
  const { id } = params;


  try {
    // SSR fetch
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCourseDetails/${id}`);
    const courseData = res.data;

    return <>
    <Navbar onFocusNavigate={true} />
  <CourseOverview courseData={courseData} />;
  {/* <CourseOverview id={params.id} /> */}
  <Footer />
    </>
  } catch (err) {
    console.error('Error fetching course details:', err.message);
    return <div className="flex justify-center items-center h-screen">Course not found</div>;
  }
}

export const revalidate = 3600; //1hour
