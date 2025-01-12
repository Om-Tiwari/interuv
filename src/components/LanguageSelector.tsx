import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LANGUAGE_VERSIONS } from "./data";

export default function LanguageSelector() {
  const language = Object.entries(LANGUAGE_VERSIONS);
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {language.map(([lang, version]) => (
            <SelectItem value={version} key={version}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
