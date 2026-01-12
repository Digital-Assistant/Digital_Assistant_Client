import svgPathsNew from "../imports/svg-hfh3cd2q4z";
import svgPathsFailed from "../imports/svg-onrwwfl8wg";
import { IconButton } from "./IconButton";
import { cn } from "../lib/cn";

interface StepProps {
  title: string;
  delay?: number;
  completed: boolean;
  failed?: boolean;
  onEdit?: () => void;
}

export function Step({ title, delay, completed, failed, onEdit }: StepProps) {
  const getIconColor = () => {
    if (failed) return "hsl(var(--widget-status-error))";
    if (completed) return "hsl(var(--widget-status-success))";
    return "hsl(var(--widget-icon-secondary))";
  };

  return (
    <div className="relative">
      <div className="content-stretch flex gap-[10px] h-[44px] items-center px-[10px] py-[10px]">
        {/* Check/Cancel Icon */}
        <div className="relative shrink-0 size-6">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            {failed ? (
              <>
                <g clipPath="url(#clip0_cancel)">
                  <path 
                    d={svgPathsNew.p2511d980} 
                    fill={getIconColor()}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_cancel">
                    <rect fill="white" height="24" width="24" />
                  </clipPath>
                </defs>
              </>
            ) : (
              <>
                <g clipPath="url(#clip0_check)">
                  <path 
                    d={svgPathsNew.p2de1ad00} 
                    fill={getIconColor()}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_check">
                    <rect fill="white" height="24" width="24" />
                  </clipPath>
                </defs>
              </>
            )}
          </svg>
        </div>

        {/* Step Title */}
        <div className={cn(
          "flex flex-col font-['Raleway',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[20px] text-center text-nowrap",
          "text-black"
        )}>
          <p className="leading-[normal] whitespace-pre">{title}</p>
        </div>
        
        <div className="flex-1" />
        
        {/* Edit Icon */}
        <IconButton
          onClick={onEdit}
          size="sm"
          aria-label={`Edit ${title}`}
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <path d={svgPathsNew.p157c33f0} fill="hsl(var(--widget-icon-primary))" />
          </svg>
        </IconButton>
      </div>
      
      {/* Delay indicator if present */}
      {delay && (
        <div className="flex gap-[10px] items-center ml-9 h-[28px]">
          <div className="size-7">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
              <g clipPath="url(#clip0_alarm)">
                <path d={svgPathsNew.p1655fa80} fill="hsl(var(--widget-icon-secondary))" />
              </g>
              <defs>
                <clipPath id="clip0_alarm">
                  <rect fill="white" height="28" width="28" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className={cn(
            "flex flex-col font-['Raleway',sans-serif] font-semibold justify-center leading-[0] text-[20px] text-center text-nowrap",
            "text-[#969696]"
          )}>
            <p className="leading-[normal] whitespace-pre">{delay} seconds delay</p>
          </div>
        </div>
      )}
      
      {/* Failed step tooltip */}
      {failed && (
        <div className="relative ml-[36px] mt-1 mb-2 z-10">
          {/* Tooltip box */}
          <div className="bg-black text-white text-[12px] px-3 py-2 rounded-md shadow-lg w-fit">
            ! Unable to find
            {/* Arrow pointing up */}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-black rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
}