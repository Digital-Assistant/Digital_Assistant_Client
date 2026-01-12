import svgPaths from "../imports/svg-hfh3cd2q4z";
import { useState } from "react";
import { cn } from "../lib/cn";

interface ReportIssueDialogProps {
  onSubmit: (issueType: string, description: string) => void;
  onCancel: () => void;
}

export function ReportIssueDialog({ onSubmit, onCancel }: ReportIssueDialogProps) {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const issueTypes = [
    "Audio Issue",
    "Video Issue",
    "Sync Issue",
    "Missing Content",
    "Other"
  ];

  const handleSubmit = () => {
    if (issueType && description) {
      onSubmit(issueType, description);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/10 z-40"
        onClick={onCancel}
        aria-label="Close dialog"
      />
      
      {/* Dialog - matches Figma design exactly */}
      <div className="absolute right-0 top-full mt-2 z-50 bg-white h-[104.63px] w-[208px] rounded-[4px] overflow-visible border border-[#e0e0e0]" style={{ boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.15)' }}>
        <p className="absolute font-['Raleway',sans-serif] font-semibold leading-normal left-[8px] text-[10px] text-black text-nowrap top-[6px] whitespace-pre">
          Report Recording Issue
        </p>
        
        {/* Issue Type Dropdown */}
        <div className="absolute left-[8px] top-[23.63px]">
          <div className="absolute bg-neutral-50 border border-[#dbdbdb] border-solid h-[16px] rounded-[2px] w-[192px]" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="absolute w-[192px] h-[16px] z-10"
          >
            <div className="absolute flex flex-col font-['Raleway',sans-serif] font-semibold justify-center leading-[0] left-[6.96px] text-[8px] text-nowrap top-[8.5px] -translate-y-1/2">
              <p className={cn(
                "leading-normal whitespace-pre",
                issueType ? "text-black" : "text-[#8b8b8b]"
              )}>
                {issueType || "Select Issue Type"}
              </p>
            </div>
            <div className="absolute h-[5px] right-[8px] top-[5.5px] w-[10px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 5">
                <path d="M0 0L5 5L10 0H0Z" fill="#B4B4B4" />
              </svg>
            </div>
          </button>
          
          {/* Dropdown Options */}
          {showDropdown && (
            <div className={cn(
              "absolute top-[18px] left-0 w-[192px] z-50 max-h-32 overflow-y-auto",
              "bg-white border border-[#dbdbdb] rounded-[2px]"
            )} style={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)' }}>
              {issueTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setIssueType(type);
                    setShowDropdown(false);
                  }}
                  className={cn(
                    "w-full px-2 py-1 text-left transition-colors",
                    "hover:bg-[#f0f0f0]"
                  )}
                >
                  <p className={cn(
                    "font-['Raleway',sans-serif] font-semibold text-[8px] leading-normal",
                    "text-black"
                  )}>
                    {type}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Description Textarea */}
        <div className="absolute left-[8px] top-[42.63px]">
          <div className="absolute bg-neutral-50 border border-[#dbdbdb] border-solid h-[36px] rounded-[2px] w-[192px]" />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className={cn(
              "absolute w-[192px] h-[36px] px-2 py-1 font-['Raleway',sans-serif] font-semibold text-[8px] text-black placeholder:text-[#8b8b8b] resize-none leading-normal bg-transparent border-none outline-none",
              "z-10"
            )}
          />
        </div>
        
        {/* Submit Button */}
        <div className="absolute bg-black h-[18px] left-[129px] rounded-[2px] top-[82.63px] w-[71px]">
          <button
            onClick={handleSubmit}
            className="flex flex-row items-center justify-center size-full"
          >
            <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
              <p className="font-['Raleway',sans-serif] font-semibold leading-normal relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">
                submit
              </p>
            </div>
          </button>
        </div>
        
        {/* Cancel Button */}
        <div className="absolute bg-[#969696] h-[16px] left-[8px] rounded-[2px] top-[84.63px] w-[71px]">
          <button
            onClick={onCancel}
            className="flex flex-row items-center justify-center size-full"
          >
            <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
              <p className="font-['Raleway',sans-serif] font-semibold leading-normal relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">
                Cancel
              </p>
            </div>
          </button>
        </div>
        
        {/* Arrow pointing up to report button */}
        <div className="absolute -top-[8px] right-0 w-[10px] h-[10px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p310a4f00} fill="white" />
          </svg>
        </div>
      </div>
    </>
  );
}