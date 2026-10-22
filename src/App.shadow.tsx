import { useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PanelPositionProvider } from './contexts/PanelPositionContext';
import HomePageUser from './components/HomePageUser';

/**
 * Shadow DOM enabled App Component
 * 
 * This component renders the entire UDAN widget inside a Shadow DOM
 * to ensure complete CSS isolation from the host page.
 * 
 * Usage in host page:
 * <script src="udan-widget.js"></script>
 * <div id="udan-widget-root"></div>
 */

export default function AppWithShadowDOM() {
  const hostRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const reactRootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (!hostRef.current || shadowRootRef.current) return;

    // Create shadow root
    const shadowRoot = hostRef.current.attachShadow({ mode: 'open' });
    shadowRootRef.current = shadowRoot;

    // Get all stylesheets from the document
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } catch (e) {
          // Handle CORS issues with external stylesheets
          console.warn('Could not access stylesheet:', styleSheet.href);
          return '';
        }
      })
      .join('\n');

    // Create style element with all styles
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    shadowRoot.appendChild(styleElement);

    // Create app container
    const appContainer = document.createElement('div');
    appContainer.id = 'udan-shadow-root';
    appContainer.style.cssText = 'all: initial; display: block;';
    shadowRoot.appendChild(appContainer);

    // Render React app inside shadow DOM
    reactRootRef.current = createRoot(appContainer);
    reactRootRef.current.render(
      <PanelPositionProvider>
        <HomePageUser />
      </PanelPositionProvider>
    );

    // Cleanup
    return () => {
      if (reactRootRef.current) {
        reactRootRef.current.unmount();
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      style={{
        position: 'fixed',
        zIndex: 999999,
        pointerEvents: 'none',
      }}
    >
      {/* Shadow DOM will be attached here */}
    </div>
  );
}
