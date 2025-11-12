// src/components/Sidebar.jsx
import React from 'react';
import NoteList from './NoteList';

const Sidebar = ({
    notes,
    activeNoteId,
    setActiveNoteId,
    onAddNote,
    onDeleteNote,
    onRenameNote
}) => {

    const handleAddNote = async () => {
        const newNoteId = await onAddNote();
        setActiveNoteId(newNoteId); // Select the new note
    };

    return (
        <aside className='sidebar'>
            <h2 className='logo'>Notebook</h2>
            <button className='add-btn' onClick={handleAddNote}>+ New Note</button>
            <NoteList
                notes={notes}
                activeNoteId={activeNoteId}
                setActiveNoteId={setActiveNoteId}
                onDeleteNote={onDeleteNote}
                onRenameNote={onRenameNote}
            />
        </aside>
    );
};

export default Sidebar;
