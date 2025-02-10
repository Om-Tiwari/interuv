import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LANGUAGE_VERSIONS } from "./data";

interface LanguageSelectorProps {
  language: string;
  setLanguage: (value: string) => void;
}

export default function LanguageSelector({
  language,
  setLanguage,
}: LanguageSelectorProps) {
  const languageList = Object.entries(LANGUAGE_VERSIONS);
  const handleChange = (value: string) => {
    setLanguage(value);
  };
  return (
    <div>
      <Select
        onValueChange={(value) => handleChange(value)}
        defaultValue={language}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {languageList.map(([lang, version]) => (
            <SelectItem value={lang} key={version}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
