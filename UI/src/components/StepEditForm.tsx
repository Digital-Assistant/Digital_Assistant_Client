import { useState } from "react";
import svgPaths from "../imports/svg-ckbrelabtn";
import svgPathsNew from "../imports/svg-k4wo7ducks";
import svgPathsMulti from "../imports/svg-xxlbqiqnh7";

interface StepEditFormProps {
  stepNumber: number;
  initialTitle: string;
  initialDelay?: number;
  onSave: (data: { title: string; delay?: number }) => void;
  onCancel: () => void;
}

export function StepEditForm({ stepNumber, initialTitle, initialDelay, onSave, onCancel }: StepEditFormProps) {
  const [homeValue, setHomeValue] = useState(initialTitle);
  const [isEditingHome, setIsEditingHome] = useState(false);
  const [selectedType, setSelectedType] = useState("Link");
  const [tooltipValue, setTooltipValue] = useState("");
  const [isEditingTooltip, setIsEditingTooltip] = useState(false);
  const [enableSlowReplay, setEnableSlowReplay] = useState(initialDelay ? true : false);
  const [delaySeconds, setDelaySeconds] = useState(initialDelay?.toString() || "3");
  const [skipDuringPlay, setSkipDuringPlay] = useState(false);
  const [personalInformation, setPersonalInformation] = useState(false);
  const [showSkipTooltip, setShowSkipTooltip] = useState(false);
  const [showPersonalTooltip, setShowPersonalTooltip] = useState(false);
  const [labels, setLabels] = useState([{ id: 1, value: "" }]);
  const [showPermissions, setShowPermissions] = useState(false);
  const [isDoctorChecked, setIsDoctorChecked] = useState(false);

  const handleSaveHome = () => {
    setIsEditingHome(false);
  };

  const handleSaveTooltip = () => {
    setIsEditingTooltip(false);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    if (value === "Highlight") {
      setIsEditingTooltip(true);
    }
  };

  const handleSaveStep = () => {
    onSave({
      title: homeValue,
      delay: enableSlowReplay ? parseInt(delaySeconds) : undefined,
    });
  };

  const handleAddAlias = () => {
    const newId = labels.length > 0 ? Math.max(...labels.map(l => l.id)) + 1 : 1;
    setLabels([...labels, { id: newId, value: "" }]);
  };

  const handleDeleteLabel = (id: number) => {
    setLabels(labels.filter(label => label.id !== id));
  };

  const handleLabelChange = (id: number, value: string) => {
    setLabels(labels.map(label => label.id === id ? { ...label, value } : label));
  };

  return (
    <div className="bg-[#d5d5d5] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <p className="font-['Roboto',sans-serif] text-[20px] text-[#1c1c1e] leading-[normal]">Step {stepNumber}</p>
        <button onClick={onCancel} className="w-6 h-6 flex items-center justify-center hover:opacity-80 transition-opacity" aria-label="Close">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <path d={svgPaths.p3f2c8580} fill="black" />
          </svg>
        </button>
      </div>

      {/* Home/Title Field */}
      <div className="px-4 mt-2">
        {!isEditingHome ? (
          <div className="relative bg-[#969696] h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-5">
            <p className="font-['Roboto',sans-serif] text-[20px] text-white tracking-[0.25px] leading-[20px]">
              {homeValue}
            </p>
            <button
              onClick={() => setIsEditingHome(true)}
              className="absolute right-3 w-6 h-6 hover:opacity-80 transition-opacity"
              aria-label="Edit"
            >
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d={svgPaths.p157c33f0} fill="white" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="relative bg-white h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center pl-3 pr-14">
            <input
              type="text"
              value={homeValue}
              onChange={(e) => setHomeValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-['Roboto',sans-serif] text-[20px] text-black tracking-[0.25px] leading-[20px]"
              autoFocus
            />
            <button
              onClick={handleSaveHome}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-[30px] flex items-center justify-center"
              aria-label="Save"
            >
              <svg className="block w-9 h-[42px]" fill="none" preserveAspectRatio="none" viewBox="0 0 36 42">
                <g filter="url(#filter0_dd_home)">
                  <rect fill="black" height="30" rx="4" width="28" x="4" y="4" />
                  <path d="M10 19L15.25 24.25L25.75 13" fill="black" />
                  <path d="M10 19L15.25 24.25L25.75 13" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="42" id="filter0_dd_home" width="36" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_home" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="-2" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend in2="effect1_dropShadow_home" mode="normal" result="effect2_dropShadow_home" />
                    <feBlend in="SourceGraphic" in2="effect2_dropShadow_home" mode="normal" result="shape" />
                  </filter>
                </defs>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Properties Section */}
      <div className="px-4 mt-3">
        <h3 className="font-['Raleway',sans-serif] font-semibold text-[20px] text-[#1c1c1e] mb-2.5 leading-[normal]">
          Properties
        </h3>

        {/* Checkboxes */}
        <div className="flex items-center gap-6 mb-5">
          {/* Skip during play */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSkipDuringPlay(!skipDuringPlay)}
              className="w-[22px] h-[22px] border-2 border-black rounded bg-white flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Toggle skip during play"
            >
              {skipDuringPlay && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6L4.5 8.5L10 3" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              )}
            </button>
            <label 
              onClick={() => setSkipDuringPlay(!skipDuringPlay)}
              className="font-['Jost',sans-serif] text-[16px] text-black leading-[1.5] whitespace-nowrap cursor-pointer"
            >
              Skip during play
            </label>
            <div className="relative">
              <button 
                onMouseEnter={() => setShowSkipTooltip(true)}
                onMouseLeave={() => setShowSkipTooltip(false)}
                className="w-[18px] h-[18px] flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity" 
                aria-label="Info"
              >
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
                  <circle cx="8.5" cy="8.5" fill="black" r="8.5" />
                  <path d={svgPathsNew.p1e8c400} fill="white" />
                </svg>
              </button>
              {showSkipTooltip && (
                <div 
                  onMouseEnter={() => setShowSkipTooltip(true)}
                  onMouseLeave={() => setShowSkipTooltip(false)}
                  className="absolute top-full left-0 mt-2 bg-black text-white text-[12px] px-3 py-2 rounded-md shadow-lg z-50 w-[200px]"
                >
                  Skip this step during playback
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-black rotate-45"></div>
                </div>
              )}
            </div>
          </div>

          {/* Personal information */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPersonalInformation(!personalInformation)}
              className="w-[22px] h-[22px] border-2 border-black rounded bg-white flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Toggle personal information"
            >
              {personalInformation && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6L4.5 8.5L10 3" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              )}
            </button>
            <label 
              onClick={() => setPersonalInformation(!personalInformation)}
              className="font-['Jost',sans-serif] text-[16px] text-black leading-[1.5] whitespace-nowrap cursor-pointer"
            >
              Personal information
            </label>
            <div className="relative">
              <button 
                onMouseEnter={() => setShowPersonalTooltip(true)}
                onMouseLeave={() => setShowPersonalTooltip(false)}
                className="w-[18px] h-[18px] flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity" 
                aria-label="Info"
              >
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
                  <circle cx="8.5" cy="8.5" fill="black" r="8.5" />
                  <path d={svgPathsNew.p1e8c400} fill="white" />
                </svg>
              </button>
              {showPersonalTooltip && (
                <div 
                  onMouseEnter={() => setShowPersonalTooltip(true)}
                  onMouseLeave={() => setShowPersonalTooltip(false)}
                  className="absolute top-full right-0 mt-2 bg-black text-white text-[12px] px-3 py-2 rounded-md shadow-lg z-50 w-[200px]"
                >
                  This field contains personal information
                  <div className="absolute -top-1 right-4 w-2 h-2 bg-black rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Type Field */}
        <div className="mb-5">
          <label className="font-['Montserrat',sans-serif] font-medium text-[16px] text-black mb-2 block leading-[normal]">
            Type
          </label>
          <div className="relative bg-white border border-neutral-300 h-[46px] rounded-[8px] flex items-center px-3">
            <select
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-['Raleway',sans-serif] text-[14px] text-black leading-[normal] appearance-none cursor-pointer"
            >
              <option value="Link">Link</option>
              <option value="Highlight">High Light</option>
            </select>
            <div className="absolute right-3 w-6 h-6 pointer-events-none">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d={svgPathsNew.p37cfbaf0} fill="black" />
              </svg>
            </div>
          </div>
        </div>

        {/* Custom Tool Tip Field (shown when Highlight is selected) */}
        {selectedType === "Highlight" && (
          <div className="mb-5">
            {!isEditingTooltip && tooltipValue ? (
              <div className="relative bg-white h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center pl-3 pr-14">
                <p className="font-['Roboto',sans-serif] text-[14px] text-black tracking-[0.25px] leading-[20px]">
                  {tooltipValue}
                </p>
              </div>
            ) : (
              <div className="relative bg-white h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center pl-3 pr-14">
                <input
                  type="text"
                  value={tooltipValue}
                  onChange={(e) => setTooltipValue(e.target.value)}
                  placeholder="Custom Tool Tip (optional)|"
                  className="flex-1 bg-transparent border-none outline-none font-['Roboto',sans-serif] text-[14px] text-black tracking-[0.25px] leading-[20px] placeholder:text-black"
                  autoFocus
                />
                <button
                  onClick={handleSaveTooltip}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-[30px] flex items-center justify-center"
                  aria-label="Save"
                >
                  <svg className="block w-9 h-[42px]" fill="none" preserveAspectRatio="none" viewBox="0 0 36 42">
                    <g filter="url(#filter0_dd_tooltip)">
                      <rect fill="black" height="30" rx="4" width="28" x="4" y="4" />
                      <path d="M10 19L15.25 24.25L25.75 13" fill="black" />
                      <path d="M10 19L15.25 24.25L25.75 13" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
                    </g>
                    <defs>
                      <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="42" id="filter0_dd_tooltip" width="36" x="0" y="0">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_tooltip" />
                        <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dy="-2" />
                        <feGaussianBlur stdDeviation="1" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend in2="effect1_dropShadow_tooltip" mode="normal" result="effect2_dropShadow_tooltip" />
                        <feBlend in="SourceGraphic" in2="effect2_dropShadow_tooltip" mode="normal" result="shape" />
                      </filter>
                    </defs>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Delay Field */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Delay in seconds (optional)"
            className="w-full bg-white border border-[#c8c8c8] h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 font-['Raleway',sans-serif] text-[14px] text-black placeholder:text-black outline-none leading-[normal]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[10px] mb-3">
          <button 
            onClick={onCancel}
            className="flex-1 bg-[#969696] h-[50px] rounded-[8px] font-['Raleway',sans-serif] text-[20px] text-white hover:opacity-90 transition-opacity leading-[normal]"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveStep}
            className="flex-1 bg-black h-[50px] rounded-[8px] font-['Raleway',sans-serif] text-[20px] text-white hover:opacity-90 transition-opacity leading-[normal]"
          >
            Save step
          </button>
        </div>
      </div>
    </div>
  );
}
