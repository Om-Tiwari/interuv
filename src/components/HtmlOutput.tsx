import React, { useEffect, useState } from 'react';

interface HtmlOutputProps {
    html: string;
    css: string;
    javascript: string;
    figma: string;
}

export default function HtmlOutput({ html, css, javascript, figma }: HtmlOutputProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showOverlay, setShowOverlay] = useState<boolean>(false); // Toggle for image overlay

    // Extract Figma file and node IDs from the URL
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

    // Fetch the Figma image
    const fetchImage = async () => {
        const figmaIds = extractFigmaIds(figma);
        if (!figmaIds) {
            setError("Invalid Figma URL.");
            return;
        }
        const { fileId, nodeId } = figmaIds;

        try {
            const response = await fetch(`/api/figmaImage?fileId=${fileId}&nodeId=${nodeId}`);
            const data = await response.json();
            console.log("data", Object.values(data?.imageUrl)[0]);

            if (data.imageUrl) {
                setImageUrl(Object.values(data?.imageUrl)[0] as string);
                setError(null);
            } else {
                setError(data.error || "Failed to fetch image.");
            }
        } catch (err) {
            setError("Error fetching image.");
        }
    };

    // Fetch the Figma image when the `figma` prop changes
    useEffect(() => {
        if (figma.includes("figma.com")) {
            fetchImage();
        }
    }, [figma]);

    // Generate the HTML output for the iframe
    const generateOutput = () => {
        return `
      <html>
        <head>
          <style>
            body {
                color: white;
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            img {
                object-fit: contain;
                max-width: 100%;
                max-height: 100%;
            }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>${javascript}</script>
        </body>
      </html>
    `;
    };

    return (
        <div className="rounded h-[calc(100vh-100px)]">
            <h1 className="text-xl font-bold text-center p-2 text-white">Output</h1>

            {/* Toggle button for image overlay */}
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {showOverlay ? "Hide Figma Image" : "Show Figma Image"}
                </button>
            </div>

            {/* Container for the iframe and overlay */}
            <div className="relative w-full h-[80%] border rounded overflow-hidden">
                {/* Iframe for the live output */}
                <iframe
                    title="output"
                    srcDoc={generateOutput()}
                    sandbox="allow-scripts allow-same-origin"
                    className="w-full h-full border-none"
                />

                {/* Overlay for the Figma image */}
                {showOverlay && imageUrl && (
                    <div
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            opacity: 0.7, // Adjust opacity for better comparison
                        }}
                    />
                )}
            </div>

            {/* Display errors if any */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}