/* eslint-disable react-hooks/exhaustive-deps */
// src/components/HandwritingCanvas.jsx
import React, { useEffect, useRef, useState } from 'react';
import { saveCanvas } from '../services/noteService';

const HandwritingCanvas = ({ className, content, onNoteUpdate, noteId }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState(null);
    const [mode, setMode] = useState("Text mode");
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [showCursor, setShowCursor] = useState(false);
    const [penSize, setPenSize] = useState(5);

    // Function to set canvas size and context properties
    const setupCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Save current content
        let data = canvas.toDataURL();

        if (content) {
            data = content;
        }

        // Update canvas size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Restore content
        const img = new Image();
        img.src = data;
        img.onload = () => {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

        context.lineCap = "round";
        context.lineWidth = penSize;
        context.strokeStyle = "#000";
        
        setCtx(context);
    };


    // Setup canvas on mount and on window resize
    useEffect(() => {
        setupCanvas();
        window.addEventListener('resize', setupCanvas);
        return () => {
            window.removeEventListener('resize', setupCanvas);
        };
    }, []);

    const getPosition = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // No need for Math.abs
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        if (!ctx) return;
        setCursorPos({
            x: e.clientX,
            y: e.clientY,
        });
        const { x, y } = getPosition(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || !ctx) return;
        e.preventDefault();
        const { x, y } = getPosition(e);
        setCursorPos({
            x: e.clientX,
            y: e.clientY,
        });
        if (mode === "Handwriting mode") {
            ctx.globalCompositeOperation = "source-over";
            setPenSize(5);
        } else if (mode === "Eraser") {
            ctx.globalCompositeOperation = "destination-out";
            setPenSize(100);
        }

        ctx.lineWidth = penSize;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = (e) => {
        if (!isDrawing || !ctx) return;
        e.preventDefault();
        ctx.closePath();
        setIsDrawing(false);
    };

    const handleSave = async () => {
        await saveCanvas(noteId, canvasRef.current);
        if (onNoteUpdate) {
            onNoteUpdate();
        }
    };
    
    return (
        <section className='editor'>
            {showCursor && (
                <div className="eraser-cursor"
                    style={{
                        width: `${penSize}px`,
                        height: `${penSize}px`,
                        left: `${cursorPos.x}px`,
                        top: `${cursorPos.y}px`,
                        transform: 'translate(-50%, -50%)',
                    }}
                >

                </div>
            )}
            <div className="editor-toolbar">
                <button className={`tool-btn ${mode === "Text mode" ? 'active' : ''}`} title='Text mode' onClick={() => {setMode("Text mode"); setShowCursor(false)} }> 📝 </button>
                <button className={`tool-btn ${mode === "Handwriting mode" ? 'active' : ''}`} title='Handwriting mode' onClick={() => {setMode("Handwriting mode"); setShowCursor(false)}}> ✍️ </button>
                <button className={`tool-btn ${mode === "Color picker" ? 'active' : ''}`} title='Color picker' onClick={() => {setMode("Color picker"); setShowCursor(false)}}> 🎨 </button>
                <button className={`tool-btn ${mode === "Eraser" ? 'active' : ''}`} title='Eraser' onClick={() => {setMode("Eraser"); setShowCursor(true)}}> 🧽 </button>
                <button className="tool-btn" title='Undo'> ↩️ </button>
                <button className="tool-btn" title='Redo'> ↪️ </button>
                <button className="tool-btn" onClick={handleSave} title="Save"> Save </button>
            </div>
            
            <canvas 
                ref={canvasRef}
                className={className} // Use the passed className
                style={{ touchAction: "none", display: 'block' }} // Ensure it behaves like a block
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseEnter={(e) => setCursorPos({
                    x: e.clientX,
                    y: e.clientY,
                })}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
            />

        </section>
    );
};

export default HandwritingCanvas;
