import React from 'react'

interface HtmlOutputProps {
    html: string;
    css: string;
    javascript: string;
}

export default function HtmlOutput({ html, css, javascript }: HtmlOutputProps) {

    const generateOutput = () => {
        return `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${javascript}</script>
        </body>
      </html>
    `;
    };

    return (
        <div className="bg-gray-800 rounded overflow-hidden">
            <iframe
                title="output"
                srcDoc={generateOutput()}
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-none"
            />
        </div>
    )
}
