/**
 * React app bootstrap & Page Injection
 */
import React from "react";
import { createRoot } from "react-dom/client";

import "./util/i18n";
import App from "./App";
import ReactDOM from "react-dom";

// const body = document.querySelector("body");

// const app = document.createElement("div");

// app.id = "udan-react-root";
// app.classList.add('uda_exclude');

// if (body) {
//   body.appendChild(app);
// }

// const container = document.getElementById("udan-react-root");
// const root = createRoot(container!);

// root.render(<App />);

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
        // ReactDOM.render(<App />, div)
        const reactRoot = createRoot(div);
        reactRoot.render(<App />)
    }

    // getRoot() {
    //     return this.shadowRoot.querySelector("#udan-react-root");
    // }
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

// render in react

// const rootObj = new CustomTag();
// const rootTag = rootObj.getRoot();

// console.log(document.querySelector('div'));
// console.log('custom tag', rootTag);

// const reactRoot = createRoot(rootTag);
// reactRoot.render(<App />)

// root.render(<App />);
