// src/components/NoteList.jsx
import React from 'react';

const NoteList = ({
    notes,
    activeNoteId,
    setActiveNoteId,
    onDeleteNote,
    onRenameNote
}) => {

    return (
        <div className='note-list'>
            {notes.length > 0 ? (
                notes.map(note => (
                    <div
                        key={note.id}
                        className={`note-item ${activeNoteId === note.id ? "active" : ""}`}
                        onClick={() => setActiveNoteId(note.id)}
                        onDoubleClick={() => onRenameNote(note.id, note.title)}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" }}>
                                {note.title || "Untitled"}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent note selection
                                    onDeleteNote(note.id);
                                }}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    color: activeNoteId === note.id ? "#fff" : "#666",
                                    fontSize: "14px",
                                }}
                                title="Delete note"
                            >
                                🗑
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-list">No notes yet. Create one!</div>
            )}
        </div>
    );
};

export default NoteList;
