import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { CONFIG } from "../../config";
const LanguageSelect = ({ onLanguageChange, selectedLang, config }) => {
    const [langOptions, setLangOptions] = useState([]);
    useEffect(() => {
        /**
         * To generate language options list
         */
        if (config.enableMultilingual) {
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
                }
                else {
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
    return (_jsx("select", Object.assign({ name: "uda-lang-select", id: "uda-lang-select", className: "uda_exclude", onChange: (e) => onLanguageChange(e.target.value), value: selectedLang }, { children: langOptions.map((eachLangOption) => (_jsx("option", Object.assign({ value: eachLangOption.langVal }, { children: eachLangOption.langName }), eachLangOption.langVal))) })));
};
export default LanguageSelect;
//# sourceMappingURL=LanguageSelect.js.map