"use client";
import { useEffect } from "react";
import StackBlitzSDK from "@stackblitz/sdk"; // Default import

export default function Home() {
  useEffect(() => {
    // Use StackBlitzSDK.embedProject
    StackBlitzSDK.embedProject(
      "my-div", // ID of the container element
      {
        title: "React + Tailwind CSS with Vite",
        description: "A React project with Tailwind CSS using Vite",
        template: "node", // Use Node.js template for Vite
        files: {
          // Required files for a React + Tailwind CSS project with Vite
          "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React + Tailwind CSS with Vite</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
          "src/main.jsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
          "src/App.jsx": `export default function App() {
  return (
    <div className="bg-blue-500 text-white p-4">
      <h1>Hello, Tailwind CSS with Vite!</h1>
    </div>
  );
}`,
          "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,
          "tailwind.config.js": `module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
          "postcss.config.js": `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
          "vite.config.js": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,
          "package.json": JSON.stringify({
            name: "react-tailwind-vite",
            version: "1.0.0",
            scripts: {
              dev: "vite",
              build: "vite build",
              preview: "vite preview",
            },
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              tailwindcss: "^3.3.2",
              autoprefixer: "^10.4.14",
              postcss: "^8.4.21",
            },
            devDependencies: {
              vite: "^4.4.5",
              "@vitejs/plugin-react": "^4.0.0",
            },
          }),
        },
      },
      {
        openFile: "src/App.jsx", // Open this file by default
      }
    );
  }, []);

  return (
    <div>
      <h1>React + Tailwind CSS with Vite Sandbox</h1>
      <div id="my-div" className="h-svh"></div>
    </div>
  );
}
