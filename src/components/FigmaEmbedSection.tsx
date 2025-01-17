import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";

const FigmaEmbedSection = () => {
    const [figmaLink, setFigmaLink] = useState(
        "https://www.figma.com/design/8EkpxlnTHnEqvTeJ31pFYs/Fitness-App-Design-(Community)?node-id=1-1978&t=9SvVtbIRM0RuVUAD-0"
    );
    const [imageUrl, setImageUrl] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFigmaLink(e.target.value);
    };

    const getEmbedLink = () => {
        if (figmaLink.includes("figma.com")) {
            return `https://www.figma.com/embed?embed_host=share&url=${figmaLink}`;
        }
        return "";
    };

    function extractFigmaIds(url: string) {
        const regex = /https:\/\/www\.figma\.com\/design\/([a-zA-Z0-9]+)\/[^\?]+\?node-id=([0-9\-]+)/;
        const match = url.match(regex);

        if (match) {
            const fileId = match[1];
            const nodeId = match[2];
            return { fileId, nodeId };
        } else {
            return null; // Return null if the URL does not match the expected format
        }
    }

    const fetchImage = async () => {
        const { fileId, nodeId } = extractFigmaIds(figmaLink);

        try {
            const response = await fetch(`/api/figmaImage?fileId=${fileId}&nodeId=${nodeId}`);
            const data = await response.json();
            console.log("data", Object.values(data?.imageUrl)[0]);

            if (data.imageUrl) {
                setImageUrl(Object.values(data?.imageUrl)[0]);
                setError(null);
            } else {
                setError(data.error || "Failed to fetch image.");
            }
        } catch (err) {
            setError("Error fetching image.");
        }
    };

    useEffect(() => {
        if (figmaLink.includes("figma.com")) {
            fetchImage();
        }
    }, [figmaLink]);

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

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {imageUrl && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold">Rendered Image:</h3>
                    <img src={imageUrl} alt="Figma Rendered Frame" className="border rounded" />
                </div>
            )}


        </div>
    );
};

export default FigmaEmbedSection;
