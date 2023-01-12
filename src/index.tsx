/**
 * React app bootstrap & Page Injection
 */
import React from "react";
import { createRoot } from "react-dom/client";

import "./util/i18n";
import App from "./App";


// define custom tag constructor
class CustomTag extends HTMLElement {
    constructor() {
        super();
        // attach shadow
        this.attachShadow({ mode: "open" });
        const div = document.createElement("div");
        div.id = "udan-react-root";
        div.classList.add("uda_exclude");
        this.shadowRoot.appendChild(div);
        const reactRoot = createRoot(div);
        reactRoot.render(<App />)
    }
}

// define custom tag
customElements.define("udan-shadow", CustomTag);

// get html
const htmlTag = document.querySelector("html");

// create udan custom container and push udan shadow
const udanContainer = document.createElement("udan-container");
const udanShadow = document.createElement("udan-shadow");

// push custom tag serially udan-shadow > udan-container > html-tag
udanContainer.appendChild(udanShadow);

// check if html available
if (htmlTag) {
    htmlTag.appendChild(udanContainer);
}

