import React from "react";
import image1 from "../../assets/preloaded-images/image1.jpg";
import image2 from "../../assets/preloaded-images/image2.jpg";
import image3 from "../../assets/preloaded-images/image3.jpg";
import image4 from "../../assets/preloaded-images/image4.jpg";
import image5 from "../../assets/preloaded-images/image5.jpg";
import image6 from "../../assets/preloaded-images/image6.jpg";
import "./imageUploader.css";

interface ImageUploaderProps {
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handlePreloadedImageSelect: (imagePath: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    handleImageUpload,
    handlePreloadedImageSelect,
}) => {
    const preloadedImages = [
        image1, image2, image3, image4, image5, image6
    ];

    return (
        <div className="image-uploader">
            <h3>Upload your own image</h3>
            <div className="file-upload-wrapper">
                <input
                    id="file-input"
                    type="file"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                />
                <label htmlFor="file-input" className="custom-file-label">
                    Choose File
                </label>
            </div>
            <h3>Or choose a preloaded image</h3>
            <div className="preloaded-images">
                {preloadedImages.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Preloaded ${index}`}
                        onClick={() => handlePreloadedImageSelect(src)}
                        className="preloaded-image"
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;