import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-kh6ah24w99";

interface SavingProgressProps {
  totalSteps: number;
  onComplete: () => void;
}

export function SavingProgress({ totalSteps, onComplete }: SavingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Each step takes 1 second
    const stepDuration = 1000; // 1 second
    const progressIncrement = 100 / totalSteps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / totalSteps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [totalSteps]);

  // Calculate progress angle for the circular progress
  const progressAngle = (progress / 100) * 360;
  const radius = 156;
  const strokeWidth = 41.5187;

  return (
    <div className="bg-[#f6f6f6] relative size-full flex flex-col items-center justify-center">
      {/* Progress Circle */}
      <div className="relative w-[312px] h-[312px]">
        {/* Background Circle */}
        <svg className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 312 312">
          <path d={svgPaths.p38c89300} fill="#D9D9D9" />
        </svg>

        {/* Progress Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" fill="none" preserveAspectRatio="none" viewBox="0 0 312 312">
          <circle
            cx="156"
            cy="156"
            r={156 - strokeWidth / 2}
            fill="none"
            stroke="black"
            strokeWidth={strokeWidth}
            strokeDasharray={`${(2 * Math.PI * (156 - strokeWidth / 2) * progress) / 100} ${2 * Math.PI * (156 - strokeWidth / 2)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.3s ease' }}
          />
        </svg>

        {/* Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-['Roboto',sans-serif] font-semibold text-[64px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
            {Math.round(progress)}%
          </p>
        </div>
      </div>

      {/* Done Button */}
      {isComplete && (
        <button
          onClick={onComplete}
          className="bg-black w-[456px] h-[50px] rounded-[8px] flex items-center justify-center hover:opacity-90 transition-opacity mt-8"
        >
          <p className="font-['Raleway',sans-serif] text-[20px] text-white leading-[normal]">
            Done
          </p>
        </button>
      )}

      {/* Success Message */}
      {isComplete && (
        <div className="flex items-center gap-3 mt-8">
          {/* Success Icon */}
          <div className="relative w-[44px] h-[44px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 39">
              <path 
                d={svgPaths.p155e3300} 
                fill="#2F88FF" 
                stroke="black" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
              />
              <path 
                d={svgPaths.p279bc300} 
                stroke="white" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
              />
            </svg>
          </div>

          {/* Success Text */}
          <p className="font-['Roboto',sans-serif] font-semibold text-[32px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
            Saved Successfully
          </p>
        </div>
      )}
    </div>
  );
}