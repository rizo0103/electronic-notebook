/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { getNoteById } from '../services/noteService';

const Editor = ({ id }) => {
    const [ content, setContent ] = useState("");

    const getNoteData = async () => {
        setContent(await getNoteById(id).content);
    };

    useEffect(() => {
        getNoteData();
    }, []);

    return (
        <section className='editor'>
            <textarea placeholder={id ? "Write your note..." : "Select or create a note"} className="note-editor" value={content} onChange={(e) => setContent(e.target.value)} />
            <button className='save-btn'>Save</button>
        </section>
    );
};

export default Editor;
