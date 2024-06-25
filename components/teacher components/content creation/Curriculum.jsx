import React, { useEffect, useState } from 'react'
import SectionLayout from '../SectionLayout'
import SectionHeader from '../SectionHeader'
import { BsFillInfoCircleFill } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { BsFileEarmark } from "react-icons/bs";
import { FaCirclePlay } from "react-icons/fa6";
import LectureForm from './LectureForm';
import { FaAngleDown } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { AiOutlineLink } from "react-icons/ai";
import { FaAngleUp } from "react-icons/fa6";
import { useTeacherContext } from '@contexts/TeacherContext';
import axios from 'axios';
import Editor from './Editor';








function Curriculum({ activeSection }) {
    const [videoUrl, setVideoUrl] = useState('')
    const [videoFIle, setVideoFile] = useState(null)
    const [articleText, setArticleText] = useState('')
    const [dismiss, setDismiss] = useState(false)
    const [selectedType, setSelectedType] = useState('')
    const [isSectForm, setIsSectForm] = useState(false)
    const [isCurrForm, setIsCurrForm] = useState('')
    const [isAddContent, setIsAddContent] = useState('')
    const [isEditContent, setIsEditContent] = useState('')
    const { filledStatus, setFilledStatus, sections, setSections, videoStatus, setVideoStatus, conditionsSatisfied, setConditionsSatisfied } = useTeacherContext()
    const [saved, setSaved] = useState(false)
    // const [conditionsSatisfied, setConditionsSatisfied] = useState(false)


    const contentIcons = {
        article: <BsFileEarmark />,
        video: <FaCirclePlay />
    }


    const [sectionDetails, setSectionDetails] = useState({
        title: '',
        objective: ''
    })



    const addSection = () => {
        if (!Object.values(sectionDetails).includes('')) {
            setSections([...sections,
            {
                id: 'section_' + (sections.length + 1),
                title: sectionDetails.title,
                objective: sectionDetails.objective,
                curriculum: []
            }])
            setSectionDetails({
                title: '',
                objective: ''
            })
            setSaved(false)
            setConditionsSatisfied(false)
            setIsSectForm(false)
        }
        else {
            alert('enter all fields')
        }

    }

    const addCurrItem = (title, id) => {
        if (title !== '') {

            const curriculum = {
                title: title,
                type: selectedType,
                content: '',
                content_type: '',
                resources: null,
                description: null,
                currId: 'sect' + id.split('_')[1] + 'cur' + (sections.filter(section => section.id == id)[0].curriculum.length + 1)
            }
            setSections(sections.map(section => section.id == id ? { ...section, curriculum: [...section.curriculum, curriculum] } : section))
            setIsCurrForm('')
            setSelectedType('')
            setSaved(false)
            setConditionsSatisfied(false)
        }
        else alert('enter title to add curriculum item')
    }

    const HandleCurr = (id) => {
        if (isCurrForm !== '') {
            setIsCurrForm('')
        }
        else (
            setIsCurrForm(id)
        )

    }

    const addContentType = (value, sectId, currId) => {
        setSections(sections.map(sect => sect.id == sectId ? { ...sect, curriculum: sect.curriculum.map(curr => curr.currId == currId ? { ...curr, content_type: value, content: value === 'video' ? '' : [] } : curr) } : sect))
        setVideoUrl('')
        setVideoFile(null)
        setArticleText('')

    }

    const uploadVideo = async (content, currId, sectId) => {
        console.log(content)
        if (videoStatus.filter(stat => Object.keys(stat).includes(currId)).length == 0) {
            // console.log('first entry')
            setVideoStatus([...videoStatus, { [currId]: 'processing' }])
        }
        else {

            setVideoStatus(videoStatus.map(stat => Object.keys(stat).includes(currId) ? { ...stat, [currId]: 'processing' } : stat))
        }
        // setVideoStatus([...videoStatus, { [currId]: 'processing' }])
        // setVideoStatus(prevStatus => prevStatus.map(
        //     status => status[currId] ? { [currId]: 'processing' } : { [currId]: 'processing' }
        // ));
        // setTimeout(() => {
        //     // console.log('updating state')
        //     setVideoStatus(prevStatus => prevStatus.map(
        //         status => status[currId] ? { [currId]: 'uploaded' } : status
        //     ));
        // }, 10000);
        const addVideoUrl = (sectId, currId, videoUrl) => {
            // console.log(videoUrl.split('/')[videoUrl.split('/').length-1])
            const section = sections.filter(sect => sect.id == sectId)[0]
            const currlm = section.curriculum.filter(currlm => currlm.currId == currId)[0]
            currlm.videoUrl = videoUrl.split('/')[videoUrl.split('/').length - 1]
            console.log('added url', currlm)
            setSections(sections.map(sect => sect.id == sectId ? { ...sect, curriculum: sect.curriculum.map(curr => curr.currId == currId ? currlm : curr) } : sect))

        }
        const formdata = new FormData()
        formdata.append('video', content)
        // formdata.append('name',data.name)
        // console.log(data.video.filepath, data.video.name)
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/createcourse/videoUpload`, formdata)
            .then(res => {
                console.log(res.data)
                setVideoStatus(prevStatus => prevStatus.map(
                    status => status[currId] ? { [currId]: 'uploaded' } : status
                ));
                if (res.data.status == 'success') addVideoUrl(sectId, currId, res.data.videoUrl)
            })

    }


    const addContent = (sectId, currId, content) => {
        const section = sections.filter(sect => sect.id == sectId)[0]
        const currlm = section.curriculum.filter(currlm => currlm.currId == currId)[0]
        currlm.content = content
        setArticleText('')
        setVideoUrl('')

        setIsEditContent('')


        setSections(sections.map(sect => sect.id == sectId ? { ...sect, curriculum: sect.curriculum.map(curr => curr.currId == currId ? currlm : curr) } : sect))
        setSaved(false)
        setConditionsSatisfied(false)

    }

    const addVideoContent = (sectId, currId, content) => {
        // console.log('content',content)
        // console.log(videoFIle)
        if (videoFIle) {

            const section = sections.filter(sect => sect.id == sectId)[0]
            const currlm = section.curriculum.filter(currlm => currlm.currId == currId)[0]
            if (videoFIle === currlm?.content) {
                console.log('same files')
                setIsEditContent('')
                setVideoFile(null)
            }
            else {
                console.log('not same', videoFIle, currlm.content)
                currlm.content = videoFIle
                setArticleText('')
                setVideoUrl('')
                setVideoFile(null)

                // console.log(currlm)
                uploadVideo(currlm.content, currlm.currId, sectId)
                setIsEditContent('')


                setSections(sections.map(sect => sect.id == sectId ? { ...sect, curriculum: sect.curriculum.map(curr => curr.currId == currId ? currlm : curr) } : sect))
                setSaved(false)
                setConditionsSatisfied(false)
            }
        }
        else {
            alert('please select a video file')
        }
    }
    useEffect(() => {
        setArticleText('')
        setVideoUrl('')
        setVideoFile(null)
    }, [isAddContent])

    const saveIntoFilled = () => {

        if (!filledStatus.includes('curriculum') && sections.length >= 2) {
            sections.forEach(sect => {
                if (!Object.values(sect).includes('') && sect.curriculum.length >= 1) {
                    // console.log(sect)
                    sect.curriculum.forEach(curr => {
                        if (!Object.values(curr).includes('')) {
                            setConditionsSatisfied(true)
                        }
                        else {
                            // console.log(curr)
                            setConditionsSatisfied(false)
                            alert(`curriculum content should not be empty, please add content in ${curr.title}`)
                            return
                        }
                    });
                }
                else {
                    setConditionsSatisfied(false)
                    alert(`section should contain alteast one curriculum item, please add curriculum content in ${sect.title}`)
                    return
                }
            });

        }
        else if (sections.length < 2) {
            setConditionsSatisfied(false)
            alert('curriculum should atleast have 2 sections')
        }
    }

    useEffect(() => {
        if (conditionsSatisfied) {
            setFilledStatus([...filledStatus, 'curriculum'])
            setSaved(true)
        }
    }, [conditionsSatisfied])



    useEffect(() => {
        if (filledStatus.includes('curriculum')) {
            setSaved(true)
        }
        else setSaved(false)
    }, [])

    const onSave = (currId, sectId, data) => {
        console.log(data.blocks)
        addContent(sectId, currId, data)
    }



    return (
        <SectionLayout>
            <SectionHeader activeSection={activeSection} />
            <div className='px-10 flex flex-col gap-10'>
                {!dismiss && <div className='border-2 border-dashed  p-5 py-3'>
                    <div className='flex  items-start'>
                        <BsFillInfoCircleFill size={'2em'} className='text-slate-800 me-4' />
                        <p className='font-bold '>Here’s where you add course content—like lectures, course sections, assignments, and more. Click a + icon on the left to get started.</p>

                    </div>
                    <div className='p-2 mt-2 ms-10 px-4 bg-slate-800 text-white w-[max-content] cursor-pointer' onClick={() => setDismiss(true)}>Dismiss</div>
                </div>}
                <div>
                    <p className='mb-2'>Start putting together your course by creating sections, lectures and practice (quizzes, coding exercises and assignments).</p>

                    Start putting together your course by creating sections, lectures and practice activities (quizzes, coding exercises and assignments). Use your course outline to structure your content and label your sections and lectures clearly. If you’re intending to offer your course for free, the total length of video content must be less than 2 hours.
                </div>

                <div className='flex flex-col gap-6 pb-10'>
                    {sections.map((section, i) => {
                        return (
                            <div className='bg-slate-100 border border-black w-full p-5 flex flex-col gap-3' key={i}>
                                <span>section {i + 1}: {section.title}</span>
                                <div className='w-[95%] self-end flex flex-col gap-4'>
                                    {section?.curriculum?.length > 0 && section?.curriculum.map((item, item_i) => {
                                        return (
                                            <div className='w-full flex flex-col p-2 bg-white border border-black' key={item_i}>
                                                <span className='flex w-full items-center justify-between gap-2 pe-10'>
                                                    <div className='flex gap-2'>
                                                        Lecture {item_i + 1}:<span className=' flex items-center gap-1'>{item.content_type !== '' ? contentIcons[item.content_type] : contentIcons['article']} {item.title}</span>
                                                    </div>
                                                    <div className='flex items-center gap-5'>
                                                        {(item.content == '' && isAddContent !== item.currId) && <span className='p-1 px-2 border flex items-center w-[max-content] border-black cursor-pointer' onClick={() => { setIsAddContent(item.currId); setSelectedType('') }}><IoMdAdd className='text-[1.2em]' />content</span>}
                                                        {isAddContent !== item.currId ? <FaAngleDown className='text-[1.2em] ' onClick={() => { setIsEditContent(''); setIsAddContent(item.currId); }} />
                                                            : <FaAngleUp className='text-[1.2em] ' onClick={() => { setIsAddContent(''); }} />}
                                                    </div>

                                                </span>
                                                {isAddContent == item.currId && <div className='w-full flex flex-col px-6 mt-3 relative border-t  gap-2 pt-3 pb-1 border-black'>
                                                    {(item.content !== '' && item.content.length !== 0) && <span className='self-end mt-1 absolute top-2 right-20 cursor-pointer' > {isEditContent !== item.currId ?
                                                        <span className='cursor-pointer' onClick={() => { setIsEditContent(item.currId); item.content_type == 'video' ? (setVideoUrl(item.content), setVideoFile(item.content)) : setArticleText(item.content) }}>
                                                            <FaRegEdit size={'1.3em'} />
                                                        </span> : item.content_type == 'video' && <span className='p-1 w-5 h-5 flex items-center justify-center bg-green-300 text-white rounded-full cursor-pointer' onClick={() => { item.content_type == 'video' ? addVideoContent(section.id, item.currId, videoFIle) : addContent(section.id, item.currId, articleText) }}>
                                                            <IoMdCheckmark size={'1.3em'} />
                                                        </span>}</span>
                                                    }
                                                    <span className='self-end mt-1 absolute top-2 right-10 cursor-pointer' onClick={() => { setIsAddContent(''); item.content == '' && addContentType('', section.id, item.currId) }}><IoClose size={'1.3em'} /></span>
                                                    {item.content_type == '' ? <>
                                                        <span className='mx-auto text-sm'>Select the main type of content. Files and links can be added as resources.</span>
                                                        <div className='flex gap-5 items-center justify-center w-full'>
                                                            <div className='flex flex-col items-center border border-gray-300' onClick={() => addContentType('video', section.id, item.currId)}>
                                                                <FaCirclePlay className='text-[1.4em] m-3  text-gray-300' />
                                                                <div className=' px-4 bg-gray-300 text-xs'>video</div>
                                                            </div>
                                                            <div className='flex flex-col items-center border border-gray-300' onClick={() => addContentType('article', section.id, item.currId)}>
                                                                <BsFileEarmark className='text-[1.4em] m-3 text-gray-300' />
                                                                <div className=' px-4 bg-gray-300 text-xs'>article</div>
                                                            </div>
                                                        </div>
                                                    </> : item.content_type == 'video' ? <div className=' mt-1  overflow-hidden flex gap-5 justify-center items-center mx-auto  w-full'>
                                                        {(item.content == '' || isEditContent == item.currId) ? //bg-slate-100 border rounded-md border-black w-[max-content]
                                                            <>
                                                                {/* <input className='w-96 p-2 outline-none' type='text' placeholder='enter url' value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}></input> */}
                                                                <div className='bg-slate-100 border mt-1 flex justify-between border-black w-[70%]'>
                                                                    <label htmlFor="lecture_video" className='w-full flex justify-between'>
                                                                        <span className='w-[80%] p-2'>{videoFIle?.name || 'no file selected'}</span>
                                                                        <span className='py-2 w-[20%] h-full flex items-center justify-center bg-white text-center font-bold border-l border-black'>{videoFIle ? 'replace ' : 'upload '}file</span>
                                                                    </label>

                                                                    <input type="file" name="" id="lecture_video" className='hidden' accept='video/*' onChange={(e) => { setVideoFile(e.target.files[0]); }} />

                                                                </div>
                                                                {item.content == '' && <span className='py-2 w-[max-content] h-[max-content]  px-2 bg-slate-800 text-white text-center font-bold ' onClick={() => { addVideoContent(section.id, item.currId, videoFIle); }}>done</span>}                                                    </>
                                                            : <>
                                                                {/* <span className='p-2 py-1 border-r bg-white text-blue-700 border-black me-2'>
                                                                <AiOutlineLink size={'1.2em'} />
                                                            </span>
                                                                <span className='w-96   flex items-center  bg-slate-100 border'>{item.content?.name}</span> */}
                                                                <table className='w-[80%] '>
                                                                    <tbody>

                                                                        <tr className='border-b'>
                                                                            <th className=' text-start px-2 py-2'>File</th>
                                                                            <th className=' text-start px-2 py-2'>type</th>
                                                                            <th className=' text-start px-2 py-2'>status</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='flex items-center gap-2 p-2'>{contentIcons.video} {item.content?.name}</td>
                                                                            <td className='p-2'>video</td>
                                                                            <td className='p-2'>{videoStatus.filter(vidstat => vidstat[item.currId])[0][item.currId] == 'processing' ?
                                                                                <div >
                                                                                    <p>{videoStatus.filter(vidstat => vidstat[item.currId])[0][item.currId]}</p>
                                                                                    <div className='w-20 h-2 rounded-full  bg-gray-500 animate-pulse'></div>
                                                                                </div>
                                                                                :
                                                                                <div>uploaded</div>
                                                                            }</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </>

                                                        }
                                                    </div> : <div className='flex flex-col gap-1 w-full'>
                                                        <label htmlFor="congratulations" className='font-bold capitalize'>Text</label>
                                                        {(item.content.length == 0 || isEditContent == item.currId) ?
                                                            <div className='flex flex-col gap-2 w-full'>
                                                                <Editor id={item.currId} sectId={section.id} onSave={onSave} data={item.content} />
                                                                {/* <textarea name="" className='h-[100px] p-2 w-full resize-none rounded-md outline-none border border-black' value={articleText} placeholder='write the article' onChange={(e) => setArticleText(e.target.value)}></textarea> */}
                                                                {/* {item.content == '' && <span className=' ' onClick={() => addContent(section.id, item.currId, articleText)}>done</span> 
                                                                }*/}
                                                            </div>
                                                            : <span className='w-full p-4 flex flex-col gradient-opacity border h-[250px] overflow-hidden relative'>{item.content.blocks.map((block, block_i) => {
                                                                const getHeaderText = () => {
                                                                    const headers = {
                                                                        h1: <h1 className='font-bold text-lg mb-2' dangerouslySetInnerHTML={{__html: block.data.text}}></h1>,
                                                                        h2: <h2 className='font-bold text-xl mb-2' dangerouslySetInnerHTML={{__html: block.data.text}}></h2>,
                                                                        h3: <h3 className='font-bold text-2xl mb-2' dangerouslySetInnerHTML={{__html: block.data.text}}></h3>,
                                                                        h4: <h4 className='font-bold text-3xl mb-2' dangerouslySetInnerHTML={{__html: block.data.text}}></h4>,
                                                                        h5: <h5 className='font-bold text-4xl mb-2' dangerouslySetInnerHTML={{__html: block.data.text}}></h5>,
                                                                        h6: <h6 className='font-bold text-5xl mb-2' dangerouslySetInnerHTML={{__html: block.data.text}}></h6>,

                                                                    }
                                                                    return headers[`h${block.data.level}`]
                                                                }
                                                                const getNestedList = (style, items, key) => {

                                                                    if (style === 'unordered') {
                                                                        return <ul className='list-disc ps-5'>
                                                                            {items.map((listItem, list_i) => {
                                                                                return <>
                                                                                    <li key={list_i + key} dangerouslySetInnerHTML={{__html: listItem.content}}></li>
                                                                                    {listItem.items.length > 0 && getNestedList('unordered', listItem.items, list_i + key)}
                                                                                </>
                                                                            })}
                                                                        </ul>
                                                                    }
                                                                    else {
                                                                        return <ol className='list-decimal ps-5'>
                                                                            {items.map((listItem, list_i) => {
                                                                                return <>
                                                                                    <li key={list_i + key} dangerouslySetInnerHTML={{__html: listItem.content}}></li>
                                                                                    {listItem.items.length > 0 && getNestedList('ordered', listItem.items, list_i + key)}
                                                                                </>
                                                                            })}
                                                                        </ol>
                                                                    }
                                                                }
                                                                return (
                                                                    <>
                                                                        {block.type == 'paragraph' ? <p dangerouslySetInnerHTML={{__html: block.data.text}} className='mb-2'></p>
                                                                            : block.type == 'header' ? getHeaderText()
                                                                                : block.type == 'nestedList' && getNestedList(block.data.style, block.data.items, 0)}
                                                                        <span className='absolute w-full text-end   py-1 rounded-b-md  right-0 bottom-0 text-gray-200 px-5 font-bold text-2xl'>...</span>                                                                   </>

                                                                )
                                                            })}</span>}
                                                    </div>}

                                                    <span className='px-2 py-1 border border-black mt-3 flex items-center gap-1 w-[max-content] font-semibold '><IoMdAdd size={'1.3em'} />Description</span>

                                                    <span className='px-2 py-1 border border-black flex items-center gap-1 font-semibold w-[max-content] '><IoMdAdd size={'1.3em'} />Resources</span>



                                                </div>}
                                            </div>
                                        )
                                    })}
                                    <span
                                        className={`font-semibold  flex  items-center  ${isCurrForm !== section.id && 'border bg-white border-black  w-[max-content] p-1 px-2 '}`}>
                                        <IoMdAdd size={'1.5em'} onClick={() => { HandleCurr(section.id); setSelectedType('') }} className={`${isCurrForm == section.id && 'transform -rotate-45 -translate-x-8'} cursor-pointer transition-all duration-300`} />
                                        {isCurrForm !== section.id ? <span className='ps-2 cursor-pointer' onClick={() => { setIsCurrForm(section.id); }}>
                                            curriculum</span>
                                            :
                                            <div className={`w-full h-[max-content] mt-5 p-2 px-3  bg-white border-black ${selectedType !== '' ? 'border ' : 'border border-dashed'}`}>
                                                {selectedType == '' ? <div className='flex items-center  justify-center gap-10'>
                                                    <div className='flex items-center gap-2 cursor-pointer' onClick={() => { setSelectedType('lecture'); }}>
                                                        <IoMdAdd className='text-[1.3em]' />
                                                        <span>Lecture</span>
                                                    </div>
                                                    <div className='flex items-center gap-2 cursor-pointer'>
                                                        <IoMdAdd className='text-[1.3em]' />
                                                        <span>Quiz</span>
                                                    </div>
                                                    <div className='flex items-center gap-2 cursor-pointer'>
                                                        <IoMdAdd className='text-[1.3em]' />
                                                        <span>Assignment</span>
                                                    </div>
                                                </div>
                                                    : selectedType == 'lecture' && <LectureForm addCurrItem={addCurrItem} sectId={section.id} setIsCurrForm={setIsCurrForm} setSelectedType={setSelectedType} />
                                                }
                                            </div>}
                                    </span>


                                </div>

                            </div>
                        )
                    })}
                    <span onClick={() => {
                        setIsSectForm(!isSectForm);
                        setSectionDetails({ title: '', objective: '' })
                    }}
                        className={`p-1 font-semibold px-2 w-[max-content] flex cursor-pointer  items-center ${!isSectForm && 'bg-slate-100 border border-black'}`}>
                        <IoMdAdd size={'1.5em'} className={`${isSectForm && 'transform -rotate-45 -translate-x-3'} transition-all duration-300`} />
                        {!isSectForm && 'section'}
                    </span>



                    {isSectForm && <form className='flex flex-col gap-3 border-[1px] p-5 border-black '>
                        <span className='font-semibold'>new section:</span>
                        <input type="text"
                            className='border-[1px] border-black p-1 px-2 w-full'
                            placeholder='Enter a Title' value={sectionDetails.title} onChange={(e) => setSectionDetails({ ...sectionDetails, title: e.target.value })} name="" id="" />
                        <span className='w-full'>
                            <label htmlFor="whatfor" className='font-semibold'>What will students be able to do at the end of this section?</label><br />
                            <input type="text"
                                className='border-[1px] border-black p-1 px-2 w-full'
                                name="" placeholder='Enter a Learning Objective' value={sectionDetails.objective} onChange={(e) => setSectionDetails({ ...sectionDetails, objective: e.target.value })} id="whatfor" />
                        </span>

                        <div className='flex justify-start items-center gap-3 font-semibold'>
                            <span onClick={() => {
                                setIsSectForm(!isSectForm);
                                setSectionDetails({ title: '', objective: '' })
                            }} className='cursor-pointer'>cancel</span>
                            <span className='py-1 px-2 bg-slate-800 text-white cursor-pointer' onClick={addSection}>add</span>
                        </div>
                    </form>}
                    {!saved && <span className='py-1 px-3 bg-slate-800 text-white font-bold cursor-pointer w-[max-content]' onClick={saveIntoFilled}>save</span>}

                </div>

            </div>
        </SectionLayout>
    )
}

export default Curriculum
