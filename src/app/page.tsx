import CodeEditor from "@/components/CodeEditor";
import React from "react";

export default function Page() {
  return (
    <div className="bg-gray-900 text-white p-4 mx-52">
      <h1 className="text-3xl font-bold mb-4 mt-10 ">Code Editor</h1>
      <div className=" border border-gray-700 rounded-md overflow-hidden p-5">
        <CodeEditor />
      </div>
    </div>
  );
}
