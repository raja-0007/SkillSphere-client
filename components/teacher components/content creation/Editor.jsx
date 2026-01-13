import React, { useEffect, useRef, useState } from 'react'

function EditorComponent({ id='', sectId='', onSave, data }) {
    const editorInstance = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        
        // Initialize EditorJS instance when component mounts on the client-side
        const initializeEditor = async () => {
            try {
                console.log(`[Editor ${id}] Initializing editor with data:`, data);
                
                // Clean up any existing instance
                if (editorInstance.current) {
                    try {
                        console.log(`[Editor ${id}] Destroying previous instance`);
                        if (typeof editorInstance.current.destroy === 'function') {
                            const destroyPromise = editorInstance.current.destroy();
                            if (destroyPromise && typeof destroyPromise.then === 'function') {
                                await destroyPromise;
                            }
                        }
                    } catch (e) {
                        console.warn(`[Editor ${id}] Error destroying previous editor instance:`, e);
                    }
                    editorInstance.current = null;
                }

                // Dynamic imports for EditorJS
                console.log(`[Editor ${id}] Loading EditorJS modules...`);
                const [EditorJS, Header, NestedList] = await Promise.all([
                    import('@editorjs/editorjs').then(mod => mod.default),
                    import('@editorjs/header').then(mod => mod.default),
                    import('@editorjs/nested-list').then(mod => mod.default)
                ]);
                console.log(`[Editor ${id}] EditorJS modules loaded successfully`);

                // Ensure the DOM element exists
                const holder = document.getElementById(id);
                if (!holder) {
                    console.error(`[Editor ${id}] Editor holder element with id "${id}" not found`);
                    if (isMounted) {
                        setError(`Editor container not found: ${id}`);
                    }
                    return;
                }

                console.log(`[Editor ${id}] Found holder element:`, holder);

                // Clear the holder content
                holder.innerHTML = '';

                // Prepare data - ensure it's in the correct format
                let editorData = data;
                if (typeof data === 'string' || !data || !data.blocks) {
                    editorData = { blocks: [] };
                    console.log(`[Editor ${id}] Data normalized to empty blocks`);
                } else {
                    console.log(`[Editor ${id}] Using provided data:`, editorData);
                }

                if (isMounted) {
                    console.log(`[Editor ${id}] Creating EditorJS instance...`);
                    editorInstance.current = new EditorJS({
                        holder: id,
                        autofocus: false,
                        placeholder: 'Start writing your content...',
                        minHeight: 200,
                        tools: {
                            header: {
                                class: Header,
                                inlineToolbar: true,
                                config: {
                                    placeholder: 'Enter a header',
                                    levels: [1, 2, 3, 4, 5, 6],
                                    defaultLevel: 2
                                }
                            },
                            nestedList: {
                                class: NestedList,
                                inlineToolbar: true,
                                config: {
                                    defaultStyle: 'unordered'
                                }
                            }
                        },
                        data: editorData,
                        onReady: () => {
                            console.log(`[Editor ${id}] EditorJS ready!`);
                            if (isMounted) {
                                setIsReady(true);
                                setError(null);
                            }
                        },
                        onChange: (api, event) => {
                            console.log(`[Editor ${id}] Content changed:`, event);
                        }
                    });
                    console.log(`[Editor ${id}] EditorJS instance created`);
                }
            } catch (err) {
                console.error(`[Editor ${id}] Failed to initialize EditorJS:`, err);
                if (isMounted) {
                    setError(err.message);
                }
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            console.log(`[Editor ${id}] Starting initialization...`);
            initializeEditor();
        }, 500);

        return () => {
            isMounted = false;
            clearTimeout(timer);
            
            if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
                console.log(`[Editor ${id}] Cleanup: destroying editor instance`);
                try {
                    const destroyPromise = editorInstance.current.destroy();
                    if (destroyPromise && typeof destroyPromise.catch === 'function') {
                        destroyPromise.catch(console.error);
                    }
                } catch (error) {
                    console.error(`[Editor ${id}] Error during cleanup:`, error);
                }
                editorInstance.current = null;
            }
        };
    }, [id]); // Only re-initialize when id changes, not data

    const handleSave = async (e) => {
        e.preventDefault();
        console.log(`[Editor ${id}] Save button clicked, isReady:`, isReady);
        if (editorInstance.current && isReady) {
            try {
                const savedData = await editorInstance.current.save();
                console.log(`[Editor ${id}] Saving editor data:`, savedData);
                onSave(id, sectId, savedData);
            } catch (error) {
                console.error(`[Editor ${id}] Save failed:`, error);
                setError('Failed to save content');
            }
        } else {
            console.warn(`[Editor ${id}] Cannot save - editor not ready or instance missing`);
        }
    };

    console.log(`[Editor ${id}] Rendering - isReady: ${isReady}, error: ${error}`);

    if (error) {
        return (
            <div className='flex items-start w-full flex-col'>
                <div className='w-full p-4 border border-red-300 bg-red-50 text-red-700 rounded'>
                    <p>Editor failed to load: {error}</p>
                    <p className='text-sm mt-2'>Please refresh the page and try again.</p>
                    <p className='text-xs mt-1'>Editor ID: {id}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex items-start w-full flex-col'>
            <div className='relative w-full border border-input rounded-md bg-background' style={{ overflow: 'hidden' }}>
                <div 
                    id={id} 
                    className='min-h-[200px] w-full editor-container' 
                    style={{ 
                        padding: '16px',
                        minHeight: '200px',
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }} 
                />
                {!isReady && (
                    <div className='absolute inset-0 flex items-center justify-center bg-background/75 rounded'>
                        <div className='text-sm text-muted-foreground'>Loading editor... (ID: {id})</div>
                    </div>
                )}
            </div>
            <button 
                className='mt-2 self-end relative z-20 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-primary-foreground text-sm font-medium cursor-pointer rounded transition-colors-fast disabled:opacity-50' 
                onClick={handleSave}
                disabled={!isReady}
            >
                Save {isReady ? '✓' : '...'}
            </button>
        </div>
    )
}

// Export as dynamic component to prevent SSR issues
export default EditorComponent
