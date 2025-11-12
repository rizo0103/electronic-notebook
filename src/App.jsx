/* eslint-disable no-unused-vars */
// src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./db";
import Sidebar from "./components/Sidebar";

function App() {
    const [notes, setNotes] = useState([]);
	const [activeNote, setActiveNote] = useState(null);
	const [text, setText] = useState("");

	// Load notes from Dexie (newest first)
	useEffect(() => {
		const loadNotes = async () => {
			const all = await db.notes.orderBy("updatedAt").reverse().toArray();
			setNotes(all);
		};
		loadNotes();
	}, []);

	// helper to refresh local state from DB
	const refreshNotes = async (selectId = null) => {
		const all = await db.notes.orderBy("updatedAt").reverse().toArray();
		setNotes(all);
		if (selectId !== null) setActiveNote(selectId);
		// if the selected note was removed, clear editor
		if (selectId === null && activeNote === null) setText("");
	};

	const addNote = async () => {
		const timestamp = Date.now();
		const id = await db.notes.add({
			title: "Untitled",
			content: "",
			createdAt: timestamp,
			updatedAt: timestamp,
		});
		// reload notes and select the new one
		const all = await db.notes.orderBy("updatedAt").reverse().toArray();
		setNotes(all);
		setActiveNote(id);
		setText("");
	};

	const saveNote = async () => {
		if (!activeNote) return;
		const now = Date.now();
		await db.notes.update(activeNote, {
			content: text,
			updatedAt: now,
		});
		// refresh notes so order and timestamps are up-to-date
		const all = await db.notes.orderBy("updatedAt").reverse().toArray();
		setNotes(all);
	};

	const deleteNote = async (id) => {
		const confirmed = confirm("Delete this note?");
		if (!confirmed) return;
		await db.notes.delete(id);
		// if deleted note was active, clear editor
		if (id === activeNote) {
			setActiveNote(null);
			setText("");
		}
		const all = await db.notes.orderBy("updatedAt").reverse().toArray();
		setNotes(all);
	};

	const selectNote = async (note) => {
		setActiveNote(note.id);
		setText(note.content || "");
	};

	const renameNote = async (note) => {
		const newTitle = prompt("Rename note:", note.title || "Untitled");
		if (newTitle === null) return; // cancelled
		await db.notes.update(note.id, {
			title: newTitle,
			updatedAt: Date.now(),
		});
		const all = await db.notes.orderBy("updatedAt").reverse().toArray();
		setNotes(all);
	};

  return (
        <div className="app-container">
            {/* <aside className="sidebar">
                <h2 className="logo">Notebook</h2>
                <button className="add-btn" onClick={addNote}>+ New Note</button>
                <div className="note-list">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            className={`note-item ${activeNote === note.id ? "active" : ""}`}
                            onClick={() => selectNote(note)}
                            onDoubleClick={() => renameNote(note)}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" }}>
                                    {note.title || "Untitled"}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNote(note.id);
                                    }}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: activeNote === note.id ? "#fff" : "#666",
                                        fontSize: "14px",
                                    }}
                                    title="Delete note"
                                >
                                🗑
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <main className="editor">
                {activeNote ? (
                <>
                    <textarea
                        className="note-editor"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Write your note..."
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            className="save-btn"
                            onClick={saveNote}
                            title="Save"
                        >
                            Save
                        </button>
                    </div>
                </>
                ) : (
                    <div className="empty">Select or create a note</div>
                )}
            </main> */}
            <Sidebar />
        </div>
    );
}

export default App;
