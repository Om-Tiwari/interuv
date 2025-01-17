"use client";
import { useEffect } from 'react';
import StackBlitzSDK from '@stackblitz/sdk'; // Default import

export default function Home() {
    useEffect(() => {
        // Use StackBlitzSDK.embedProject
        StackBlitzSDK.embedProject(
            'my-div', // ID of the container element
            {
                title: 'React + Tailwind CSS',
                description: 'A React project with Tailwind CSS',
                template: 'create-react-app',
                files: {
                    // Required files for a React project
                    'public/index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
                    'src/index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
                    'src/App.js': `import React from 'react';
import './index.css';

function App() {
  return (
    <div className="bg-blue-500 text-white p-4">
      <h1>Hello, Tailwind CSS!</h1>
    </div>
  );
}

export default App;`,
                    'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,
                    'tailwind.config.js': `module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
                    'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
                    'package.json': JSON.stringify({
                        name: 'react-tailwind-sandbox',
                        version: '1.0.0',
                        scripts: {
                            start: 'react-scripts start',
                            build: 'react-scripts build',
                            test: 'react-scripts test',
                            eject: 'react-scripts eject',
                        },
                        dependencies: {
                            react: '^18.2.0',
                            'react-dom': '^18.2.0',
                            'react-scripts': '5.0.1',
                            tailwindcss: '^3.3.2',
                            autoprefixer: '^10.4.14',
                            postcss: '^8.4.21',
                        },
                    }),
                },
            },
            {
                openFile: 'src/App.js', // Open this file by default
            }
        );
    }, []);

    return (
        <div>
            <h1>React + Tailwind CSS Sandbox</h1>
            <div id="my-div" style={{ height: '500px' }}></div>
        </div>
    );
}