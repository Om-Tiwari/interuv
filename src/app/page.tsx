import CodeEditor from "@/components/CodeEditor";
import React from "react";

export default function Page() {
  return (
    <div className="bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Code Editor</h1>
      <div className=" border border-gray-700 rounded-md overflow-hidden p-5">
        <CodeEditor />
      </div>
    </div>
  );
}
