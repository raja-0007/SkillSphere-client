import { useHomeContext } from '@contexts/HomeContext'
import React, { useEffect, useState, memo } from 'react'
import { HiCurrencyRupee } from "react-icons/hi2";
import { IoFilterSharp } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Ratings from './Ratings';
import { printRating } from '../home components/courses';
import Levels from './Levels';
import { useRouter } from 'next/navigation';




const SkeletonCard = () => (
    <div className="flex justify-between gap-2 items-start pb-5 mb-5 border-b animate-pulse">
        <div className="flex gap-3">
            <div className="bg-gray-200 w-[250px] h-[150px] rounded" />
            <div className="flex flex-col gap-2 w-[600px]">
                <div className="bg-gray-200 h-6 w-2/3 rounded" />
                <div className="bg-gray-200 h-4 w-full rounded" />
                <div className="bg-gray-200 h-4 w-1/2 rounded" />
                <div className="bg-gray-200 h-4 w-1/3 rounded" />
            </div>
        </div>
        <div className="bg-gray-200 h-6 w-16 rounded" />
    </div>
);

const ResultCard = memo(function ResultCard({ item, setActive, setOverviewCourse,  }) {
    const router = useRouter();
    const totalLectures = () => {
        let total = 0;
        item.sections.forEach(sect => {
            total += sect.curriculum.length;
        });
        return total;
    };
    return (
        <div className="flex justify-between p-3 gap-2 items-start pb-5 mb-5 border-b hover:shadow-lg transition-shadow duration-200 bg-white rounded-lg cursor-pointer" onClick={() => { 
            setActive('course overview'); setOverviewCourse(item);
            console.log('item', item)
            router.push(`/course-overview/${item._id}`)
             }}>
            <div className="flex gap-3">
                <img src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${item.image}`} loading="lazy" className="w-[250px] h-[150px] object-cover rounded" alt={item.landingPageDetails.title} />
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-lg font-bold line-clamp-1">{item.landingPageDetails.title}</span>
                    {typeof item.landingPageDetails.description === 'string' ? (
                        <span className="text-sm w-full line-clamp-2">{item.landingPageDetails.description.slice(0, 330)}...</span>
                    ) : (
                        item.landingPageDetails.description.blocks.filter(block => block.type === 'paragraph').slice(0, 1).map((block, block_i) => (
                            <p key={block_i} dangerouslySetInnerHTML={{ __html: block.data.text.slice(0, 330) + '...' }} className="text-sm w-full line-clamp-2"></p>
                        ))
                    )}
                    <span className="text-gray-500 text-xs">{item.author.username}, {item.author.email}</span>
                    <span className="text-md flex items-center gap-1">
                        <span className={`font-bold ${item.rating.rating === '' && 'border-2 border-yellow-300 rounded-full font-normal text-gray-500 px-2 text-xs '}`}>{item.rating.rating === '' ? 'newly added (no reviews yet)' : item.rating.rating}</span>
                        {item.rating.rating !== '' && (
                            <span className="flex items-center">{printRating(item.rating.rating)}<span className="ms-2 text-gray-400 text-sm">({item.rating.TotalRatings || 0} ratings)</span></span>
                        )}
                    </span>
                    <span className="text-xs text-gray-500 ">{totalLectures()} lectures . {item.landingPageDetails.level}</span>
                </div>
            </div>
            <span className="flex items-center font-bold text-lg text-violet-700"><HiCurrencyRupee size={'1.2em'} />{item.price}</span>
        </div>
    );
});

const SearchResultsPage = ()=>{
    const { setSearch, searchData, setDropDown, setOverviewCourse, setActive } = useHomeContext();
    const [isfilter, setIsfilter] = useState(false);
    const [filters, setFilters] = useState({
        ratings: { value: '', open: false },
        levels: { value: [], open: false },
        price: { value: [], open: false }
    });
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     setSearch('');
    //     setDropDown(false);
    //     setLoading(true);
    //     // Simulate loading for UI improvement
    //     const timer = setTimeout(() => setLoading(false), 600);
    //     return () => clearTimeout(timer);
    // }, []);

    const priceChangeHandler = (e) => {
        var price = [...filters.price.value];
        if (price.includes(e.target.value)) {
            price = price.filter(lev => lev !== e.target.value);
            setFilters({ ...filters, price: { ...filters.price, value: price } });
        } else {
            price = [...price, e.target.value];
            setFilters({ ...filters, price: { ...filters.price, value: price } });
        }
    };

    return (
        <div className="flex flex-col gap-10 px-4 md:px-16 lg:px-28 py-10 bg-gray-50 min-h-screen">
            <div className="flex flex-col gap-5 font-bold">
                {searchData?.search == "" ? <span className="text-2xl md:text-3xl">
                    Start typing to search for courses
                </span>
                :<span className="text-2xl md:text-3xl">
                    {searchData?.searchResults?.length} results for "{searchData?.search}"
                </span>}
                {searchData?.searchResults?.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
                        <span className="flex items-center gap-3">
                            <span className="px-3 py-3 border border-black flex items-center gap-2 rounded hover:bg-gray-100 cursor-pointer" onClick={() => setIsfilter(!isfilter)}><IoFilterSharp />Filter</span>
                            {/* <span className="px-3 py-3 border border-black rounded">Sort by</span> */}
                        </span>
                        <span className="font-bold text-lg text-gray-400">{searchData?.searchResults?.length} results</span>
                    </div>
                )}
            </div>

            <div className="flex w-full">
                <div className={`border-t-2 h-[400px] ${isfilter ? 'w-[320px] md:w-[400px] me-5' : 'w-0 overflow-hidden'} transition-all duration-300 bg-white rounded-lg shadow-md`}>
                    {Object.keys(filters).map((ft, i) => (
                        <div className="p-3 border-b border-gray-300" key={i}>
                            <div className="flex flex-col font-bold capitalize text-lg cursor-pointer" onClick={() => setFilters({ ...filters, [ft]: { ...filters[ft], open: !filters[ft].open } })}>
                                <span className="flex items-center justify-between">{ft} <span className="text-gray-700">{filters[ft].open ? <FaAngleUp /> : <FaAngleDown />}</span></span>
                            </div>
                            <div>
                                {ft === 'ratings' ? <Ratings filters={filters} setFilters={setFilters} />
                                    : ft === 'levels' ? <Levels filters={filters} setFilters={setFilters} />
                                        : ft === 'price' && <form className={`flex flex-col gap-2 text-md font-normal transition-all duration-300 ${!filters.price.open ? 'h-0 overflow-hidden' : 'h-[max-content]'}`} onSubmit={e => e.preventDefault()}>
                                            <span className="mt-2 flex items-center">
                                                <input type="checkbox" name="price" checked={filters.price.value.includes('paid')} value={'paid'} onChange={priceChangeHandler} id="paid" />
                                                <label htmlFor="paid">Paid</label>
                                            </span>
                                            <span className="flex items-center">
                                                <input type="checkbox" name="price" checked={filters.price.value.includes('free')} value={'free'} onChange={priceChangeHandler} id="free" />
                                                <label htmlFor="free">Free</label>
                                            </span>
                                        </form>}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col w-full">
                    {loading
                        ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                        : searchData?.searchResults?.map((item, i) => (
                            <ResultCard key={i} item={item} setActive={setActive} setOverviewCourse={setOverviewCourse} />
                        ))}
                </div>
            </div>
        </div>
    );
}

export default memo(SearchResultsPage);

