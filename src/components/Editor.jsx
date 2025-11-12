// src/components/Editor.jsx
import React, { useState, useEffect } from 'react';
import { updateNote } from '../services/noteService';
import HandwritingCanvas from './HandwritingCanvas';

const Editor = ({ activeNote, onNoteUpdate }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        // When the active note changes, update the editor's content
        setContent(activeNote ? activeNote.content : '');
    }, [activeNote]);

    const handleSave = async () => {
        if (!activeNote) return;

        await updateNote(activeNote.id, { content });
        // Notify the parent component that a note has been updated
        // so the sidebar can refresh its timestamps.
        if (onNoteUpdate) {
            onNoteUpdate();
        }
    };

    if (!activeNote) {
        return <div className="editor empty">Select or create a note to get started.</div>;
    }

    return (
        <section className='editor'>
            <div className="editor-toolbar">
                <button className="tool-btn active" title='Text mode'>📝</button>
                <button className="tool-btn" title='Handwriting mode'>✍️</button>
                <button className="tool-btn" title='Color picker'>🎨</button>
                <button className="tool-btn" title='Eraser'>🧽</button>
                <button className="tool-btn" title='Undo'>↩️</button>
                <button className="tool-btn" title='Redo'>↪️</button>
            </div>
            {/* <textarea
                className="note-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
            /> */}
            <HandwritingCanvas className="note-editor" />
            <button className='save-btn' onClick={handleSave} title="Save">
                Save
            </button>
        </section>
    );
};

export default Editor;
