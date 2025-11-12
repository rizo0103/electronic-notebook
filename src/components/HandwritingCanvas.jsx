// src/components/HandwritingCanvas.jsx
import React, { useEffect, useRef, useState } from 'react';

const HandwritingCanvas = ({ className }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState(null);

    // Function to set canvas size and context properties
    const setupCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Get the display size of the canvas
        const rect = canvas.getBoundingClientRect();

        // Set the canvas attributes to match its display size
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Re-apply context settings after resize
        context.lineCap = "round";
        context.lineWidth = 5; // Increased for better visibility
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
        const { x, y } = getPosition(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || !ctx) return;
        e.preventDefault();
        const { x, y } = getPosition(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = (e) => {
        if (!isDrawing || !ctx) return;
        e.preventDefault();
        ctx.closePath();
        setIsDrawing(false);
    };
    
    return (
        <canvas 
            ref={canvasRef}
            className={className} // Use the passed className
            style={{ touchAction: "none", display: 'block' }} // Ensure it behaves like a block
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
        >
        </canvas>
    );
};

export default HandwritingCanvas;
