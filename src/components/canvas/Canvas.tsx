import React, { useState, useRef, useEffect } from "react";
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

    const getEventCoordinates = (
        event:
            | React.MouseEvent<HTMLDivElement>
            | React.TouchEvent<HTMLDivElement>
    ) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();

        if ("touches" in event) {
            const touch = event.touches[0];
            if (!touch) return { x: 0, y: 0 };
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };
        } else {
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };
        }
    };

    const findTextIndex = (x: number, y: number) => {
        return texts.findIndex(
            (t) =>
                x >= t.x - 50 && x <= t.x + 50 && y >= t.y - 20 && y <= t.y + 20
        );
    };

    const handleDragStart = (
        event:
            | React.MouseEvent<HTMLDivElement>
            | React.TouchEvent<HTMLDivElement>
    ) => {
        const { x, y } = getEventCoordinates(event);
        const index = findTextIndex(x, y);

        if (index !== -1) {
            setDraggingIndex(index);
            setInitialOffset({ x, y });
            event.preventDefault();
            console.log(
                `Started dragging text at index: ${index} to (${x}, ${y})`
            );
        }
    };

    const handleDragMove = (
        event:
            | React.MouseEvent<HTMLDivElement>
            | React.TouchEvent<HTMLDivElement>
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

        setInitialOffset({ x, y });
        event.preventDefault();
        console.log(`Dragging text at index: ${draggingIndex} to (${x}, ${y})`);
    };

    const handleDragEnd = (
        event:
            | React.MouseEvent<HTMLDivElement>
            | React.TouchEvent<HTMLDivElement>
    ) => {
        if (draggingIndex === null || initialOffset === null) return;

        const { x, y } = getEventCoordinates(event);

        const updatedTexts = [...texts];
        updatedTexts[draggingIndex] = {
            ...updatedTexts[draggingIndex],
            x,
            y,
        };
        setTexts(updatedTexts);

        setDraggingIndex(null);
        setInitialOffset(null);
        console.log(`Dropped text at index: ${draggingIndex} at (${x}, ${y})`);
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (image) {
                const img = new Image();
                img.src = image;
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
            }
        }
    };

    useEffect(() => {
        resetCanvas(); 
    }, [image, texts]);

    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (canvasElement) {
            const handleTouchStart = (event: TouchEvent) => {
                handleDragStart(
                    event as unknown as React.TouchEvent<HTMLDivElement>
                );
            };
            const handleTouchMove = (event: TouchEvent) => {
                handleDragMove(
                    event as unknown as React.TouchEvent<HTMLDivElement>
                );
            };
            const handleTouchEnd = (event: TouchEvent) => {
                handleDragEnd(
                    event as unknown as React.TouchEvent<HTMLDivElement>
                );
            };

            canvasElement.addEventListener("touchstart", handleTouchStart, {
                passive: false,
            });
            canvasElement.addEventListener("touchmove", handleTouchMove, {
                passive: false,
            });
            canvasElement.addEventListener("touchend", handleTouchEnd, {
                passive: false,
            });

            return () => {
                canvasElement.removeEventListener(
                    "touchstart",
                    handleTouchStart
                );
                canvasElement.removeEventListener("touchmove", handleTouchMove);
                canvasElement.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [image, texts]);

    return (
        <div className="canvas-wrapper" style={{ position: "relative" }}>
            <canvas
                ref={canvasRef}
                width="600px"
                height="750px"
            ></canvas>
            {texts.map((text, index) => (
                <div
                    key={index}
                    style={{
                        position: "absolute",
                        left: `${text.x}px`,
                        top: `${text.y}px`,
                        color: text.style.color,
                        fontSize: text.style.fontSize,
                        backgroundColor: text.style.backgroundColor,
                        fontFamily: text.style.fontFamily,
                        padding: "5px",
                        cursor: "pointer",
                    }}
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                >
                    {text.text}
                </div>
            ))}
        </div>
    );
};

export default Canvas;