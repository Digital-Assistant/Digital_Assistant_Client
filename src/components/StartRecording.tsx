interface StartRecordingProps {
  onStart: () => void;
  onCancel: () => void;
}

export function StartRecording({ onStart, onCancel }: StartRecordingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20">
      <p className="font-['Raleway',sans-serif] font-semibold text-[24px] text-[#1c1c1e] text-center">
        Click here to start recording
      </p>
      
      <button
        onClick={onStart}
        className="bg-[#fb2c36] rounded-full w-[182px] h-[182px] flex items-center justify-center hover:bg-[#e02830] transition-colors shadow-lg"
      >
        <span className="font-['Raleway',sans-serif] font-semibold text-[24px] text-white">
          Start
        </span>
      </button>
      
      <button
        onClick={onCancel}
        className="bg-[#969696] rounded-[4px] px-8 py-3 hover:bg-[#808080] transition-colors"
      >
        <span className="font-['Raleway',sans-serif] font-semibold text-[16px] text-white">
          Cancel
        </span>
      </button>
    </div>
  );
}