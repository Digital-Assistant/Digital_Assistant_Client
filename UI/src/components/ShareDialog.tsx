import { useState } from "react";
import { cn } from "../lib/cn";

interface ShareDialogProps {
  url?: string;
  onClose: () => void;
}

export function ShareDialog({ url = "https://recording.com", onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Backdrop - transparent click area */}
      <div 
        className="fixed inset-0 bg-black/10 z-40"
        onClick={onClose}
        aria-label="Close dialog"
      />
      
      {/* Dialog - matches Figma design exactly */}
      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 z-50 bg-white h-[37px] w-[294px] rounded-[3px] border border-[#e0e0e0]" style={{ boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.15)' }}>
        <p className="absolute font-['Raleway',sans-serif] font-semibold leading-normal left-[7px] text-[14px] text-black text-nowrap top-[11px] whitespace-pre">
          Copy the link
        </p>
        <div className="absolute bg-[#d9d9d9] h-[25px] left-[100px] rounded-[4px] top-[6px] w-[187px]" />
        <p className="absolute font-['Raleway',sans-serif] font-semibold leading-normal left-[106px] text-[14px] text-black text-nowrap top-[10px] whitespace-pre truncate max-w-[150px]">
          {url}
        </p>
        <button
          onClick={handleCopy}
          className="absolute left-[262px] size-[25px] top-[6px]"
          aria-label="Copy link"
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
            <rect fill={copied ? "#22BB33" : "#F3F3F3"} height="25" rx="4" width="25" />
            <path 
              clipRule="evenodd" 
              d="M8.33301 6.25C7.41254 6.25 6.66634 6.99619 6.66634 7.91667V14.5833C6.66634 15.5038 7.41254 16.25 8.33301 16.25H11.6663V14.5833H8.33301V7.91667H14.9997V11.25H16.6663V7.91667C16.6663 6.99619 15.9201 6.25 14.9997 6.25H8.33301ZM10.833 10.4167C9.9126 10.4167 9.16634 11.1629 9.16634 12.0833V18.75C9.16634 19.6705 9.9126 20.4167 10.833 20.4167H17.4997C18.4201 20.4167 19.1663 19.6705 19.1663 18.75V12.0833C19.1663 11.1629 18.4201 10.4167 17.4997 10.4167H10.833Z" 
              fill="black" 
              fillRule="evenodd" 
            />
          </svg>
        </button>
        
        {/* Arrow pointing right to the share button */}
        <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-[10px] h-[15px]" style={{ filter: 'drop-shadow(-1px 0px 2px rgba(0, 0, 0, 0.15))' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 15">
            <path d="M0 0L10 7.5L0 15V0Z" fill="white" />
          </svg>
        </div>
      </div>
    </>
  );
}