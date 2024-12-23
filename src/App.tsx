import React, { useState, useRef } from "react";
import ImageUploader from "./components/image-uploader/ImageUploader";
import Canvas from "./components/canvas/Canvas";
import TextEditor from "./components/text-editor/TextEditor";
import Buttons from "./components/buttons/Buttons";
import "./styles.css";
import logo from "./assets/icons/logo.png";

const App: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [texts, setTexts] = useState<
        {
            text: string;
            style: { color: string; fontSize: string; backgroundColor: string; fontFamily: string };
            x: number;
            y: number;
        }[]
    >([]);
    const [selectedTextIndex, setSelectedTextIndex] = useState<number>(0);
    const [isTextEditorVisible, setIsTextEditorVisible] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handlePreloadedImageSelect = (imagePath: string) => {
        setImage(imagePath);
    };

    const handleAddText = () => {
        setTexts([
            ...texts,
            {
                text: "New Text",
                style: {
                    color: "#000000",
                    fontSize: "20px",
                    backgroundColor: "transparent",
                    fontFamily: "Arial"
                },
                x: 100,
                y: 100,
            },
        ]);
        setSelectedTextIndex(texts.length);
        setIsTextEditorVisible(true);        
    };

    const handleReset = () => {
        setImage(null);
        setTexts([]);
    };

    const handleSave = () => {
        if (!image || texts.length === 0) {
            alert("Please add both an image and some text before saving.");
            return;
        }
        const canvas = canvasRef.current!;
        const link = document.createElement("a");
        link.download = "meme.png";
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="application">
            <header className="navbar-header">
                <div className="logo-container">
                    <img
                        src={logo}
                        alt="Meme Generator Logo"
                        className="logo"
                    />
                </div>
                <nav className="navbar">
                    <ul>
                        <li>
                            <a
                                href="#main"
                                onClick={(event) => {
                                    event.preventDefault();

                                    const targetElement =
                                        document.getElementById("main");
                                    if (targetElement) {
                                        const scrollToPosition =
                                            targetElement.offsetTop;

                                        window.scrollTo({
                                            top: scrollToPosition,
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="app"
                                onClick={(event) => {
                                    event.preventDefault();

                                    const targetElement =
                                        document.getElementById("app");
                                    if (targetElement) {
                                        const scrollToPosition =
                                            targetElement.offsetTop;

                                        window.scrollTo({
                                            top: scrollToPosition,
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                            >
                                App
                            </a>
                        </li>
                        <li>
                            <a
                                href="#contact"
                                onClick={(event) => {
                                    event.preventDefault();

                                    const targetElement =
                                        document.getElementById("contact");
                                    if (targetElement) {
                                        const scrollToPosition =
                                            targetElement.offsetTop;

                                        window.scrollTo({
                                            top: scrollToPosition,
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
            <section className="main-section" id="main">
                <h1>Create Memes Effortlessly with Our Tool!</h1>
                <p>
                    Unleash your creativity with our intuitive meme generator.
                    Customize images, fonts, and text placement to make your
                    memes truly unique!
                </p>
                <button
                    className="cta-button"
                    onClick={() => {
                        const targetElement = document.getElementById("app");
                        if (targetElement) {
                            const elementPosition = targetElement.offsetTop;

                            const isMobile = window.innerWidth <= 768;
                            const scrollToPosition = isMobile
                                ? elementPosition
                                : elementPosition -
                                  window.innerHeight / 2 +
                                  targetElement.offsetHeight / 2;

                            window.scrollTo({
                                top: scrollToPosition,
                                behavior: "smooth",
                            });
                        }
                    }}
                >
                    Start Creating
                </button>
            </section>
            <section className="app-section" id="app">
                <div className="upload-panel-wrapper">
                    <ImageUploader
                        handleImageUpload={handleImageUpload}
                        handlePreloadedImageSelect={handlePreloadedImageSelect}
                    />
                </div>
                <Canvas
                    image={image}
                    texts={texts}
                    setTexts={setTexts}
                    canvasRef={canvasRef}
                    handleReset={handleReset}
                />
                <div className="text-editor-wrapper">
                    {isTextEditorVisible && (
                        <TextEditor
                            texts={texts}
                            setTexts={setTexts}
                            selectedTextIndex={selectedTextIndex}
                            setSelectedTextIndex={setSelectedTextIndex}
                        />
                    )}
                    <button className="add-text" onClick={handleAddText}>
                        Add Text
                    </button>
                    <Buttons
                        handleReset={handleReset}
                        handleSave={handleSave}
                    />
                </div>
            </section>
            <footer className="footer" id="contact">
                <p>&copy; 2024 Meme Generator. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default App;
