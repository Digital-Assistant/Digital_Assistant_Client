import { useEffect, useRef, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import HomePageUser from "./components/HomePageUser";
import { PanelPositionProvider } from "./contexts/PanelPositionContext";

/**
 * DEBUG VERSION - Shadow DOM App
 * 
 * This is a debug version with extensive logging to help troubleshoot
 * Shadow DOM rendering issues.
 * 
 * To use this version:
 * 1. Temporarily rename your App.tsx to App.backup.tsx
 * 2. Rename this file to App.tsx
 * 3. Check the browser console for debug messages
 */

const USE_SHADOW_DOM = true; // Debug mode always uses Shadow DOM

function AppContent() {
  console.log("🎨 AppContent rendering");
  return (
    <PanelPositionProvider>
      <div style={{ background: 'red', padding: '20px', color: 'white' }}>
        <h1>DEBUG: If you see this with red background, React is rendering!</h1>
        <HomePageUser />
      </div>
    </PanelPositionProvider>
  );
}

function ShadowDOMApp() {
  const hostRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const reactRootRef = useRef<Root | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🚀 ShadowDOMApp useEffect triggered");
    console.log("hostRef.current:", hostRef.current);
    console.log("isInitialized:", isInitialized);

    if (!hostRef.current) {
      console.error("❌ hostRef.current is null!");
      return;
    }

    if (isInitialized) {
      console.log("✅ Already initialized, skipping");
      return;
    }

    try {
      console.log("📦 Creating Shadow Root...");
      
      // Create shadow root
      const shadowRoot = hostRef.current.attachShadow({ mode: "open" });
      shadowRootRef.current = shadowRoot;
      console.log("✅ Shadow Root created:", shadowRoot);

      // Add a simple test div first
      const testDiv = document.createElement("div");
      testDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: yellow;
        color: black;
        padding: 20px;
        border: 5px solid red;
        z-index: 999999;
        font-size: 20px;
        font-family: Arial, sans-serif;
      `;
      testDiv.textContent = "🎯 Shadow DOM Test - If you see this, Shadow DOM is working!";
      shadowRoot.appendChild(testDiv);
      console.log("✅ Test div added to Shadow DOM");

      // Collect styles
      setTimeout(() => {
        console.log("🎨 Collecting styles...");
        const styles: string[] = [];

        // Get all style tags
        const styleTags = document.querySelectorAll("style");
        console.log(`Found ${styleTags.length} style tags in document`);
        
        styleTags.forEach((styleTag, index) => {
          if (styleTag.textContent) {
            styles.push(styleTag.textContent);
            console.log(`  Style tag ${index + 1}: ${styleTag.textContent.length} characters`);
          }
        });

        // Get all link tags with stylesheets
        const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
        console.log(`Found ${linkTags.length} stylesheet links in document`);
        
        linkTags.forEach((link, index) => {
          const linkElement = link as HTMLLinkElement;
          const clonedLink = document.createElement("link");
          clonedLink.rel = "stylesheet";
          clonedLink.href = linkElement.href;
          shadowRoot.appendChild(clonedLink);
          console.log(`  Link ${index + 1}: ${linkElement.href}`);
        });

        // Try to get CSS from stylesheets
        try {
          const sheets = Array.from(document.styleSheets);
          console.log(`Found ${sheets.length} stylesheets in document`);
          
          sheets.forEach((sheet, index) => {
            try {
              if (sheet.cssRules) {
                const rules = Array.from(sheet.cssRules)
                  .map((rule) => rule.cssText)
                  .join("\n");
                styles.push(rules);
                console.log(`  Stylesheet ${index + 1}: ${rules.length} characters`);
              }
            } catch (e) {
              console.warn(`  Stylesheet ${index + 1}: Access denied (CORS)`, sheet.href);
            }
          });
        } catch (e) {
          console.warn("Could not access some stylesheets:", e);
        }

        const allStyles = styles.join("\n\n");
        console.log(`📝 Total collected CSS: ${allStyles.length} characters`);

        // Create and inject style element
        const styleElement = document.createElement("style");
        styleElement.textContent = allStyles;
        shadowRoot.insertBefore(styleElement, shadowRoot.firstChild);
        console.log("✅ Styles injected into Shadow DOM");

        // Remove test div
        testDiv.remove();
        console.log("🗑️ Test div removed");

        // Create React root container
        const appContainer = document.createElement("div");
        appContainer.id = "udan-shadow-root";
        appContainer.style.cssText = `
          width: 100%;
          height: 100%;
          pointer-events: auto;
          position: relative;
        `;
        shadowRoot.appendChild(appContainer);
        console.log("✅ App container created:", appContainer);

        // Render React app
        console.log("⚛️ Rendering React app...");
        reactRootRef.current = createRoot(appContainer);
        reactRootRef.current.render(<AppContent />);
        console.log("✅ React app rendered!");

        setIsInitialized(true);
      }, 200);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("❌ Failed to initialize Shadow DOM:", error);
      setError(errorMsg);
    }

    return () => {
      console.log("🧹 Cleanup triggered");
      if (reactRootRef.current) {
        try {
          reactRootRef.current.unmount();
          console.log("✅ React root unmounted");
        } catch (e) {
          console.error("❌ Error unmounting:", e);
        }
      }
    };
  }, [isInitialized]);

  console.log("🎨 ShadowDOMApp render");

  if (error) {
    return (
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "red",
        color: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "500px",
        zIndex: 999999,
      }}>
        <h2>❌ Shadow DOM Error</h2>
        <p>{error}</p>
        <p>Check the browser console for more details.</p>
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 999999,
      }}
    />
  );
}

export default function App() {
  console.log("🎯 App component rendering, USE_SHADOW_DOM:", USE_SHADOW_DOM);
  
  if (USE_SHADOW_DOM) {
    return <ShadowDOMApp />;
  }

  return <AppContent />;
}
