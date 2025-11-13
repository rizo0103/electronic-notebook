// src/components/Editor.jsx
import React from 'react';
import HandwritingCanvas from './HandwritingCanvas';

const Editor = ({ activeNote, onNoteUpdate }) => {

    const handleSave = async () => {
        if (!activeNote) return;
        // The logic to get canvas data and save will be added here later
        console.log("Save button clicked");
        // Example: await updateNote(activeNote.id, { content: canvasData });
        if (onNoteUpdate) {
            onNoteUpdate();
        }
    };

    if (!activeNote) {
        return <div className="editor empty">Select or create a note to get started.</div>;
    }

    return (
            <HandwritingCanvas
                className="note-editor"
                key={activeNote.id} // Re-mount canvas when note changes
                content={activeNote.content}
                noteId={activeNote.id}
            />
    );
};

export default Editor;
