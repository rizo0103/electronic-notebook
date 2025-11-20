// src/components/Editor.jsx
import React, { useLayoutEffect, useState } from 'react';
import HandwritingCanvas from './HandwritingCanvas';
import { getAllNotes } from '../services/noteService';

const Editor = ({ activeNote, onOpenSidebar }) => {
    const [ content, setContent ] = useState(activeNote ? activeNote.content : '');
    const [ noteId, setNoteId ] = useState(activeNote ? activeNote.id : 0);

    useLayoutEffect(() => {
        async function getFirstNote () {
            if (!activeNote) {
                const data = await getAllNotes();
                
                setContent(await data[0].content);
                setNoteId(await data[0].id);
            }
        }

        getFirstNote();
        
    }, []);

    return (
        <HandwritingCanvas
            className="note-editor"
            key={noteId} // Re-mount canvas when note changes
            content={content}
            noteId={noteId}
            onOpenSidebar={onOpenSidebar}
        />
    );
};

export default Editor;
