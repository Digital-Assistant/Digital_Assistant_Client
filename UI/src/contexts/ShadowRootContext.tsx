import React, { createContext, useContext, ReactNode } from 'react';

/**
 * Shadow Root Context
 * 
 * Provides access to the Shadow Root throughout the app.
 * Used for portal components (dialogs, popovers, tooltips) to render
 * inside the Shadow DOM instead of document.body
 */

interface ShadowRootContextValue {
  shadowRoot: ShadowRoot | null;
  getContainer: () => HTMLElement;
}

const ShadowRootContext = createContext<ShadowRootContextValue>({
  shadowRoot: null,
  getContainer: () => document.body,
});

export const useShadowRoot = () => useContext(ShadowRootContext);

interface ShadowRootProviderProps {
  shadowRoot: ShadowRoot | null;
  children: ReactNode;
}

export function ShadowRootProvider({ shadowRoot, children }: ShadowRootProviderProps) {
  const getContainer = () => {
    if (shadowRoot) {
      // Return the React app root inside shadow DOM
      const container = shadowRoot.getElementById('udan-react-app-root');
      return container || document.body;
    }
    return document.body;
  };

  return (
    <ShadowRootContext.Provider value={{ shadowRoot, getContainer }}>
      {children}
    </ShadowRootContext.Provider>
  );
}
