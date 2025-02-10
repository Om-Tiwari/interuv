import React from "react";
import CodeEditor from "./CodeEditor";

export default function Editor() {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-md ">
      <div className=" border border-gray-700 rounded-md overflow-hidden p-5">
        <CodeEditor />
      </div>
    </div>
  );
}
