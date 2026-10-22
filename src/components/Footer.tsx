import svgPaths from "../imports/svg-s04gq19zek";

export function Footer() {
  return (
    <footer className="mt-6 flex items-center justify-center gap-1">
      <p className="font-['Raleway',sans-serif] text-[#a7a7a7] text-[12px]">
        Copyrights Reserved 2025
      </p>
      <div className="w-3 h-3">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 20 20"
        >
          <g clipPath="url(#clip0_copyright)">
            <path d={svgPaths.p2f395080} fill="#A7A7A7" />
          </g>
          <defs>
            <clipPath id="clip0_copyright">
              <rect fill="white" height="20" width="20" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </footer>
  );
}