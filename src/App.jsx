/* eslint-disable no-unused-vars */
// src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./db";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

function App() {
    const [ activeNoteId, setActiveNoteId ] = useState(null);

  return (
        <main className="app-container">
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
            <Sidebar setActiveNoteId={setActiveNoteId} activeNoteId={activeNoteId} />
            <Editor id={activeNoteId} />
        </main>
    );
}

export default App;
