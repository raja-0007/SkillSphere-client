import React, { useEffect, useRef } from 'react'

import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic for client-side rendering

// Dynamically import EditorJS to ensure it's only loaded on the client-side
// const EditorJS = dynamic(() =>  import('@editorjs/editorjs'), { ssr: false });
// import EditorJS from '@editorjs/editorjs'
// import List from '@editorjs/list';
// import headerUmd from '@editorjs/header';
// import NestedList from '@editorjs/nested-list'

function Editor({ id='', sectId='', onSave, data }) {

    const editorInstance = useRef(null);

    useEffect(() => {
        // console.log(data)
        // Initialize EditorJS instance when component mounts on the client-side
        const initializeEditor = async () => {

            const EditorJS = (await import('@editorjs/editorjs')).default;
            const Header = (await import('@editorjs/header')).default;
            // const List = (await import('@editorjs/list')).default;
            const NestedList = (await import('@editorjs/nested-list')).default;

            if (!editorInstance.current) {

                editorInstance.current = new EditorJS({
                    holder: id,
                    autofocus: true,
                    tools: {
                        header: {
                            class: Header,
                            inlineToolbar: true
                        },
                        // list: List,
                        nestedList: {
                            class: NestedList,
                            inlineToolbar: true
                        }
                    },
                    data:data

                    // Configure your tools here
                });
            }

        }

        // Clean up editor instance when component unmounts
        // return () => {
        //   if (editorInstance.current) {
        //     editorInstance.current.destroy();
        //     editorInstance.current = null;
        //   }
        // };
        initializeEditor()
    }, []); // Ensure useEffect runs whenever id or defaultData changes

    const handleSave = async (e) => {
        e.preventDefault()
        if (editorInstance.current) {
            try {
                const savedData = await editorInstance.current.save();
                // console.log(savedData);
                onSave(id, sectId, savedData)

            } catch (error) {
                console.error('Save failed', error);
            }
        }
    };
    


    return (
        <div className='flex items-start w-full flex-col'>
            <div id={id} className='h-[250px] overflow-y-auto w-full' style={{ border: '1px solid #ccc', padding: '10px' }} />
            <button className='mt-2 self-end relative z-20 py-1 w-[max-content] px-2 bg-slate-800 text-white text-center font-bold cursor-pointer' onClick={(e) => handleSave(e)}>Save</button>
        </div>
    )
}

export default Editor
