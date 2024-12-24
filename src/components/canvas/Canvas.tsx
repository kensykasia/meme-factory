import React, { useState, useEffect } from "react";
import "./canvas.css";

interface CanvasProps {
    image: string | null;
    texts: {
        text: string;
        style: {
            color: string;
            fontSize: string;
            backgroundColor: string;
            fontFamily: string;
        };
        x: number;
        y: number;
    }[];
    setTexts: React.Dispatch<
        React.SetStateAction<
            {
                text: string;
                style: {
                    color: string;
                    fontSize: string;
                    backgroundColor: string;
                    fontFamily: string;
                };
                x: number;
                y: number;
            }[]
        >
    >;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    handleReset: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
    image,
    texts,
    setTexts,
    canvasRef,
    handleReset,
}) => {
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [initialOffset, setInitialOffset] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [img, setImg] = useState<HTMLImageElement | null>(null);

    const getEventCoordinates = (
        event:
            | React.MouseEvent<HTMLCanvasElement>
            | React.TouchEvent<HTMLCanvasElement>
    ) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scale = canvas.width / rect.width;

        if ("touches" in event) {
            const touch = event.touches[0];
            if (!touch) return { x: 0, y: 0 };
            return {
                x: (touch.clientX - rect.left) * scale,
                y: (touch.clientY - rect.top) * scale,
            };
        } else {
            return {
                x: (event.clientX - rect.left) * scale,
                y: (event.clientY - rect.top) * scale,
            };
        }
    };

    const findTextIndex = (x: number, y: number) => {
        const buffer = 50;
        return texts.findIndex((t) => {
            const textWidth =
                t.text.length * parseInt(t.style.fontSize, 10) * 0.6;
            const textHeight = parseInt(t.style.fontSize, 10);
            return (
                x >= t.x - buffer &&
                x <= t.x + textWidth + buffer &&
                y >= t.y - textHeight - buffer &&
                y <= t.y + buffer
            );
        });
    };

    const handleDragStart = (
        event:
            | React.MouseEvent<HTMLCanvasElement>
            | React.TouchEvent<HTMLCanvasElement>
    ) => {
        const { x, y } = getEventCoordinates(event);
        const index = findTextIndex(x, y);

        if (index !== -1) {
            setDraggingIndex(index);
            setInitialOffset({ x, y });
            event.preventDefault();
        }
    };

    const handleDragMove = (
        event:
            | React.MouseEvent<HTMLCanvasElement>
            | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (draggingIndex === null || initialOffset === null) return;

        const { x, y } = getEventCoordinates(event);
        const deltaX = x - initialOffset.x;
        const deltaY = y - initialOffset.y;

        const updatedTexts = [...texts];
        updatedTexts[draggingIndex] = {
            ...updatedTexts[draggingIndex],
            x: updatedTexts[draggingIndex].x + deltaX,
            y: updatedTexts[draggingIndex].y + deltaY,
        };
        setTexts(updatedTexts);

        resetCanvas(); 

        setInitialOffset({ x, y });
    };

    const handleDragEnd = (
        event:
            | React.MouseEvent<HTMLCanvasElement>
            | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (draggingIndex === null || initialOffset === null) return;

        const { x, y } = getEventCoordinates(event);

        const updatedTexts = [...texts];
        const textToUpdate = updatedTexts[draggingIndex];

        updatedTexts[draggingIndex] = {
            ...textToUpdate,
            x: x,
            y: y,
        };
        setTexts(updatedTexts);

        setDraggingIndex(null);
        setInitialOffset(null);
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (img) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }

            texts.forEach((text) => {
                ctx.font = `${text.style.fontSize} ${text.style.fontFamily}`;
                ctx.fillStyle = text.style.color;
                 ctx.textBaseline = "top";
                ctx.fillText(text.text, text.x, text.y);
            });
        }
    };

    useEffect(() => {
        if (image) {
            const newImage = new Image();
            newImage.src = image;
            newImage.onload = () => setImg(newImage);
        } else {
            setImg(null);
        }
    }, [image]);

    useEffect(() => {
        resetCanvas();
    }, [img, texts]);

    return (
        <div className="canvas-wrapper" style={{ position: "relative" }}>
            <canvas
                ref={canvasRef}
                width="600px"
                height="750px"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
            ></canvas>
        </div>
    );
};

export default Canvas;