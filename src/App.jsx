// src/App.jsx
import { useState, useRef, useEffect } from "react";
import "./App.css";
import { useNotes } from "./hooks/useNotes";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

function App() {
    const { notes, handleAddNote, handleDeleteNote, handleRenameNote, handleReloadNotes } = useNotes();
    const [ activeNoteId, setActiveNoteId ] = useState(null);
    const [ isSidebarVisible, setIsSidebarVisible ] = useState(false);
    const sidebarRef = useRef(null);
    const sidebarOpenBtnRef = useRef(null);

    const activeNote = notes.find(note => note.id === activeNoteId);

    const openSidebar = () => setIsSidebarVisible(true);
    const closeSidebar = () => setIsSidebarVisible(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                closeSidebar();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarVisible]);

    return (
        <main className="app-container">
            <Sidebar
                notes={notes}
                activeNoteId={activeNoteId}
                setActiveNoteId={setActiveNoteId}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                onRenameNote={handleRenameNote}
                isOpen={isSidebarVisible}
                onOpenSidebar={openSidebar}
                onCloseSidebar={closeSidebar}
                sidebarRef={sidebarRef}
                sidebarOpenBtnRef={sidebarOpenBtnRef}
            />
            <Editor
                key={activeNoteId} // Important: This resets the Editor when the note changes
                activeNote={activeNote}
                onNoteUpdate={handleReloadNotes}
                onOpenSidebar={openSidebar}
            />
        </main>
    );
}

export default App;
