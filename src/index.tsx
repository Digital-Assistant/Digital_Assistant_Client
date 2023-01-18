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
const udanRoot = document.createElement("div"); // create root element

// app.id = "udan-react-root";
// app.classList.add('uda_exclude');
udanRoot.id = "udan-react-root"; // set id on react mount point
udanRoot.classList.add("uda_exclude"); // set class on react mount point

// custom udan tag
const customUdanTag = document.createElement("udan");

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

// check if html available or not then then push all the element inside html
if (html) {
    customUdanTag.appendChild(udanRoot);
    html.appendChild(customUdanTag);
}
