/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { VscDiscard, VscEdit, VscRedo, VscSymbolField } from 'react-icons/vsc';
import { saveCanvas } from '../services/noteService';

const modes = ['Handwriting', 'Eraser'];

const HandwritingCanvas = ({ className, content, noteId }) => {
    const canvasRef = useRef(null);    
    const [ ctx, setCtx ] = useState(null);
    const [ isDrawing, setIsDrawing ] = useState(false);
    const [ penSize, setPenSize ] = useState(5);
    const [ mode, setMode ] = useState(modes[0]);

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
        
        setIsDrawing(true);
    
        const { x, y } = getPosition(e);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineWidth = penSize;
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
        saveCanvas(noteId, canvasRef.current);
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
            ctx.globalCompositeOperation = 'source-over';
            setPenSize(5);
        } else if (title === modes[1]) {
            ctx.globalCompositeOperation = 'destination-out';
            setPenSize(20);
        }
    };

    useEffect(() => {
        setupCanvas();
    }, []);

    return (
        <section className={className}>
            <div className="editor-toolbar">
                <button className={`tool-btn ${mode === modes[0] ? 'active' : ''}`} title={modes[0]} onClick={() => handleToolbarButtonClick(modes[0])}> <VscEdit /> </button>
                <button className={`tool-btn ${mode === modes[1] ? 'active' : ''}`} title={modes[1]} onClick={() => handleToolbarButtonClick(modes[1])}> <VscSymbolField color='pink' /> </button>
                <button className="tool-btn"> <VscDiscard /> </button>
                <button className="tool-btn"> <VscRedo /> </button>
            </div>
            <canvas 
                className={className}
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
            ></canvas>
        </section>
    )
};

export default HandwritingCanvas;
