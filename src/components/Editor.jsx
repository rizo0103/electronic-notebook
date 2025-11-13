// src/components/Editor.jsx
import React from 'react';
import HandwritingCanvas from './HandwritingCanvas';

const Editor = ({ activeNote }) => {
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
