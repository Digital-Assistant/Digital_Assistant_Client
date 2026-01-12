import svgPathsDetail from "../imports/svg-0ikchrah8d";
import { useState } from "react";
import { ReportIssueDialog } from "./ReportIssueDialog";
import { IconButton } from "./IconButton";
import { cn } from "../lib/cn";

interface FeedbackButtonsProps {
  onLike?: () => void;
  onDislike?: () => void;
  onReport?: (issueType: string, description: string) => void;
}

export function FeedbackButtons({ onLike, onDislike, onReport }: FeedbackButtonsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    onDislike?.();
  };

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReportDialog(true);
  };

  const handleReportSubmit = (issueType: string, description: string) => {
    setShowReportDialog(false);
    onReport?.(issueType, description);
  };

  return (
    <div className="flex gap-[10px] items-center">
      {/* Like */}
      <IconButton 
        onClick={handleLike}
        size="md"
        aria-label="Like"
        className={cn(isLiked && "opacity-100")}
      >
        <div className="size-6">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <g clipPath="url(#clip0_thumb_up)">
              <path 
                d={svgPathsDetail.p11b5d400} 
                stroke="hsl(var(--widget-icon-primary))" 
                strokeWidth="2" 
                fill={isLiked ? "hsl(var(--widget-icon-active))" : "none"} 
              />
            </g>
            <defs>
              <clipPath id="clip0_thumb_up">
                <rect fill="white" height="24" width="24" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </IconButton>

      {/* Dislike */}
      <IconButton 
        onClick={handleDislike}
        size="md"
        aria-label="Dislike"
        className={cn(isDisliked && "opacity-100")}
      >
        <div className="size-6">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <g clipPath="url(#clip0_thumb_down)">
              <path 
                d={svgPathsDetail.pe9ecb00} 
                stroke="hsl(var(--widget-icon-primary))" 
                strokeWidth="2" 
                fill={isDisliked ? "hsl(var(--widget-icon-active))" : "none"} 
              />
            </g>
            <defs>
              <clipPath id="clip0_thumb_down">
                <rect fill="white" height="24" width="24" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </IconButton>

      {/* Report */}
      <div className="relative overflow-visible">
        <IconButton 
          onClick={handleReportClick}
          size="md"
          aria-label="Report"
        >
          <div className="size-6">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <g clipPath="url(#clip0_report)">
                <path d={svgPathsDetail.p3889b800} fill="hsl(var(--widget-icon-primary))" />
              </g>
              <defs>
                <clipPath id="clip0_report">
                  <rect fill="white" height="24" width="24" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </IconButton>
        
        {showReportDialog && (
          <ReportIssueDialog 
            onSubmit={handleReportSubmit}
            onCancel={() => setShowReportDialog(false)}
          />
        )}
      </div>
    </div>
  );
}