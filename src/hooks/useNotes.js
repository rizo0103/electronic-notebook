// src/hooks/useNotes.js
import { useState, useEffect } from "react";
import * as noteService from "../services/noteService";

export const useNotes = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        // Initial load of notes
        handleReloadNotes();
    }, []);

    const handleReloadNotes = async () => {
        const allNotes = await noteService.getAllNotes();
        // sort by most recently updated
        allNotes.sort((a, b) => b.updatedAt - a.updatedAt);
        setNotes(allNotes);
    };

    const handleAddNote = async () => {
        const newNoteId = await noteService.addNote();
        await handleReloadNotes();
        return newNoteId; // Return the new ID to select it
    };

    const handleDeleteNote = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this note?");
        if (confirmed) {
            await noteService.deleteNote(id);
            await handleReloadNotes();
        }
    };

    const handleRenameNote = async (id, currentTitle) => {
        const newTitle = window.prompt("Rename note:", currentTitle);
        if (newTitle !== null && newTitle !== currentTitle) {
            await noteService.renameNote(id, newTitle);
            await handleReloadNotes();
        }
    };

    return {
        notes,
        handleAddNote,
        handleDeleteNote,
        handleRenameNote,
    };
};
