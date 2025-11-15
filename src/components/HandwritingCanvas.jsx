/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { VscDiscard, VscEdit, VscRedo, VscSymbolField } from 'react-icons/vsc';
import { saveCanvas } from '../services/noteService';

const modes = ['Handwriting', 'Eraser'];

const HandwritingCanvas = ({ className, content, noteId }) => {
    const canvasRef = useRef(null);

    const [ctx, setCtx] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [penSize, setPenSize] = useState(5);
    const [mode, setMode] = useState(modes[0]);
    const [showCursor, setShowCursor] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [history, setHistory] = useState(content ? [content] : []);
    const [historyStep, setHistoryStep] = useState(content ? 0 : -1);
    const [penColor, setPenColor] = useState("#000000");

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

        setHistory(prev => {
            const newHistory = [...prev.slice(0, historyStep + 1), snap];

            setHistoryStep(newHistory.length - 1);
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
            setPenSize(5);
            setShowCursor(false);
            setPenColor("#000000");
        } else if (title === modes[1]) {
            setPenSize(20);
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
        if (historyStep <= 0) return ;

        const newStep = historyStep;
        const img = new Image();

        img.onload = () => {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0);
        }

        img.src = history[newStep];
        setHistoryStep(newStep - 1);
    
        saveCanvas(noteId, img.src);
    };

    useEffect(() => {
        setupCanvas();
    }, []);

    return (
        <section className='editor'>
            {showCursor && (
                <div className="eraser-cursor" style={{ width: `${penSize}px`, height: `${penSize}px`, left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}></div>
            )}
            <div className="editor-toolbar">
                <button className={`tool-btn ${mode === modes[0] ? 'active' : ''}`} title={modes[0]} onClick={() => handleToolbarButtonClick(modes[0])}> <VscEdit /> </button>
                <button className={`tool-btn ${mode === modes[1] ? 'active' : ''}`} title={modes[1]} onClick={() => handleToolbarButtonClick(modes[1])}> <VscSymbolField /> </button>
                <button className="tool-btn" onClick={undo}> <VscDiscard /> </button>
                <button className="tool-btn"> <VscRedo /> </button>
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
