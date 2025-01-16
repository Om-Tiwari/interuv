import React, { useState } from "react";
import { Input } from "./ui/input";

const FigmaEmbedSection = () => {
    const [figmaLink, setFigmaLink] = useState("https://www.figma.com/design/8EkpxlnTHnEqvTeJ31pFYs/Fitness-App-Design-(Community)?node-id=1-1978&t=9SvVtbIRM0RuVUAD-0");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFigmaLink(e.target.value);
    };

    const getEmbedLink = () => {
        // Validate and convert the Figma link to an embed URL
        if (figmaLink.includes("figma.com")) {
            return `https://www.figma.com/embed?embed_host=share&url=${figmaLink}`;
        }
        return "";
    };

    return (
        <div className="p-6">
            <h2 className="text-4xl font-bold mb-4">Figma</h2>

            <Input
                placeholder="Enter Figma link"
                value={figmaLink}
                onChange={handleInputChange}
            />

            {figmaLink && getEmbedLink() && (
                <div className="mt-4">
                    <iframe
                        className="w-full h-96 border rounded"
                        src={getEmbedLink()}
                        allowFullScreen
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default FigmaEmbedSection;
