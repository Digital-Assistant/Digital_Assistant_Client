import svgPathsDetail from "../imports/svg-0ikchrah8d";
import svgPathsNew from "../imports/svg-hfh3cd2q4z";
import { useState } from "react";
import { ShareDialog } from "./ShareDialog";
import { DeleteDialog } from "./DeleteDialog";
import { IconButton } from "./IconButton";
import { cn } from "../lib/cn";

interface TitleBarProps {
  title: string;
  onBack: () => void;
  onTitleChange?: (newTitle: string) => void;
  onShare?: () => void;
  onDelete?: () => void;
}

export function TitleBar({ title, onBack, onTitleChange, onShare, onDelete }: TitleBarProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareDialog(true);
    onShare?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.();
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    onTitleChange?.(editedTitle);
  };

  return (
    <div className="content-stretch flex gap-[10px] h-[44px] items-center px-0 py-2 w-full">
      <IconButton 
        onClick={onBack}
        size="md"
        aria-label="Go back"
      >
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path d={svgPathsDetail.p3b54f780} fill="hsl(var(--widget-icon-primary))" />
        </svg>
      </IconButton>
      
      {isEditingTitle ? (
        <div className="basis-0 grow min-w-0 relative flex items-center gap-2">
          <div className={cn(
            "flex-1 border border-solid h-[39px] flex items-center px-3 min-w-0",
            "bg-widget-input",
            "border-widget-input-border",
            "rounded-widget-sm",
            "shadow-[0px_2px_4px_0px_var(--widget-input-shadow)]"
          )}>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave();
                if (e.key === 'Escape') {
                  setEditedTitle(title);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              className={cn(
                "w-full font-['Raleway',sans-serif] font-semibold text-[24px] bg-transparent outline-none",
                "text-black"
              )}
            />
          </div>
          <IconButton
            onClick={handleTitleSave}
            size="md"
            aria-label="Save title"
            className="hover:opacity-80"
          >
            <div className="size-[22.4px]">
              <div className="w-full h-full shadow-[0px_4px_4px_0px_hsl(var(--widget-input-shadow)),0px_-2px_2px_0px_hsl(var(--widget-input-shadow))]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.4 24">
                  <rect fill="hsl(var(--widget-button-primary-bg))" height="24" rx="4" width="22.4" />
                  <path d="M4.8 12L9 16.2L17.4 7.2" stroke="hsl(var(--widget-button-primary-text))" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" fill="none" />
                </svg>
              </div>
            </div>
          </IconButton>
        </div>
      ) : (
        <h2 className={cn(
          "basis-0 font-['Raleway',sans-serif] font-semibold grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[24px]",
          "text-black"
        )}>
          {editedTitle}
        </h2>
      )}
      
      {!isEditingTitle && (
        <IconButton 
          onClick={() => setIsEditingTitle(true)}
          size="md"
          aria-label="Edit title"
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <path d={svgPathsNew.p157c33f0} fill="hsl(var(--widget-icon-primary))" />
          </svg>
        </IconButton>
      )}
      
      <div className="relative overflow-visible">
        <IconButton 
          onClick={handleDeleteClick}
          size="md"
          aria-label="Delete"
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <g clipPath="url(#clip0_delete)">
              <path d={svgPathsNew.p2eacd800} fill="hsl(var(--widget-icon-primary))" />
            </g>
            <defs>
              <clipPath id="clip0_delete">
                <rect fill="white" height="24" rx="4" width="24" />
              </clipPath>
            </defs>
          </svg>
        </IconButton>
        
        {showDeleteDialog && (
          <DeleteDialog 
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteDialog(false)}
          />
        )}
      </div>
      
      <div className="relative overflow-visible">
        <IconButton 
          onClick={handleShareClick}
          size="md"
          aria-label="Share"
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <path d={svgPathsDetail.p378ed900} fill="hsl(var(--widget-icon-primary))" />
          </svg>
        </IconButton>
        
        {showShareDialog && (
          <ShareDialog 
            url="https://recording.com"
            onClose={() => setShowShareDialog(false)}
          />
        )}
      </div>
    </div>
  );
}