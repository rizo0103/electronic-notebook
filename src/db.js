import Dexie from "dexie";

export const db = new Dexie("MyDatabase");

db.version(1).stores({
    notes: "++id, title, content, createdAt, updatedAt",
});
