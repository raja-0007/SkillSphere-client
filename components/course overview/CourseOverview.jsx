import React, { useEffect, useState } from 'react';
import { printRating } from '../home components/courses';
import { IoMdCheckmark } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { BsFileEarmark } from 'react-icons/bs';
import { FaCirclePlay } from "react-icons/fa6";
import CourseSections from './CourseSections';
import axios from 'axios';
import Link from 'next/link';
import { FaHeart } from "react-icons/fa6";
import { useHomeContext } from '@contexts/HomeContext';
import { useRouter } from 'next/navigation';

function CourseOverview({ id }) {
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [wishList, setWishList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { overviewCourse, userDetails, setUserDetails, cart, setCart, enrolled, setActive, searchResults } = useHomeContext()


    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);
        const fetchCourse = async () => {
            if (!id) return;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCourseDetails/${id}`);
                setCourse(res.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const totalArticleLectures = (sections) => {
        let total = 0;
        sections?.forEach(sect => {
            const curr = sect.curriculum.filter(curri => curri.content_type === 'article');
            total += curr.length;
        });
        return total;
    };
    const totalVideoLectures = (sections) => {
        let total = 0;
        sections?.forEach(sect => {
            const curr = sect.curriculum.filter(curri => curri.content_type === 'video');
            total += curr.length;
        });
        return total;
    };

    const addToCart = async () => {
        if (Object.keys(userDetails).length !== 0 && course) {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/addToCart`, { course: JSON.stringify(course), userId: userDetails.userDetails._id })
                .then((res) => {
                    if (res.data.status === 'success') {
                        setCart(res.data.cart);
                    }
                });
        } else{
             alert('please login to enroll')
             router.push('/authentication')
        };
    };

    const addToWishlist = async () => {
        if (Object.keys(userDetails).length !== 0 && course) {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/addToWishlist`, { courseId: course._id, userId: userDetails.userDetails._id }, {
                headers: {
                    'Authorization': `Bearer ${userDetails?.accessToken}`
                }
            })
                .then((res) => {
                    if (res.status === 403) {
                        alert('session expired please login again to continue');
                    } else if (res.data.status === 'success') {
                        setWishList([...wishList, course._id]);
                    }
                });
        } else alert('please login to access wishlist');
    };

    useEffect(() => {
        const getWishList = async () => {
            if (!userDetails?.userDetails?._id) return;
            await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getWishlist/${userDetails?.userDetails?._id}`)
                .then(res => {
                    setWishList(res.data.RawList);
                });
        };
        getWishList();
    }, [userDetails]);

    const removeFromWishlist = async (id) => {
        setLoading(true);
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/removeFromWishlist/${id}/${userDetails?.userDetails?._id}`, {
            headers: {
                'Authorization': `Bearer ${userDetails?.accessToken}`
            }
        })
            .then((res) => {
                setLoading(false);
                if (res.status === 403) {
                    alert('session expired, please log in to continue');
                } else if (res.data.status === 'success') {
                    setWishList(res.data.wishList);
                }
            });
    };

    const enrollFree = async (courseId, userId) => {
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/enroll`, { userId: userId, courseIds: JSON.stringify([courseId]) })
            .then(res => {
                if (res.data.status === 'success') {
                    window.open(`/coursesDetails/${courseId}/${userId}`, '_blank');
                }
            });
    };

    if (loading || !course) {
        return <div className="flex justify-center items-center h-screen text-xl font-bold">Loading course details...</div>;
    }

    return (
        <div className='flex flex-col overflow-hidden'>
            <div className='px-40 py-10 pt-20 text-white bg-slate-900 relative'>
                <span className='text-3xl font-bold w-[70%]'>{course.landingPageDetails.title}</span>
                <p className='w-[70%] mt-3'>{course.landingPageDetails.subtitle}</p>
                {course.rating.rating !== '' ? <p className='w-[70%] mt-3 flex items-center text-yellow-500'><span className='me-1 text-xl'>{course.rating.rating}</span> {printRating(course.rating.rating)} <span className='ms-2 text-blue-200 opacity-70 '>({course.rating.TotalRatings || 'N/A'} ratings)</span></p>
                    : <p>newly added (no ratings yet)</p>
                }
                <p className='w-[70%] mt-3'>created by {course.author.username} {course.author.authorId === userDetails?.userDetails?._id && '(you)'}</p>
            </div>
            <div className='w-[25%] self-end fixed flex flex-col top-32 right-16 bg-white shadow-md'>
                <img src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${course.image}`} className='w-full' alt="" />
                <div className='flex flex-col items-center gap-3 px-5 pb-10'>
                    <div className='flex items-center w-full gap-2 pt-5'>
                        {!course?.enrolled?.includes(userDetails?.userDetails?._id) && <span className='flex items-center text-xl font-bold uppercase text-violet-400'>{course.price !== 'free' ? <FaRupeeSign size={'.85em'} /> : '*'}{course.price}</span>}
                        {(cart?.filter(item => item._id === course._id).length === 0 && !course?.enrolled?.includes(userDetails?.userDetails?._id) && course.price !== 'free' && course.author.authorId !== userDetails?.userDetails?._id) ?
                            <span className='px-3 py-2 cursor-pointer bg-violet-500 text-center text-white w-full' onClick={addToCart}>Add to cart</span>
                            : cart?.filter(item => item._id === course._id).length !== 0 ?
                                <Link href={`/cart`} className='px-3 py-2 bg-slate-700 text-center cursor-pointer text-white w-full'>Go to cart</Link>
                                : (!course?.enrolled?.includes(userDetails?.userDetails?._id) && course.price === 'free') ? <span className='px-3 py-2 bg-slate-700 text-center text-white cursor-pointer w-full' onClick={() => enrollFree(course._id, userDetails?.userDetails?._id)}>Enroll for free</span>
                                    : (course?.enrolled?.includes(userDetails?.userDetails?._id) || course.price === 'free' || course.author.authorId === userDetails?.userDetails?._id) &&
                                    <Link href={`/coursesDetails/${course._id}/${userDetails?.userDetails?._id}`} target='_blank' className='px-3 py-2 bg-slate-700 text-center cursor-pointer text-white w-full'>Go to course</Link>
                        }
                        <span className={`px-2 py-2 border border-black ${loading && ' animate-pulse'}`} onClick={() => wishList.includes(course?._id) ? removeFromWishlist(course?._id) : addToWishlist()}>
                            {wishList.includes(course?._id) ? <FaHeart className='text-red-400' size={'1.2em'} /> : <FaRegHeart size={'1.2em'} />}
                        </span>
                    </div>
                    <span className='text-xs'>{course.price !== 'free' ? '30-day money-back guarantee' : 'this course is available for free'}</span>
                    <span className='text-xs'>Full life time access</span>
                </div>
            </div>
            <div className='ps-40 pe-10 py-10 flex flex-col gap-10 w-[70%]'>
                <div className='border border-gray-300 p-3 w-full'>
                    <span className='text-2xl font-bold'>what you'll learn</span>
                    <div className='w-full mt-2 flex flex-wrap pt-2'>
                        {course.outcomes.map((outcome, i) => (
                            <span key={i} className='flex items-start h-[max-content] gap-2 w-[50%] mb-2'><div className='pt-1'><IoMdCheckmark size={'1.1em'} /></div>{outcome}</span>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-3 w-[50%]'>
                    <span className='text-2xl font-bold'>this course includes:</span>
                    <div className='flex flex-wrap'>
                        <span className='flex items-center gap-2 w-[50%] mb-2'><BsFileEarmark size={'1.2em'} />{totalArticleLectures(course.sections)} articles</span>
                        <span className='flex items-center gap-2 w-[50%] mb-2'><FaCirclePlay size={'1.2em'} />{totalVideoLectures(course.sections)} video lectures</span>
                    </div>
                </div>
                <CourseSections overviewCourse={course} />
                <div>
                    <p className='text-2xl font-bold'>Requirements</p>
                    {course.requirements.map((req, i) => (
                        <li className='py-1 px-2' key={i}>{req}</li>
                    ))}
                </div>
                <div>
                    <p className='text-2xl font-bold mb-2'>Description</p>
                    {typeof course.landingPageDetails.description === 'string' ? <p>{course.landingPageDetails.description}</p>
                        : course.landingPageDetails.description.blocks.map((block, block_i) => {
                            const getHeaderText = () => {
                                const headers = {
                                    h1: <h1 className='font-bold text-lg mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h1>,
                                    h2: <h2 className='font-bold text-xl mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h2>,
                                    h3: <h3 className='font-bold text-2xl mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h3>,
                                    h4: <h4 className='font-bold text-3xl mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h4>,
                                    h5: <h5 className='font-bold text-4xl mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h5>,
                                    h6: <h6 className='font-bold text-5xl mb-2' dangerouslySetInnerHTML={{ __html: block.data.text }}></h6>,
                                };
                                return headers[`h${block.data.level}`];
                            };
                            const getNestedList = (style, items, key) => {
                                if (style === 'unordered') {
                                    return <ul className='list-disc ps-5 mb-3'>
                                        {items.map((listItem, list_i) => (
                                            <>
                                                <li key={list_i + key} dangerouslySetInnerHTML={{ __html: listItem.content }}></li>
                                                {listItem.items.length > 0 && getNestedList('unordered', listItem.items, list_i + key)}
                                            </>
                                        ))}
                                    </ul>;
                                } else {
                                    return <ol className='list-decimal ps-5 mb-5'>
                                        {items.map((listItem, list_i) => (
                                            <>
                                                <li key={list_i + key} dangerouslySetInnerHTML={{ __html: listItem.content }}></li>
                                                {listItem.items.length > 0 && getNestedList('ordered', listItem.items, list_i + key)}
                                            </>
                                        ))}
                                    </ol>;
                                }
                            };
                            return (
                                <>
                                    {block.type === 'paragraph' ? <p dangerouslySetInnerHTML={{ __html: block.data.text }} className='mb-2'></p>
                                        : block.type === 'header' ? getHeaderText()
                                            : block.type === 'nestedList' && getNestedList(block.data.style, block.data.items, 0)}
                                </>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

export default CourseOverview;