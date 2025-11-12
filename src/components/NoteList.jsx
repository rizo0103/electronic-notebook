import React, { useState } from 'react';
import { deleteNote, renameNote } from '../services/noteService';

const NoteList = ({ notes, setNotes, activeNoteId, setActiveNoteId }) => {
    const [ renaimingNoteId, setRenamingNoteId ] = useState(null);

    const selectNote = (note) => {
        setActiveNoteId(note.id);
    };

    return (
        <div className='note-list'>
            {notes.length > 0 ? (
                notes.map(note => (
                    <div key={note.id} className={`note-item ${activeNoteId === note.id ? "active" : ""}`} onClick={() => selectNote(note)} onDoubleClick={() => renameNote(note)}>
                        <span onDoubleClick={() => setRenamingNoteId(note.id)} contentEditable={renaimingNoteId && renaimingNoteId === note.id}> {note.title || "Untitled"} </span>
                        <div onClick={async () => await deleteNote(note.id, setNotes)}> 🗑 </div>
                    </div>
                ))
            ) : (
                <p> It's time to create new note... </p>
            )}
        </div>
    );
};

export default NoteList;
