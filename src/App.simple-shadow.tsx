import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import HomePageUser from "./components/HomePageUser";
import { PanelPositionProvider } from "./contexts/PanelPositionContext";

/**
 * SIMPLE Shadow DOM Example
 * 
 * This is a minimal, working Shadow DOM implementation.
 * Use this to verify Shadow DOM works in your environment.
 * 
 * To test:
 * 1. Replace your App.tsx with this file's contents
 * 2. Reload the page
 * 3. Check browser console for "Shadow DOM initialized!"
 * 4. Inspect Elements to see #shadow-root
 */

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.error("Container ref is null");
      return;
    }

    console.log("🚀 Initializing Shadow DOM...");

    // Create Shadow Root
    let shadowRoot: ShadowRoot;
    try {
      shadowRoot = containerRef.current.attachShadow({ mode: "open" });
      console.log("✅ Shadow Root created:", shadowRoot);
    } catch (error) {
      console.error("❌ Failed to create Shadow Root:", error);
      return;
    }

    // Copy ALL styles from document to Shadow DOM
    const copyStyles = () => {
      console.log("📋 Copying styles to Shadow DOM...");
      
      // Method 1: Copy all <style> tags
      document.querySelectorAll("style").forEach((styleEl) => {
        const clonedStyle = styleEl.cloneNode(true) as HTMLStyleElement;
        shadowRoot.appendChild(clonedStyle);
      });
      
      // Method 2: Copy all <link rel="stylesheet"> tags
      document.querySelectorAll('link[rel="stylesheet"]').forEach((linkEl) => {
        const clonedLink = linkEl.cloneNode(true) as HTMLLinkElement;
        shadowRoot.appendChild(clonedLink);
      });
      
      console.log("✅ Styles copied");
    };

    // Wait for styles to load, then copy them
    setTimeout(() => {
      copyStyles();

      // Create app container inside Shadow DOM
      const appContainer = document.createElement("div");
      appContainer.id = "shadow-app-root";
      
      // IMPORTANT: Give it full height/width
      appContainer.style.cssText = `
        width: 100%;
        height: 100%;
        position: relative;
      `;
      
      shadowRoot.appendChild(appContainer);
      console.log("✅ App container created in Shadow DOM");

      // Render React app
      console.log("⚛️ Rendering React app in Shadow DOM...");
      const root = createRoot(appContainer);
      root.render(
        <PanelPositionProvider>
          <HomePageUser />
        </PanelPositionProvider>
      );
      console.log("✅ Shadow DOM initialized successfully!");

      // Cleanup
      return () => {
        console.log("🧹 Cleaning up Shadow DOM");
        root.unmount();
      };
    }, 300); // Wait 300ms for styles to load

  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 999999,
        pointerEvents: "none",
      }}
    >
      {/* Shadow DOM will be attached here */}
    </div>
  );
}
