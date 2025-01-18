import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { CodeBlock } from "./ui/code-block";

interface FigmaEmbedSectionProps {
  figmaLink: string;
  setFigmaLink: (value: string) => void;
}

const FigmaEmbedSection = ({
  figmaLink,
  setFigmaLink,
}: FigmaEmbedSectionProps) => {
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
        code={`<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5v14m8-7h-2m0 0h-2m2 0v2m0-2v-2M3 11h6m-6 4h6m11 4H4c-.55228 0-1-.4477-1-1V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v12c0 .5523-.4477 1-1 1Z"/>
</svg>
`}
        language="svg"
        filename="figma-embed.html"
      />
    </div>
  );
};

export default FigmaEmbedSection;
