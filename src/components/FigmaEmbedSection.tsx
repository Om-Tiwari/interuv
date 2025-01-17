import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { CodeBlock } from "./ui/code-block";

interface FigmaEmbedSectionProps {
    figmaLink: string;
    setFigmaLink: (value: string) => void;
}

const FigmaEmbedSection = ({ figmaLink, setFigmaLink }: FigmaEmbedSectionProps) => {

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

            <CodeBlock
                code={`<iframe src={getEmbedLink()} allowFullScreen></iframe> dasjhjhda akjbbf uhgaw nfabuij fdauijbaf jbuhawf /n uiwqarhb 
                    sdgfasfgagaga asdfhjhjfa 
                    shujadfjhdajh jkad kj`}
                language="svg"
                filename="figma-embed.html"
            />
        </div>
    );
};

export default FigmaEmbedSection;
