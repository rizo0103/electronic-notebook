import React from 'react'
import { VscDiscard, VscEdit, VscRedo, VscSymbolField } from 'react-icons/vsc';

const HandwritingCanvas = ({ className }) => {
    
    return (
        <section className={className}>
            <div className="editor-toolbar">
                <button className="tool-btn"> <VscEdit /> </button>
                <button className="tool-btn"> <VscSymbolField /> </button>
                <button className="tool-btn"> <VscDiscard /> </button>
                <button className="tool-btn"> <VscRedo /> </button>
            </div>
            <canvas className={className}></canvas>
        </section>
    )
};

export default HandwritingCanvas;
