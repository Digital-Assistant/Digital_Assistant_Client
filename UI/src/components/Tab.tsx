interface TabProps {
  label: string;
  iconPath: string;
  isSelected?: boolean;
  onClick?: () => void;
  filled?: boolean;
}

export function Tab({
  label,
  iconPath,
  isSelected = false,
  onClick,
  filled = false,
}: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-full rounded flex items-center justify-center gap-2 px-2 py-2 transition-colors ${
        isSelected
          ? "bg-[#0c0c0c] text-[#f6f6f6]"
          : "bg-transparent text-[#3e3e3e] hover:bg-gray-100"
      }`}
    >
      <div className="w-5 h-5">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 20 20"
        >
          <g clipPath="url(#clip0_tab)">
            <path
              d={iconPath}
              fill={isSelected ? "white" : "#3E3E3E"}
            />
          </g>
          <defs>
            <clipPath id="clip0_tab">
              <rect fill="white" height="20" width="20" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <span
        className={`font-['Raleway',sans-serif] ${isSelected ? "font-semibold" : "font-normal"}`}
      >
        {label}
      </span>
    </button>
  );
}
