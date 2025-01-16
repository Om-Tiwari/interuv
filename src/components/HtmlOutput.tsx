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
          <style>${`
            body {
            color: white;
                }
                ${css}
            `}</style>
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
            <h1
                className="text-xl font-bold text-center p-2 text-white "
            >
                Output
            </h1>
            <iframe
                title="output"
                srcDoc={generateOutput()}
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-none mt-2"
            />
        </div>
    )
}
