/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { VscDiscard, VscEdit, VscRedo, VscSymbolField, VscTrash } from 'react-icons/vsc';
import { saveCanvas } from '../services/noteService';

const modes = ['Handwriting', 'Eraser'];
const colors = [
    '#FFFFFF', '#000000', '#777777', '#E53935',
    '#F06292', '#FFCDD2', '#FB8C00', '#FDD835',
    '#FFEB3B', '#FFE0B2', '#1E88E5', '#BBDEFB',
    '#8E24AA', '#E1BEE7', '#43A047', '#C8E6C9',
];

const HandwritingCanvas = ({ className, content, noteId }) => {
    const canvasRef = useRef(null);

    const [ ctx, setCtx ] = useState(null);
    const [ isDrawing, setIsDrawing ] = useState(false);
    const [ penSize, setPenSize ] = useState(5);
    const [ mode, setMode ] = useState(modes[0]);
    const [ showCursor, setShowCursor ] = useState(false);
    const [ cursorPos, setCursorPos ] = useState({ x: 0, y: 0 });
    const [ undoHistory, setUndoHistory ] = useState(content ? [content] : []);
    const [ penColor, setPenColor ] = useState("#000000");
    const [ redoHistory, setRedoHistory ] = useState([]);
    const [ penColorPicker, setPenColorPicker ] = useState(false);

    const loadImage = (ctx, content) => {
        const image = new Image();

        image.onload = () => {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(image, 0, 0);
        };

        image.src = content;
    };

    const setupCanvas = () => {
        const canvas = canvasRef.current,
            context = canvas.getContext('2d'),
            rect = canvas.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;

        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = penSize;
        context.globalCompositeOperation = 'source-over';

        setCtx(context);
        loadImage(context, content);
    };

    const startDrawing = (e) => {
        if (!ctx) return;

        const snap = canvasRef.current.toDataURL();

        setUndoHistory(prev => {
            const newHistory = [...prev, snap];

            return newHistory;
        });

        setIsDrawing(true);

        const { x, y } = getPosition(e);

        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y);
    };

    const draw = (e) => {
        if (!isDrawing || !ctx) return;

        const { x, y } = getPosition(e);

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!ctx) return;
        setIsDrawing(false);

        ctx.closePath();
        saveCanvas(noteId, canvasRef.current.toDataURL());
    };

    const getPosition = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX,
            clientY = e.touches ? e.touches[0].clientY : e.clientY;

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        }
    };

    const handleToolbarButtonClick = (title) => {
        setMode(title);
        if (title === modes[0]) {
            setShowCursor(false);
            setPenColor("#000000");
        } else if (title === modes[1]) {
            setShowCursor(true);
            setPenColor("#ffffff");
        }
    };

    const handleMouseMove = (e) => {
        if (mode === "Eraser") {
            setCursorPos({ x: e.clientX, y: e.clientY })
        }

        draw(e);
    };

    const undo = () => {    
        if (undoHistory && undoHistory.length > 0) {
            const img = new Image();

            const snap = canvasRef.current.toDataURL();
            
            setRedoHistory(prev => {
                const newArr = [...prev, snap];
                return newArr;
            });

            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(img, 0, 0);
            };

            img.src = undoHistory[undoHistory.length - 1];

            setUndoHistory(prev => {
                const newArr = [...prev];
                
                newArr.pop();
                return newArr;
            });

            saveCanvas(noteId, img.src);
        }
    };

    const redo = () => {
        if (redoHistory && redoHistory.length > 0) {
            const img = new Image();

            const snap = canvasRef.current.toDataURL();

            setUndoHistory(prev => {
                const newArr = [...prev, snap];
                return newArr;
            })

            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(img, 0, 0);
            }

            img.src = redoHistory[redoHistory.length - 1];

            setRedoHistory(prev => {
                const newArr = [...prev];
                newArr.pop();
                return newArr;
            });

            saveCanvas(noteId, redoHistory[redoHistory.length - 1]);
        }
    }

    const clearAll = () => {
        const snap = canvasRef.current.toDataURL();

        setUndoHistory(prev => {
            const newArr = [...prev, snap];
            return newArr;
        });

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        saveCanvas(noteId, canvasRef.current.toDataURL());
    };

    function rgbToHex(rgb) {
        const extracted = rgb.match(/\d+/g).map(Number); // [r, g, b]
    
        return (
            "#" +
            extracted
                .map((x) => x.toString(16).padStart(2, "0"))
                .join("")
        );
    }

    useEffect(() => {
        setupCanvas();
    }, []);

    return (
        <section className='editor'>
            {showCursor && (
                <div 
                    className="eraser-cursor" 
                    style={{ 
                        position: 'absolute', 
                        width: `${penSize}px`, 
                        height: `${penSize}px`, 
                        left: `${cursorPos.x}px`, 
                        top: `${cursorPos.y}px`,
                        pointerEvents: 'none',
                        zIndex: 10,
                        transition: 'width 0.1s, height 0.1s',
                        transform: 'translate(-50%, -50%)',
                    }}
                ></div>
            )}
            <div className="editor-toolbar">
                <button className={`tool-btn ${mode === modes[0] ? 'active' : ''}`} title={modes[0]} onClick={() => handleToolbarButtonClick(modes[0])}> 
                    <VscEdit /> 
                </button>
                <button className={`tool-btn ${mode === modes[1] ? 'active' : ''}`} title={modes[1]} onClick={() => handleToolbarButtonClick(modes[1])}> 
                    <VscSymbolField /> 
                </button>
                <div className="color-picker" style={{ backgroundColor: penColor }} onClick={() => setPenColorPicker(!penColorPicker)}>
                    <div className={`colors-dropdown ${penColorPicker ? 'open' : ''}`}>
                        {colors && colors.map(item => (
                            <div className="color" style={{ backgroundColor: item }} onClick={(e) => setPenColor(rgbToHex(e.target.style.backgroundColor))}></div>
                        ))}
                    </div>
                </div>
                <div className="cursor-size-control">
                    <label className="cursor-size-label">Cursor Size</label>
                    <div className="cursor-size-value">{penSize}</div>
                    <input type="range" min="1" max="50" value={penSize} onChange={(e) => {setPenSize(e.target.value)}} className="cursor-size-slider" />
                </div>
                <button className="tool-btn" onClick={undo}> <VscDiscard /> </button>
                <button className="tool-btn" onClick={redo}> <VscRedo /> </button>
                <button className='tool-btn' onClick={clearAll}> <VscTrash /> </button>
            </div>
            <canvas
                style={{ touchAction: "none" }}
                className={className}
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={handleMouseMove}
                onPointerUp={stopDrawing}
            ></canvas>
        </section>
    )
};

export default HandwritingCanvas;
