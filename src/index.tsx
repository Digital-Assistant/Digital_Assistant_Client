/**
 * React app bootstrap & Page Injection
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux";

import "./util/i18n";
import App from "./App";
import { ConfigProvider } from "antd";

/**
 * creating shadow root element for UDAN plugin
 */

const htmlTag = document.querySelector("html");

// create udan custom container and push udan shadow
const udanContainer = document.createElement("udan");

// react mounter
const rootDiv = document.createElement("div");
rootDiv.id = "udan-react-root";
rootDiv.classList.add("uda_exclude");

// const rootShadow = rootDiv.attachShadow({ mode: "open" });
udanContainer.appendChild(rootDiv);

// check if html available
if (htmlTag) {
  htmlTag.appendChild(udanContainer);
}

// attach shadow to the container
export const shadowHost = document.getElementById('udan-react-root');
shadowHost.attachShadow({mode: 'open'});

// adding react application into shadow dom

// Get the shadow root
const shadowRoot = document.getElementById('udan-react-root').shadowRoot;

// Create div element for react to render into
const reactDiv = document.createElement('div');
reactDiv.setAttribute('id', 'udan-react-app-root');

// Append react root to shadow root
shadowRoot.appendChild(reactDiv);

const reactRoot = createRoot(shadowRoot);
reactRoot.render(
    <Provider store={store}>
      <ConfigProvider getPopupContainer={(node: any) => {
        if (node) {
          return node.parentNode;
        }
        return shadowRoot;
      }}>
        <App />
      </ConfigProvider>
    </Provider>
);
