// src/components/Sidebar.jsx
import React from 'react';
import NoteList from './NoteList';
import { VscMenu } from 'react-icons/vsc';

const Sidebar = ({
    notes,
    activeNoteId,
    setActiveNoteId,
    onAddNote,
    onDeleteNote,
    onRenameNote,
    isOpen,
    onOpenSidebar,
    onCloseSidebar,
    sidebarRef,
    sidebarOpenBtnRef,
}) => {
    const handleAddNote = async () => {
        const newNoteId = await onAddNote();
        setActiveNoteId(newNoteId); // Select the new note
    };

    return (
        <>
            {!isOpen && (
                <button ref={sidebarOpenBtnRef} className="sidebar-open-btn" onClick={onOpenSidebar} aria-label="Open sidebar">
                    <VscMenu />
                </button>
            )}
            <aside ref={sidebarRef} className={`sidebar ${isOpen ? 'active' : ''}`}>
                {isOpen && (
                    <>
                        <div className="sidebar-header">
                            <button className="sidebar-close-btn" onClick={onCloseSidebar} aria-label="Close sidebar">
                                Close
                            </button>
                            <h2 className={`logo ${isOpen ? 'active' : ''}`}>Notebook</h2>
                        </div>
                        <button className={`add-btn ${isOpen ? 'active' : ''}`} onClick={handleAddNote}>+ New Note</button>
                        <NoteList
                            notes={notes}
                            activeNoteId={activeNoteId}
                            setActiveNoteId={setActiveNoteId}
                            onDeleteNote={onDeleteNote}
                            onRenameNote={onRenameNote}
                        />
                    </>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
