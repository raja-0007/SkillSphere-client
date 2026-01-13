import React, { useEffect, useState } from 'react'
import SectionLayout from '../SectionLayout'
import SectionHeader from '../SectionHeader'
import { Info, Plus, FileText, Play, ChevronDown, X, Edit, Check, ChevronUp, Link } from 'lucide-react'
import LectureForm from './LectureForm';
import { useTeacherContext } from '@contexts/TeacherContext';
import axios from 'axios';
import Editor from './Editor';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';








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
        article: <FileText className="w-4 h-4" />,
        video: <Play className="w-4 h-4" />
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
        console.log("currrr",title, id)
        if (title !== '') {

            const curriculum = {
                title: title,
                type: selectedType,
                content: { blocks: [] },
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
        setSections(sections.map(sect => sect.id == sectId ? { ...sect, curriculum: sect.curriculum.map(curr => curr.currId == currId ? { ...curr, content_type: value, content: value === 'video' ? '' : { blocks: [] } } : curr) } : sect))
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
                {!dismiss && <div className='border-2 border-dashed border-neutral-300 p-5 py-3'>
                    <div className='flex  items-start'>
                        <Info size={32} className='text-primary me-4' />
                        <p className='font-bold text-foreground'>Here’s where you add course content—like lectures, course sections, assignments, and more. Click a + icon on the left to get started.</p>

                    </div>
                    <Button 
                        variant="default" 
                        size="sm" 
                        className="mt-2 ms-10" 
                        onClick={() => setDismiss(true)}
                    >
                        Dismiss
                    </Button>
                </div>}
                <div>
                    <p className='mb-2 text-foreground'>Start putting together your course by creating sections, lectures and practice (quizzes, coding exercises and assignments).</p>

                    Start putting together your course by creating sections, lectures and practice activities (quizzes, coding exercises and assignments). Use your course outline to structure your content and label your sections and lectures clearly. If you’re intending to offer your course for free, the total length of video content must be less than 2 hours.
                </div>

                <div className='flex flex-col gap-6 pb-10'>
                    {sections.map((section, i) => {
                        return (
                            <Card className='w-full' key={i}>
                                <CardContent className='p-5 flex flex-col gap-3'>
                                    <div className='flex items-center justify-between'>
                                        <Badge variant="outline" className="text-sm font-medium">
                                            Section {i + 1}: {section.title}
                                        </Badge>
                                    </div>
                                    <div className='w-[95%] self-end flex flex-col gap-4'>
                                    {section?.curriculum?.length > 0 && section?.curriculum.map((item, item_i) => {
                                        return (
                                            <Card className='w-full border-muted' key={item_i}>
                                                <CardContent className='p-4'>
                                                    <div className='flex w-full items-center justify-between gap-2'>
                                                        <div className='flex gap-2 items-center'>
                                                            <Badge variant="secondary" className="text-xs">
                                                                Lecture {item_i + 1}
                                                            </Badge>
                                                            <div className='flex items-center gap-2'>
                                                                {item.content_type !== '' ? contentIcons[item.content_type] : contentIcons['article']} 
                                                                <span className="font-medium">{item.title}</span>
                                                            </div>
                                                        </div>
                                                        <div className='flex items-center gap-3'>
                                                            {(typeof item.content === 'object' && (!item.content.blocks || item.content.blocks.length === 0) && isAddContent !== item.currId) && 
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm" 
                                                                    onClick={() => { setIsAddContent(item.currId); setSelectedType('') }}
                                                                    className="gap-1"
                                                                >
                                                                    <Plus className='w-4 h-4' />
                                                                    Content
                                                                </Button>
                                                            }
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                onClick={() => { 
                                                                    isAddContent !== item.currId 
                                                                        ? (setIsEditContent(''), setIsAddContent(item.currId))
                                                                        : setIsAddContent('')
                                                                }}
                                                            >
                                                                {isAddContent !== item.currId ? 
                                                                    <ChevronDown className='w-4 h-4' /> : 
                                                                    <ChevronUp className='w-4 h-4' />
                                                                }
                                                            </Button>
                                                        </div>
                                                    </div>
                                                {isAddContent == item.currId && <div className='w-full flex flex-col px-6 mt-3 relative border-t  gap-2 pt-3 pb-1 border-neutral-400'>
                                                    {(typeof item.content === 'object' && item.content.blocks && item.content.blocks.length > 0) && 
                                                        <div className='absolute top-2 right-16'>
                                                            {isEditContent !== item.currId ? (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon-sm"
                                                                    onClick={() => { 
                                                                        setIsEditContent(item.currId); 
                                                                        item.content_type == 'video' ? (setVideoUrl(item.content), setVideoFile(item.content)) : setArticleText(item.content) 
                                                                    }}
                                                                >
                                                                    <Edit className='w-4 h-4' />
                                                                </Button>
                                                            ) : item.content_type == 'video' && (
                                                                <Button
                                                                    variant="success"
                                                                    size="icon-sm"
                                                                    onClick={() => { 
                                                                        item.content_type == 'video' ? addVideoContent(section.id, item.currId, videoFIle) : addContent(section.id, item.currId, articleText) 
                                                                    }}
                                                                >
                                                                    <Check className='w-4 h-4' />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    }
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        className='absolute top-2 right-2'
                                                        onClick={() => { 
                                                            setIsAddContent(''); 
                                                            typeof item.content === 'object' && (!item.content.blocks || item.content.blocks.length === 0) && addContentType('', section.id, item.currId) 
                                                        }}
                                                    >
                                                        <X className='w-4 h-4' />
                                                    </Button>
                                                    {item.content_type == '' ? <>
                                                        <span className='mx-auto text-sm'>Select the main type of content. Files and links can be added as resources.</span>
                                                        <div className='flex gap-5 items-center justify-center w-full'>
                                                            <Card className='cursor-pointer transition-colors-fast hover:bg-muted border-muted' onClick={() => addContentType('video', section.id, item.currId)}>
                                                                <CardContent className='flex flex-col items-center p-4'>
                                                                    <Play className='w-8 h-8 mb-2 text-muted-foreground' />
                                                                    <Badge variant="secondary" className='text-xs'>Video</Badge>
                                                                </CardContent>
                                                            </Card>
                                                            <Card className='cursor-pointer transition-colors-fast hover:bg-muted border-muted' onClick={() => addContentType('article', section.id, item.currId)}>
                                                                <CardContent className='flex flex-col items-center p-4'>
                                                                    <FileText className='w-8 h-8 mb-2 text-muted-foreground' />
                                                                    <Badge variant="secondary" className='text-xs'>Article</Badge>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    </> : item.content_type == 'video' ? <div className=' mt-1  overflow-hidden flex gap-5 justify-center items-center mx-auto  w-full'>
                                                        {(item.content == '' || isEditContent == item.currId) ? // bg-neutral-100 border rounded-md border-neutral-400 w-[max-content]
                                                            <>
                                                                {/* <input className='w-96 p-2 outline-none' type='text' placeholder='enter url' value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}></input> */}
                                                                <Card className='w-[70%] border-muted'>
                                                                    <CardContent className='p-0'>
                                                                        <label htmlFor="lecture_video" className='w-full flex'>
                                                                            <div className='flex-1 p-3 text-sm text-muted-foreground'>
                                                                                {videoFIle?.name || 'No file selected'}
                                                                            </div>
                                                                            <Button 
                                                                                variant="outline" 
                                                                                size="sm" 
                                                                                className='rounded-none border-l border-t-0 border-r-0 border-b-0'
                                                                                asChild
                                                                            >
                                                                                <span>{videoFIle ? 'Replace' : 'Upload'} File</span>
                                                                            </Button>
                                                                        </label>
                                                                        <input 
                                                                            type="file" 
                                                                            id="lecture_video" 
                                                                            className='hidden' 
                                                                            accept='video/*' 
                                                                            onChange={(e) => { setVideoFile(e.target.files[0]); }} 
                                                                        />
                                                                    </CardContent>
                                                                </Card>
                                                                {item.content == '' && (
                                                                    <Button 
                                                                        onClick={() => { addVideoContent(section.id, item.currId, videoFIle); }}
                                                                        className="w-auto"
                                                                    >
                                                                        Done
                                                                    </Button>
                                                                )}                                                    </>
                                                            : <>
                                                                {/* <span className='p-2 py-1 border-r bg-white text-blue-700 border-black me-2'>
                                                                <AiOutlineLink size={'1.2em'} />
                                                            </span>
                                                                <span className='w-96   flex items-center  bg-neutral-100 border border-neutral-400'>{item.content?.name}</span> */}
                                                                <Card className='w-[80%]'>
                                                                    <CardContent className='p-0'>
                                                                        <div className='border-b border-muted p-3'>
                                                                            <div className='grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground'>
                                                                                <span>File</span>
                                                                                <span>Type</span>
                                                                                <span>Status</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className='p-3'>
                                                                            <div className='grid grid-cols-3 gap-4 items-center text-sm'>
                                                                                <div className='flex items-center gap-2'>
                                                                                    {contentIcons.video} 
                                                                                    <span className="truncate">{item.content?.name}</span>
                                                                                </div>
                                                                                <Badge variant="outline" className="w-fit">Video</Badge>
                                                                                <div>
                                                                                    {videoStatus.filter(vidstat => vidstat[item.currId])[0][item.currId] == 'processing' ? (
                                                                                        <div className='flex items-center gap-2'>
                                                                                            <Badge variant="warning">Processing</Badge>
                                                                                            <div className='w-16 h-2 rounded-full bg-muted animate-pulse'></div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <Badge variant="success">Uploaded</Badge>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            </>

                                                        }
                                                    </div> : <div className='flex flex-col gap-1 w-full'>
                                                        <label htmlFor="congratulations" className='font-bold capitalize'>Text</label>
                                                        {(typeof item.content === 'object' && (!item.content.blocks || item.content.blocks.length === 0) || isEditContent == item.currId) ?
                                                            <div className='flex flex-col gap-2 w-full'>
                                                                <Editor 
                                                                    key={`editor-${item.currId}`}
                                                                    id={`editor-${item.currId}`} 
                                                                    sectId={section.id} 
                                                                    onSave={onSave} 
                                                                    data={item.content} 
                                                                />
                                                                {/* <textarea name="" className='h-[100px] p-2 w-full resize-none rounded-md outline-none border border-black' value={articleText} placeholder='write the article' onChange={(e) => setArticleText(e.target.value)}></textarea> */}
                                                                {/* {item.content == '' && <span className=' ' onClick={() => addContent(section.id, item.currId, articleText)}>done</span> 
                                                                }*/}
                                                            </div>
                                                            : <span className='w-full p-4 flex flex-col gradient-opacity border border-neutral-300 min-h-[250px] relative'>{item.content.blocks.map((block, block_i) => {
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
                                                                        <span className='absolute w-full text-end py-1 rounded-b-md right-0 bottom-0 text-neutral-300 px-5 font-bold text-2xl'>...</span>                                                                   </>

                                                                )
                                                            })}</span>}
                                                    </div>}

                                                    <div className='flex gap-3 mt-4'>
                                                        <Button variant="outline" size="sm" className="gap-1">
                                                            <Plus className='w-4 h-4' />
                                                            Description
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="gap-1">
                                                            <Plus className='w-4 h-4' />
                                                            Resources
                                                        </Button>
                                                    </div>

                                                </div>}
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                    </div>
                                    <div className={`font-semibold flex items-center ${isCurrForm !== section.id && 'w-fit'}`}>
                                        <Button
                                            variant={isCurrForm === section.id ? "ghost" : "outline"}
                                            size="sm"
                                            onClick={() => { HandleCurr(section.id); setSelectedType('') }}
                                            className={`gap-2 ${isCurrForm == section.id && 'transform'}`}
                                        >
                                            <Plus className={`w-4 h-4 ${isCurrForm == section.id && 'transform -rotate-45'} transition-all duration-300`} />
                                            {isCurrForm !== section.id && 'Curriculum'}
                                        </Button>
                                        {isCurrForm === section.id && (
                                            <Card className={`w-full mt-5 ${selectedType !== '' ? 'border-solid' : 'border-dashed'} border-muted`}>
                                                <CardContent className='p-4'>
                                                    {selectedType == '' ? (
                                                        <div className='flex items-center justify-center gap-6'>
                                                            <Button
                                                                variant="outline"
                                                                className="gap-2"
                                                                onClick={() => { setSelectedType('lecture'); }}
                                                            >
                                                                <Plus className='w-4 h-4' />
                                                                Lecture
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                className="gap-2"
                                                            >
                                                                <Plus className='w-4 h-4' />
                                                                Quiz
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                className="gap-2"
                                                            >
                                                                <Plus className='w-4 h-4' />
                                                                Assignment
                                                            </Button>
                                                        </div>
                                                    ) : selectedType == 'lecture' && (
                                                        <LectureForm 
                                                            addCurrItem={addCurrItem} 
                                                            sectId={section.id} 
                                                            setIsCurrForm={setIsCurrForm} 
                                                            setSelectedType={setSelectedType} 
                                                        />
                                                    )}
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                    <Button
                        variant={isSectForm ? "ghost" : "outline"}
                        size="sm"
                        onClick={() => {
                            setIsSectForm(!isSectForm);
                            setSectionDetails({ title: '', objective: '' })
                        }}
                        className="gap-2 w-fit"
                    >
                        <Plus className={`w-4 h-4 ${isSectForm && 'transform -rotate-45'} transition-all duration-300`} />
                        {!isSectForm && 'Section'}
                    </Button>



                    {isSectForm && (
                        <Card className='border-muted'>
                            <CardContent className='p-5'>
                                <h3 className='font-semibold mb-4'>New Section:</h3>
                                <div className='space-y-4'>
                                    <div>
                                        <Input
                                            type="text"
                                            placeholder='Enter a Title'
                                            value={sectionDetails.title}
                                            onChange={(e) => setSectionDetails({ ...sectionDetails, title: e.target.value })}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="whatfor" className='block font-semibold mb-2'>
                                            What will students be able to do at the end of this section?
                                        </label>
                                        <Input
                                            type="text"
                                            id="whatfor"
                                            placeholder='Enter a Learning Objective'
                                            value={sectionDetails.objective}
                                            onChange={(e) => setSectionDetails({ ...sectionDetails, objective: e.target.value })}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className='flex justify-start items-center gap-3'>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setIsSectForm(!isSectForm);
                                                setSectionDetails({ title: '', objective: '' })
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button onClick={addSection}>
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {!saved && (
                        <Button 
                            onClick={saveIntoFilled}
                            className="w-fit font-bold"
                        >
                            Save
                        </Button>
                    )}

                </div>

            </div>
        </SectionLayout>
    )
}

export default Curriculum
