import React from "react";
import "./textEditor.css";

interface TextEditorProps {
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
    selectedTextIndex: number;
    setSelectedTextIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TextEditor: React.FC<TextEditorProps> = ({
    texts,
    setTexts,
    selectedTextIndex,
    setSelectedTextIndex,
}) => {
    const handleTextChange = (index: number, newText: string) => {
        const updatedTexts = [...texts];
        updatedTexts[index].text = newText;
        setTexts(updatedTexts);
    };

    const handleStyleChange = (
        index: number,
        styleUpdate: Partial<(typeof texts)[number]["style"]>
    ) => {
        const updatedTexts = [...texts];
        updatedTexts[index].style = {
            ...updatedTexts[index].style,
            ...styleUpdate,
        };
        setTexts(updatedTexts);
    };

    const selectedText = texts[selectedTextIndex];

    return selectedText ? (
        <div className="text-editor">
            <select
                onChange={(e) => setSelectedTextIndex(Number(e.target.value))}
                value={selectedTextIndex}
            >
                {texts.map((_, index) => (
                    <option key={index} value={index}>
                        Text {index + 1}
                    </option>
                ))}
            </select>

            <input
                type="text"
                value={selectedText.text}
                onChange={(e) =>
                    handleTextChange(selectedTextIndex, e.target.value)
                }
            />

            <input
                type="color"
                value={selectedText.style.color}
                onChange={(e) =>
                    handleStyleChange(selectedTextIndex, {
                        color: e.target.value,
                    })
                }
            />

            <input
                type="range"
                min="10"
                max="50"
                value={parseInt(selectedText.style.fontSize, 10)}
                onChange={(e) =>
                    handleStyleChange(selectedTextIndex, {
                        fontSize: `${e.target.value}px`,
                    })
                }
            />

            <select
                value={selectedText.style.fontFamily}
                onChange={(e) =>
                    handleStyleChange(selectedTextIndex, {
                        fontFamily: e.target.value,
                    })
                }
            >
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
            </select>
        </div>
    ) : null;
};

export default TextEditor;