import svgPaths from "../imports/svg-3hlsnpmccu";
import { cn } from "../lib/cn";

interface DeleteDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteDialog({ onConfirm, onCancel }: DeleteDialogProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/10 z-40"
        onClick={onCancel}
        aria-label="Close dialog"
      />
      
      {/* Dialog - matches Figma design exactly */}
      <div className="absolute right-0 top-full mt-2 z-50 bg-white h-[58px] w-[179px] rounded-[4px] border border-[#e0e0e0]" style={{ boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.15)' }}>
        <p className="absolute font-['Raleway',sans-serif] font-semibold leading-normal left-[10px] text-[10px] text-black text-nowrap top-[6px] whitespace-pre">
          Delete Recording
        </p>
        <p className="absolute font-['Raleway',sans-serif] font-semibold leading-normal left-[10px] text-[10px] text-black text-nowrap top-[23px] whitespace-pre">
          Are you Sure You Want to Delete?
        </p>
        
        {/* Yes Button */}
        <div className="absolute bg-[#1c1c1e] h-[16px] rounded-[2px] top-[39px] w-[30px] left-[139px]">
          <button
            onClick={onConfirm}
            className="flex flex-row items-center justify-center size-full"
          >
            <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
              <p className="font-['Raleway',sans-serif] font-semibold leading-normal relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">
                Yes
              </p>
            </div>
          </button>
        </div>
        
        {/* No Button */}
        <div className="absolute bg-[#969696] h-[16px] rounded-[2px] top-[39px] w-[30px] left-[107px]">
          <button
            onClick={onCancel}
            className="flex flex-row items-center justify-center size-full"
          >
            <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
              <p className="font-['Raleway',sans-serif] font-semibold leading-normal relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">
                No
              </p>
            </div>
          </button>
        </div>
        
        {/* Arrow pointing up to delete button */}
        <div className="absolute -top-[6px] right-4 w-[8px] h-[7px]" style={{ filter: 'drop-shadow(0px -1px 2px rgba(0, 0, 0, 0.15))' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 7">
            <path d={svgPaths.p18c08980} fill="white" />
          </svg>
        </div>
      </div>
    </>
  );
}