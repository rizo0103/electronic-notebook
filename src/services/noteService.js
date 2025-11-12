import { db } from "../db";

export const getAllNotes = async () => {
    return await db.notes.toArray();
};

export const addNote = async (setNotes) => {
    try {
        const timestamp = Date.now();
        const id = await db.notes.add({
            title: "Untitled",
            content: "",
            createdAt: timestamp,
            updatedAt: timestamp,
        });

        setNotes(await getAllNotes());
    
        return id;
    } catch (error) {
        console.error("Failed to add note:", error);
        return "not ok";
    }
};

export const updateNote = async (id, updatedFields) => {
    try {
        updatedFields.updatedAt = Date.now();
        await db.notes.update(id, updatedFields);
        
        return "ok";
    } catch (error) {
        console.error("Failed to update note:", error);
        
        return "not ok";
    }
};

export const renameNote = async (id, newTitle) => {
    try {
        await db.notes.update(id, {
            title: newTitle,
            updatedAt: Date.now(),
        });

        return "ok";
    } catch (error) {
        console.error("Failed to rename note:", error);
        
        return "not ok";
    }
};

export const deleteNote = async (id, setNotes) => {
    try {
        await db.notes.delete(id);
        setNotes(await getAllNotes());
        return "ok";
    } catch (error) {
        console.error("Failed to delete note:", error);
        return "not ok";
    }
};

console.log("noteService.js loaded");
