// src/components/Sidebar.jsx
import React, { useLayoutEffect, useState } from 'react';
import NoteList from './NoteList';
import { VscMenu } from 'react-icons/vsc';
import { getAllNotes } from '../services/noteService';

const Sidebar = ({ notes, activeNoteId, setActiveNoteId, onAddNote, onDeleteNote, onRenameNote, isOpen, onCloseSidebar, onOpenSidebar, sidebarRef, }) => {
    const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);
    const [ noteId, setNoteId ] = useState(activeNoteId ? activeNoteId : 0);

    const handleAddNote = async () => {
        const newNoteId = await onAddNote();
        setActiveNoteId(newNoteId); // Select the new note
    };

    useLayoutEffect(() => {
        async function getFirstNote() {
            if (!activeNoteId) {
                const data = await getAllNotes();

                setNoteId(data[0].id);
            }
        }

        getFirstNote();
    }, []);

    if (!isOpen) {
        return <button className='sidebar-toggle' onClick={() => onOpenSidebar()}> <VscMenu /> </button>
    }


    return (
        <aside ref={sidebarRef} className={`sidebar ${isOpen ? 'active' : ''}`}>
            <div className="sidebar-header">
                <h2 className={`logo ${isOpen ? 'active' : ''}`}>Notebook</h2>
            </div>
            <button className={`add-btn ${isOpen ? 'active' : ''}`} onClick={handleAddNote}>+ New Note</button>
            <NoteList
                notes={notes}
                activeNoteId={noteId}
                setActiveNoteId={setActiveNoteId}
                onDeleteNote={onDeleteNote}
                onRenameNote={onRenameNote}
            />
        </aside>
    );
};

export default Sidebar;
