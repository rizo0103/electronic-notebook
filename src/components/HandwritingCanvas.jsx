/* eslint-disable react-hooks/exhaustive-deps */
// src/components/HandwritingCanvas.jsx
import React, { useEffect, useRef, useState } from 'react';
import { saveCanvas } from '../services/noteService';

const HandwritingCanvas = ({ className, content, onNoteUpdate, noteId }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState(null);
    const [mode, setMode] = useState("Handwriting mode");
    const [compositeOperation, setCompositeOperation] = useState('source-over');
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [showCursor, setShowCursor] = useState(false);
    const [penSize, setPenSize] = useState(5);
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);

    const saveSnapshot = () => {
        const canvas = canvasRef.current;
        const data = canvas.toDataURL();

        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(data);

        setHistory(newHistory);
        setHistoryStep(newHistory.length);

    };

    // Function to set canvas size and context properties
    const setupCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        let data = content || canvas.toDataURL();

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const img = new Image();
        img.src = data;
        img.onload = () => {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

        context.lineCap = "round";
        context.lineWidth = penSize;
        context.strokeStyle = "#000";
        context.globalCompositeOperation = compositeOperation;
        
        setCtx(context);
    };

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

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        if (!ctx) return;
        const { x, y } = getPosition(e);
        ctx.globalCompositeOperation = compositeOperation;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || !ctx) return;
        e.preventDefault();
        const { x, y } = getPosition(e);
        ctx.lineWidth = penSize;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = (e) => {
        if (!isDrawing || !ctx) return;
        
        e.preventDefault();
        
        ctx.closePath();
        setIsDrawing(false);

        saveSnapshot();
    };

    const handleMouseMove = (e) => {
        // Always update the visual cursor position in eraser mode
        if (mode === 'Eraser') {
            setCursorPos({ x: e.clientX, y: e.clientY });
        }
        // Call the draw function, which will only execute if isDrawing is true
        draw(e);
    };

    const handleSave = async () => {
        await saveCanvas(noteId, canvasRef.current);
        if (onNoteUpdate) {
            onNoteUpdate();
        }
    };

    const handleToolbarButtonClick = (e) => {
        setMode(e.target.title);

        if (e.target.title === "Handwriting mode") {
            setCompositeOperation("source-over");
            setPenSize(5);
        } else if (e.target.title === "Eraser") {
            setCompositeOperation("destination-out");
            setPenSize(30); // A more reasonable eraser size
        }
    };

    const undo = () => {
        const canvas = document.getElementById('canvas');
        if (historyStep < 0) return ;

        const newStep = historyStep - 1;
        setHistoryStep(newStep);

        const img = new Image();

        img.src = history[newStep];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
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
                <button className={`tool-btn ${mode === "Handwriting mode" ? 'active' : ''}`} title='Handwriting mode' onClick={handleToolbarButtonClick}>✍️</button>
                <button className={`tool-btn ${mode === "Eraser" ? 'active' : ''}`} title='Eraser' onClick={handleToolbarButtonClick}>🧽</button>
                <button className="tool-btn" title='Undo' onClick={undo}>↩️</button>
                <button className="tool-btn" title='Redo'>↪️</button>
                <button className="tool-btn" onClick={handleSave} title="Save">Save</button>
            </div>
            <canvas 
                id='canvas'
                ref={canvasRef}
                className={className}
                style={{ touchAction: "none", display: 'block', cursor: mode === 'Eraser' ? 'none' : 'default' }}
                onMouseDown={startDrawing}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDrawing}
                onMouseEnter={() => mode === 'Eraser' && setShowCursor(true)}
                onMouseLeave={() => setShowCursor(false)}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
            />
        </section>
    );
};

export default HandwritingCanvas;
