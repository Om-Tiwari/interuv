import CodeEditor from "@/components/CodeEditor";
import Output from "@/components/Output";
import React from "react";

export default function Page() {
  return (
    <div className="h-screen bg-gray-900 text-white p-4">
      <div className="flex gap-4 my-14 mx-10 border border-gray-700 rounded-md p-4">
        <div className="h-[80vh] overflow-hidden w-2/4 rounded-md">
          <h1 className="text-2xl font-bold mb-4">Code Editor</h1>
          <CodeEditor />
        </div>
        <Output />
      </div>
    </div>
  );
}
