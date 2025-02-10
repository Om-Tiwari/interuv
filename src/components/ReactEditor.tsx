"use client";
import { useEffect } from "react";
import StackBlitzSDK from "@stackblitz/sdk"; // Default import

export default function ReactEditor() {
  useEffect(() => {
    // Use StackBlitzSDK.embedProject
    StackBlitzSDK.embedProject(
      "my-div", // ID of the container element
      {
        title: "React + Tailwind CSS with Vite (TypeScript)",
        description:
          "A React project with Tailwind CSS using Vite and TypeScript",
        template: "node", // Use Node.js template for Vite
        files: {
          // Required files for a React + Tailwind CSS project with Vite and TypeScript
          "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React + Tailwind CSS with Vite (TypeScript)</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
          "src/main.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
          "src/App.tsx": `import React from 'react';

const App: React.FC = () => {
  return (
    <div className="bg-blue-500 text-white p-4">
      <h1>Hello, Tailwind CSS with Vite and TypeScript!</h1>
    </div>
  );
};

export default App;`,
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
          "vite.config.ts": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true, // Enable HMR
    watch: {
      usePolling: true, // Ensure file changes are detected
    },
  },
});`,
          "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}`,
          "stackblitz.config.js": `module.exports = {
  installDependencies: true,
  startCommand: 'vite',
};`,
          "package.json": JSON.stringify({
            name: "react-tailwind-vite-ts",
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
              typescript: "^5.0.0",
              "@types/react": "^18.2.0",
              "@types/react-dom": "^18.2.0",
            },
          }),
        },
      },
      {
        openFile: "src/App.tsx", // Open this file by default
      }
    );
  }, []);

  return (
    <div>
      <div id="my-div" className="h-svh"></div>
      <h1 className="text-4xl">React + Tailwind CSS with Vite (TypeScript)</h1>
    </div>
  );
}
