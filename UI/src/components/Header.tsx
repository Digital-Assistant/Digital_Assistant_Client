import svgPaths from "../imports/svg-s04gq19zek";
import { useState, useEffect, useRef } from "react";
import { LanguageSelector } from "./LanguageSelector";
import { SettingsMenu } from "./SettingsMenu";
import { usePanelPosition } from "../contexts/PanelPositionContext";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onRecClick?: () => void;
  showSearchBar?: boolean;
}

export function Header({ onRecClick, showSearchBar = true }: HeaderProps) {
  const { isAuthenticated } = useAuth();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isMicActive, setIsMicActive] = useState(false);
  const { position, togglePosition, setIsPanelVisible, panelHeight, togglePanelHeight } = usePanelPosition();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find the scrollable main content container
    const mainContent = headerRef.current?.closest('.bg-\\[\\#f6f6f6\\]')?.querySelector('main');
    
    if (!mainContent) return;

    const handleScroll = () => {
      setIsScrolled(mainContent.scrollTop > 10);
    };

    mainContent.addEventListener('scroll', handleScroll);
    return () => mainContent.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMinimize = () => {
    setIsPanelVisible(false);
  };

  const handleClose = () => {
    setIsPanelVisible(false);
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  return (
    <div ref={headerRef} className="w-full">
      {/* Header Controls - Always Visible */}
      <header className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Minimize Button */}
          <button
            onClick={handleMinimize}
            className="w-6 h-6 border-2 border-[#8e8e93] rounded flex items-end justify-center pb-0.5 hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <div className="w-4 h-0.5 bg-[#8e8e93] rounded-full" />
          </button>

          {/* Position Toggle Button */}
          <button
            onClick={togglePosition}
            className="w-6 h-6 border-2 border-[#8e8e93] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Toggle panel position"
            title={`Snap to ${position === 'left' ? 'right' : 'left'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              {position === 'right' ? (
                // Arrow pointing left
                <path d="M15 18L9 12L15 6" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                // Arrow pointing right
                <path d="M9 18L15 12L9 6" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>

          {/* Move/Drag Button */}
          <button
            className="w-6 h-6 border-2 border-[#8e8e93] rounded flex items-center justify-center hover:bg-gray-100 transition-colors drag-handle cursor-grab active:cursor-grabbing"
            aria-label="Drag to move panel"
            title="Drag to move panel"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <path d="M9 5L9 19M15 5L15 19M5 9L19 9M5 15L19 15" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Height Toggle Button */}
          <button
            onClick={togglePanelHeight}
            className="w-6 h-6 border-2 border-[#8e8e93] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Toggle panel height"
            title={panelHeight === 'full' ? 'Switch to half height' : 'Switch to full height'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              {panelHeight === 'full' ? (
                // Compress icon (two arrows pointing inward)
                <>
                  <path d="M12 5L12 10M12 14L12 19" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 8L12 5L15 8M9 16L12 19L15 16" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </>
              ) : (
                // Expand icon (two arrows pointing outward)
                <>
                  <path d="M12 10L12 5M12 19L12 14" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 7L12 4L15 7M9 17L12 20L15 17" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <h1 className="font-['Raleway',sans-serif] text-[32px] text-black">
            UDAN
          </h1>
          <span className="bg-[#cccccc] text-[#1e1e1e] text-[10px] font-['Raleway',sans-serif] px-1 rounded h-[14px] flex items-center">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* REC Button */}
          {onRecClick && (
            <button
              onClick={onRecClick}
              className="flex items-center gap-1 px-2 py-1 rounded-full border border-[#fb2c36] hover:bg-[rgba(251,44,54,0.1)] transition-colors"
              aria-label="Record"
            >
              <div className="w-2 h-2">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" fill="#FB2C36" r="4" />
                </svg>
              </div>
              <span className="font-['Roboto',sans-serif] text-[12px] text-[#fb2c36]">
                REC
              </span>
            </button>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="hover:opacity-80 transition-opacity"
              aria-label="Settings"
            >
              <div className="size-6">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24 24"
                >
                  <g clipPath="url(#clip0_settings)">
                    <path
                      d={svgPaths.p3a43e300}
                      fill="#8E8E93"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_settings">
                      <rect
                        fill="white"
                        height="24"
                        width="24"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </button>
            
            {/* Settings Menu - Only show when authenticated */}
            {isAuthenticated && showSettingsMenu && (
              <SettingsMenu onClose={() => setShowSettingsMenu(false)} />
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="w-6 h-6 border-2 border-[#8e8e93] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 24 24"
            >
              <path
                d={svgPaths.p29ed3860}
                stroke="#8E8E93"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Search Bar - Only Visible When Scrolled */}
      {showSearchBar && isScrolled && (
        <div className="w-full mb-7 relative">
          <div className="relative bg-[#d9d9d9] rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] h-[42px] flex items-center px-5">
            <div className="size-6 shrink-0">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 24 24"
              >
                <path d={svgPaths.pded2700} fill="black" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-2 text-base font-['Roboto',sans-serif] text-black placeholder:text-black"
            />
            <button
              onClick={() => setIsMicActive(!isMicActive)}
              className="shrink-0 hover:opacity-80 transition-opacity relative"
              aria-label="Voice search"
            >
              <div className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-colors group ${
                isMicActive 
                  ? 'bg-[#E57373] hover:bg-[#EF5350]' 
                  : 'bg-white hover:bg-black'
              }`}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
                    fill={isMicActive ? '#FFFFFF' : '#1C1C1E'}
                    className={isMicActive ? '' : 'group-hover:fill-white transition-colors'}
                  />
                  <path
                    d="M5 10V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V10"
                    stroke={isMicActive ? '#FFFFFF' : '#1C1C1E'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={isMicActive ? '' : 'group-hover:stroke-white transition-colors'}
                  />
                  <path
                    d="M12 19V23M12 23H8M12 23H16"
                    stroke={isMicActive ? '#FFFFFF' : '#1C1C1E'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={isMicActive ? '' : 'group-hover:stroke-white transition-colors'}
                  />
                </svg>
              </div>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="shrink-0 ml-2 hover:opacity-80 transition-opacity"
                aria-label="Translate"
              >
                <div className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-colors group ${
                  showLanguageSelector 
                    ? 'bg-black' 
                    : 'bg-white hover:bg-black'
                }`}>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 5H15M9 3V5M10.048 14.5C8.948 12.978 8.128 11.204 7.668 9.5M12.5 18H11.5M7.5 9.5H13.5M13.5 9.5C13.232 10.478 12.85 11.41 12.372 12.282M13.5 9.5H15.5M12.372 12.282C11.736 13.406 10.936 14.422 10.048 14.5M12.372 12.282L15 18M10.048 14.5L7.5 20.5M10.048 14.5C10.134 14.498 10.22 14.485 10.304 14.461M18 21L21.5 14.5L19.121 13.621M14.5 14.5L15.958 17.879M15.958 17.879L19.121 13.621M15.958 17.879L17.414 16.75"
                      stroke={showLanguageSelector ? '#FFFFFF' : '#1C1C1E'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={showLanguageSelector ? '' : 'group-hover:stroke-white transition-colors'}
                    />
                  </svg>
                </div>
              </button>
              
              {/* Language Selector Dropdown */}
              {showLanguageSelector && (
                <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Bar - Visible by default, hides on scroll */}
      {showSearchBar && !isScrolled && (
        <div className="w-full mb-4 relative">
          <div className="relative bg-[#d9d9d9] rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] h-[42px] flex items-center px-5">
            <div className="size-6 shrink-0">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 24 24"
              >
                <path d={svgPaths.pded2700} fill="black" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-2 text-base font-['Roboto',sans-serif] text-black placeholder:text-black"
            />
            
            {/* Clear Button - Only shown when there's text */}
            {searchValue && (
              <button
                onClick={handleClearSearch}
                className="shrink-0 hover:opacity-80 transition-opacity mr-2"
                aria-label="Clear search"
              >
                <div className="w-8 h-8 rounded-full bg-white hover:bg-black shadow-sm flex items-center justify-center transition-colors group">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="#1C1C1E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:stroke-white transition-colors"
                    />
                  </svg>
                </div>
              </button>
            )}
            
            <button
              onClick={() => setIsMicActive(!isMicActive)}
              className="shrink-0 hover:opacity-80 transition-opacity relative"
              aria-label="Voice search"
            >
              <div className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-colors group ${
                isMicActive 
                  ? 'bg-[#E57373] hover:bg-[#EF5350]' 
                  : 'bg-white hover:bg-black'
              }`}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
                    fill={isMicActive ? '#FFFFFF' : '#1C1C1E'}
                    className={isMicActive ? '' : 'group-hover:fill-white transition-colors'}
                  />
                  <path
                    d="M5 10V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V10"
                    stroke={isMicActive ? '#FFFFFF' : '#1C1C1E'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={isMicActive ? '' : 'group-hover:stroke-white transition-colors'}
                  />
                  <path
                    d="M12 19V23M12 23H8M12 23H16"
                    stroke={isMicActive ? '#FFFFFF' : '#1C1C1E'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={isMicActive ? '' : 'group-hover:stroke-white transition-colors'}
                  />
                </svg>
              </div>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="shrink-0 ml-2 hover:opacity-80 transition-opacity"
                aria-label="Translate"
              >
                <div className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-colors group ${
                  showLanguageSelector 
                    ? 'bg-black' 
                    : 'bg-white hover:bg-black'
                }`}>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 5H15M9 3V5M10.048 14.5C8.948 12.978 8.128 11.204 7.668 9.5M12.5 18H11.5M7.5 9.5H13.5M13.5 9.5C13.232 10.478 12.85 11.41 12.372 12.282M13.5 9.5H15.5M12.372 12.282C11.736 13.406 10.936 14.422 10.048 14.5M12.372 12.282L15 18M10.048 14.5L7.5 20.5M10.048 14.5C10.134 14.498 10.22 14.485 10.304 14.461M18 21L21.5 14.5L19.121 13.621M14.5 14.5L15.958 17.879M15.958 17.879L19.121 13.621M15.958 17.879L17.414 16.75"
                      stroke={showLanguageSelector ? '#FFFFFF' : '#1C1C1E'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={showLanguageSelector ? '' : 'group-hover:stroke-white transition-colors'}
                    />
                  </svg>
                </div>
              </button>
              
              {/* Language Selector Dropdown */}
              {showLanguageSelector && (
                <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}