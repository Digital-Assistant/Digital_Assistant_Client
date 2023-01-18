/**
 * React app bootstrap & Page Injection
 */
import React from "react";
import { createRoot } from "react-dom/client";

import "./util/i18n";
import App from "./App";

// const body = document.querySelector("body");
const html = document.querySelector("html"); // render element inside the html

// const app = document.createElement("div");
const udanRoot = document.createElement("div");

// app.id = "udan-react-root";
// app.classList.add('uda_exclude');
udanRoot.id = "udan-react-root";
udanRoot.classList.add("uda_exclude");

// custom udan tag
const customUdanTag = document.createElement("udan");

// if (body) {
//   body.appendChild(app);
// }
if (html) {
    customUdanTag.appendChild(udanRoot);
    html.appendChild(customUdanTag);
}

// enable shadow
const udanRootShadow = udanRoot.attachShadow({ mode: "open" });

// attached style
const style = document.querySelector("#udan-style");
udanRootShadow.appendChild(style);

// const container = document.getElementById("udan-react-root");
// const root = createRoot(container!);
// create root
const reactRoot = createRoot(udanRootShadow);

// root.render(<App />);
reactRoot.render(<App />);
