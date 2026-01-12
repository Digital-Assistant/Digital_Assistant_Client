import svgPaths from "../imports/svg-s04gq19zek";
import { useState } from "react";
import { ShareDialog } from "./ShareDialog";

interface RecordingCardProps {
  title: string;
  onPlay?: () => void;
  onView?: () => void;
  onShare?: () => void;
  onClick?: () => void;
}

export function RecordingCard({
  title,
  onPlay,
  onView,
  onShare,
  onClick,
}: RecordingCardProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareDialog(true);
    onShare?.();
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.();
    onClick?.(); // Navigate to detail page
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView?.();
    onClick?.(); // Navigate to detail page
  };

  return (
    <article
      className="bg-white flex gap-2 h-[83px] items-center px-6 py-3 rounded shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full hover:bg-gray-50 transition-colors relative"
    >
      <div className="flex gap-2 items-center flex-1 min-w-0">
        <button
          onClick={handlePlayClick}
          className="shrink-0 hover:opacity-80 transition-opacity"
          aria-label={`Play ${title}`}
        >
          <div className="h-[48.898px] w-[48px]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 48 49"
            >
              <g clipPath="url(#clip0_play)">
                <path d={svgPaths.p1763cfc0} fill="black" />
              </g>
              <defs>
                <clipPath id="clip0_play">
                  <rect
                    fill="white"
                    height="48.8985"
                    width="48"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </button>
        <h3 className="text-[#3e3e3e] text-[20px] font-['Roboto',sans-serif] truncate">
          {title}
        </h3>
      </div>
      <div className="flex gap-2 items-center shrink-0">
        <button
          onClick={handleViewClick}
          className="hover:opacity-80 transition-opacity"
          aria-label={`View ${title}`}
        >
          <div className="size-[32px]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 32 32"
            >
              <path
                clipRule="evenodd"
                d={svgPaths.p324ae600}
                fill="#A6A6A6"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </button>
        <div className="relative">
          <button
            onClick={handleShareClick}
            className="hover:opacity-80 transition-opacity"
            aria-label={`Share ${title}`}
          >
            <div className="size-[32px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 32 32"
              >
                <path d={svgPaths.p909ba00} fill="#A6A6A6" />
              </svg>
            </div>
          </button>

          {/* Share Dialog positioned relative to button */}
          {showShareDialog && (
            <ShareDialog
              url="https://recording.com"
              onClose={() => setShowShareDialog(false)}
            />
          )}
        </div>
      </div>
    </article>
  );
}