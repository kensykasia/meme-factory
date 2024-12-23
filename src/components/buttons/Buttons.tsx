import React from "react";
import "./buttons.css";

interface ButtonsProps {
    handleReset: () => void;
    handleSave: () => void;
}

const Buttons: React.FC<ButtonsProps> = ({ handleReset, handleSave }) => {
    return (
        <div className="buttons">
            <button onClick={handleReset}>Reset Meme</button>
            <button onClick={handleSave}>Save Meme</button>
        </div>
    );
};

export default Buttons;