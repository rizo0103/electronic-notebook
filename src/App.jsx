// src/App.jsx
import { useState } from "react";
import "./App.css";
import { useNotes } from "./hooks/useNotes";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

function App() {
    const { notes, handleAddNote, handleDeleteNote, handleRenameNote, handleReloadNotes } = useNotes();
    const [activeNoteId, setActiveNoteId] = useState(null);

    const activeNote = notes.find(note => note.id === activeNoteId);

    return (
        <main className="app-container">
            <Sidebar
                notes={notes}
                activeNoteId={activeNoteId}
                setActiveNoteId={setActiveNoteId}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                onRenameNote={handleRenameNote}
            />
            <Editor
                key={activeNoteId} // Important: This resets the Editor when the note changes
                activeNote={activeNote}
                onNoteUpdate={handleReloadNotes}
            />
        </main>
    );
}

export default App;
