interface RecordingScreenProps {
  onContainerClick: () => void;
  onCancel: () => void;
}

export function RecordingScreen({ onContainerClick, onCancel }: RecordingScreenProps) {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start w-full" data-name="Body Content">
      {/* Recording Started Header */}
      <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Recording Started">
        <div className="relative shrink-0 size-[16px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="#FB2C36" r="8" />
          </svg>
        </div>
        <div className="flex flex-col font-['Raleway',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1c1c1e] text-[16px] text-center text-nowrap">
          <p className="leading-[normal] whitespace-pre">Recording Sequence</p>
        </div>
      </div>

      {/* Recording Container */}
      <button
        onClick={onContainerClick}
        className="basis-0 bg-[#f2f2f2] content-stretch flex grow items-center justify-center min-h-[600px] relative rounded-[8px] shrink-0 w-full hover:bg-[#e8e8e8] transition-colors cursor-pointer"
        data-name="Recording Container"
      >
        <div aria-hidden="true" className="absolute border border-[#cccccc] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
        <div className="flex flex-col font-['Raleway',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1c1c1e] text-[16px] text-center max-w-[296px]">
          <p className="leading-[normal]">Navigate and click through the website to see the steps here</p>
        </div>
      </button>
      
      {/* Cancel Button */}
      <div className="w-full flex justify-center">
        <button
          onClick={onCancel}
          className="bg-[#969696] rounded-[4px] px-8 py-3 hover:bg-[#808080] transition-colors"
        >
          <span className="font-['Raleway',sans-serif] font-semibold text-[16px] text-white">
            Cancel Recording
          </span>
        </button>
      </div>
    </div>
  );
}