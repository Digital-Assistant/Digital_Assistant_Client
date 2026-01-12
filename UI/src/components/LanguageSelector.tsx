import { useState } from "react";

interface LanguageSelectorProps {
  onClose: () => void;
}

export function LanguageSelector({ onClose }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = [
    "English",
    "Kannada",
    "Malayalam",
    "Hindi",
    "Telugu",
    "Tamil",
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-transparent z-40"
        onClick={onClose}
      />
      
      {/* Language Dropdown - positioned relative to parent */}
      <div className="absolute bg-white rounded-[4px] shadow-lg top-full right-0 mt-2 w-[150px] z-50 py-2">
        <p className="px-3 py-2 font-['Inter',sans-serif] text-[14px] text-black">
          Select Language
        </p>
        
        <div className="max-h-[180px] overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language}
              onClick={() => {
                setSelectedLanguage(language);
                setTimeout(() => onClose(), 300);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <div className="size-[16px] shrink-0">
                <svg fill="none" preserveAspectRatio="none" viewBox="0 0 16 16" className="block size-full">
                  <g>
                    <path 
                      d="M8 15C4.14 15 1 11.86 1 8C1 4.14 4.14 1 8 1C11.86 1 15 4.14 15 8C15 11.86 11.86 15 8 15ZM8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2Z" 
                      fill="black" 
                    />
                    {selectedLanguage === language && (
                      <path 
                        d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" 
                        fill="#1E558C" 
                      />
                    )}
                  </g>
                </svg>
              </div>
              <span className="font-['Inter',sans-serif] text-[14px] text-black">
                {language}
              </span>
            </button>
          ))}
        </div>
        
        {/* Arrow pointing up */}
        <div className="absolute -top-2 right-4 w-4 h-2">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
            <path d="M7 0L14 8H0L7 0Z" fill="white" />
          </svg>
        </div>
      </div>
    </>
  );
}