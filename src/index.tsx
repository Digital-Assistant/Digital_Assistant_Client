/**
 * React app bootstrap & Page Injection
 */
import React from "react";
import { createRoot } from "react-dom/client";

import "./util/i18n";
import App from "./App";

// get html
const htmlTag = document.querySelector("html");

// create udan custom container and push udan shadow
const udanContainer = document.createElement("udan");
// react mounter
const rootDiv = document.createElement("div");
rootDiv.id = "udan-react-root";
rootDiv.classList.add("uda_exclude");
const rootShadow = rootDiv.attachShadow({ mode: "open" });
udanContainer.appendChild(rootDiv);

// render react
const reactRoot = createRoot(rootShadow);
reactRoot.render(<App />);

// check if html available
if (htmlTag) {
    htmlTag.appendChild(udanContainer);
}

// const div = document.createElement("div");
// div.id = "udan-react-root";
// div.classList.add("uda_exclude");
// const reactRoot = createRoot(div);
// reactRoot.render(<App />);

// push custom tag serially udan-shadow > udan-container > html-tag
// udanContainer.appendChild(udanShadow);
