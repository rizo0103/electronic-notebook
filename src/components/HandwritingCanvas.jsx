import React, { useEffect, useRef, useState } from 'react'
import { VscDiscard, VscEdit, VscRedo, VscSymbolField } from 'react-icons/vsc';

const HandwritingCanvas = ({ className, content }) => {
    const canvasRef = useRef(null);    
    const [ ctx, setCtx ] = useState(null);
    const [ isDrawing, setIsDrawing ] = useState(false);
    const [ penSize, setPenSize ] = useState(5);

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
    };

    const startDrawing = (e) => {
        if (!ctx) return;
        
        setIsDrawing(true);
    
        const { x, y } = getPosition(e);

        ctx.beginPath();
        ctx.moveTo(x, y);

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

    useEffect(() => {
        setupCanvas();
    }, []);

    return (
        <section className={className}>
            <div className="editor-toolbar">
                <button className="tool-btn"> <VscEdit /> </button>
                <button className="tool-btn"> <VscSymbolField /> </button>
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
