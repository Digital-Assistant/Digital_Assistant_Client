import { Header } from "./Header";
import { Footer } from "./Footer";
import { usePanelPosition } from "../contexts/PanelPositionContext";
import { FloatingButton } from "./FloatingButton";
import { useRef, useEffect } from "react";
import { on, off } from "@udan/digital-assistant-sdk";

interface LayoutProps {
  children: React.ReactNode;
  onRecClick?: () => void;
  showSearchBar?: boolean;
  searchKeyword?: string;
  onSearchChange?: (display: string, query: string) => void;
  config?: any;
  minimizeForRecording?: boolean;
  onFloatingButtonClick?: () => void;
}

export function Layout({
  children,
  onRecClick,
  showSearchBar = true,
  searchKeyword,
  onSearchChange,
  config,
  minimizeForRecording = false,
  onFloatingButtonClick,
}: LayoutProps) {
  const { position, coordinates, setCoordinates, isDragging, setIsDragging, isPanelVisible, openPanel, closePanel, panelHeight } = usePanelPosition();
  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the header area
    const target = e.target as HTMLElement;
    const isHeaderArea = target.closest('.drag-handle');

    if (!isHeaderArea) return;

    setIsDragging(true);

    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Wire udaDivId element to open the panel when enableUdaIcon is false
  useEffect(() => {
    if (!config?.enableUdaIcon && config?.udaDivId) {
      const udaNode = document.getElementById(config.udaDivId);
      if (udaNode) {
        udaNode.classList.add('uda_exclude');
        const handler = () => openPanel();
        udaNode.addEventListener('click', handler);
        return () => udaNode.removeEventListener('click', handler);
      }
    }
  }, [config?.enableUdaIcon, config?.udaDivId]);

  useEffect(() => {
    on("openPanel", openPanel);
    on("closePanel", closePanel);
    return () => {
      off("openPanel", openPanel);
      off("closePanel", closePanel);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !panelRef.current) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = panelRef.current.offsetWidth;
      const panelHeight = panelRef.current.offsetHeight;

      // Calculate new position
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      // Constrain to viewport bounds
      newX = Math.max(0, Math.min(newX, viewportWidth - panelWidth));
      newY = Math.max(0, Math.min(newY, viewportHeight - panelHeight));

      setCoordinates({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setCoordinates, setIsDragging]);

  // Calculate position style
  const getPositionStyle = () => {
    // Determine max height based on panelHeight setting
    const maxHeightValue = panelHeight === 'full' ? '95vh' : '50vh';

    // If coordinates are set (dragged), use them
    if (coordinates.x !== 0 || coordinates.y !== 0) {
      return {
        position: 'fixed' as const,
        left: `${coordinates.x}px`,
        top: `${coordinates.y}px`,
        right: 'auto',
        bottom: 'auto',
        maxWidth: '480px',
        width: '480px',
        maxHeight: maxHeightValue,
      };
    }

    // Otherwise use the position prop (left/right)
    return {
      position: 'fixed' as const,
      bottom: '20px',
      [position]: '20px',
      maxWidth: '480px',
      width: 'calc(100% - 40px)',
      maxHeight: maxHeightValue,
    };
  };

  return (
    <div className="bg-[#f6f6f6] min-h-screen flex items-center p-4">
      {/* Floating Button — shown when:
           1. Panel is hidden and enableUdaIcon is true (or not set), OR
           2. Panel is minimized during recording (always show so user can reopen) */}
      {((!isPanelVisible && config?.enableUdaIcon !== false) || minimizeForRecording) && (
        <FloatingButton
          customIcon={config?.enableCustomIcon ? config?.customIcon : undefined}
          onOpen={onFloatingButtonClick}
        />
      )}

      {/* Widget Container — hidden when minimized during recording */}
      {isPanelVisible && !minimizeForRecording && (
        <div
          ref={panelRef}
          onMouseDown={handleMouseDown}
          className="bg-[#f6f6f6] border-2 border-[#d9d9d9] rounded-2xl shadow-2xl flex flex-col transition-all duration-300"
          style={{
            ...getPositionStyle(),
            cursor: isDragging ? 'grabbing' : 'default',
            overflow: 'hidden', // Changed from auto to hidden
            zIndex: 2147483647,
          }}
        >
          {/* Header - Fixed at top */}
          <div className="flex-shrink-0 px-3 pt-4">
            <Header
              onRecClick={onRecClick}
              showSearchBar={showSearchBar}
              searchKeyword={searchKeyword}
              onSearchChange={onSearchChange}
              config={config}
            />
          </div>

          {/* Main Content - Scrollable */}
          <main className="flex-1 w-full flex flex-col px-3 pb-16 overflow-y-auto overflow-x-visible">
            {children}
          </main>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 px-3 pb-4">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}