import React, { useEffect, useState } from "react";
import { CONFIG } from "../../config";

interface ILanguageSelect {
  onLanguageChange: (event: any) => void;
  selectedLang: string;
}

interface ILanguageOption {
  langVal: string;
  langName: string;
}

const LanguageSelect = ({
  onLanguageChange,
  selectedLang,
}: ILanguageSelect) => {
  const [langOptions, setLangOptions] = useState<ILanguageOption[]>([]);

  useEffect(() => {
    /**
     * To generate language options list
     */
    if (CONFIG.multilingual.enabled) {
      const tempLangOptions = [];
      CONFIG.bcpLang.forEach((langcode) => {
        if (langcode.length > 2) {
          langcode.forEach((sublang, sublangindex) => {
            if (sublangindex !== 0) {
              const eachLangOption = {
                langVal: sublang[0],
                langName: langcode[0] + " - " + sublang[1],
              };
              tempLangOptions.push(eachLangOption);
            }
          });
        } else {
          const eachLangOption = {
            langVal: langcode[1],
            langName: langcode[0],
          };
          tempLangOptions.push(eachLangOption);
        }
      });
      setLangOptions(tempLangOptions);
    }
  }, []);

  return (
    <select
      name="uda-lang-select"
      id="uda-lang-select"
      className="uda_exclude"
      onChange={(e)=>onLanguageChange(e.target.value)}
      value={selectedLang}
    >
      {langOptions.map((eachLangOption) => (
        <option value={eachLangOption.langVal} key={eachLangOption.langVal}>
          {eachLangOption.langName}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelect;
