import React, { useState } from "react";

const FigmaEmbedSection = () => {
    const [figmaLink, setFigmaLink] = useState("");

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
        <div className="p-6 bg-gray-900">
            <h2 className="text-xl font-bold mb-4">Figma</h2>

            <input
                type="text"
                className="w-full p-2 border rounded mb-4 text-black"
                placeholder="Paste your Figma link here"
                value={figmaLink}
                onChange={handleInputChange}
            />

            {figmaLink && getEmbedLink() ? (
                <div className="mt-4">
                    <iframe
                        className="w-full h-96 border rounded"
                        src={getEmbedLink()}
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <p className="text-gray-600">Enter a valid Figma link to preview the design.</p>
            )}
        </div>
    );
};

export default FigmaEmbedSection;
