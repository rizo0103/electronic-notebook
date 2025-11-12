import React, { useEffect, useState } from 'react'
import NoteList from './NoteList';
import { addNote, getAllNotes } from '../services/noteService';

const Sidebar = ({ activeNoteId, setActiveNoteId }) => {
    const [ notes, setNotes ] = useState([]);

    const getNotes = async () => {
        setNotes(await getAllNotes());
    }

    useEffect(() => {
        getNotes();
    }, []);

    return (
        <aside className='sidebar'>
            <h2> Notebook </h2>
            <button className='add-btn' onClick={() => addNote(setNotes)}> + Add Note </button>
            <NoteList notes={notes} setNotes={setNotes} activeNoteId={activeNoteId} setActiveNoteId={setActiveNoteId} />
        </aside>
    );
};

export default Sidebar;
