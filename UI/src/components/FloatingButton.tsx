import { usePanelPosition } from "../contexts/PanelPositionContext";
import { useRef, useEffect, useState } from "react";

export function FloatingButton() {
  const { setIsPanelVisible, floatingIconPosition, setFloatingIconPosition } = usePanelPosition();
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    
    const button = buttonRef.current;
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !buttonRef.current) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const buttonWidth = buttonRef.current.offsetWidth;
      const buttonHeight = buttonRef.current.offsetHeight;

      // Calculate new position
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      // Constrain to viewport bounds
      newX = Math.max(0, Math.min(newX, viewportWidth - buttonWidth));
      newY = Math.max(0, Math.min(newY, viewportHeight - buttonHeight));

      setFloatingIconPosition({ x: newX, y: newY });
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
  }, [isDragging, setFloatingIconPosition]);

  const handleClick = (e: React.MouseEvent) => {
    // Only open panel if not dragging
    if (!isDragging) {
      setIsPanelVisible(true);
    }
  };

  // Calculate position style
  const getPositionStyle = () => {
    // If custom position is set (dragged), use it
    if (floatingIconPosition.x !== 0 || floatingIconPosition.y !== 0) {
      return {
        position: 'fixed' as const,
        left: `${floatingIconPosition.x}px`,
        top: `${floatingIconPosition.y}px`,
        right: 'auto',
        bottom: 'auto',
      };
    }
    
    // Default to bottom-right corner
    return {
      position: 'fixed' as const,
      bottom: '20px',
      right: '20px',
    };
  };

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className="bg-white border-2 border-[#d9d9d9] rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 z-50"
      style={{
        ...getPositionStyle(),
        cursor: isDragging ? 'grabbing' : 'grab',
        width: '64px',
        height: '64px',
      }}
      aria-label="Open UDAN panel"
      title="Click to open UDAN | Drag to move"
    >
      <div className="flex flex-col items-center justify-center gap-1">
        {/* UDAN Logo Text */}
        <span className="font-['Raleway',sans-serif] font-bold text-[16px] text-black leading-none">
          UDAN
        </span>
        {/* Beta Badge */}
        <span className="bg-[#cccccc] text-[#1e1e1e] text-[6px] font-['Raleway',sans-serif] px-1 rounded h-[10px] flex items-center leading-none">
          Beta
        </span>
      </div>
    </button>
  );
}
