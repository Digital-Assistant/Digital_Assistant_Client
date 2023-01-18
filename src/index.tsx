/**
 * React app bootstrap & Page Injection
 */
import React from "react";
import ReactDOM from "react-dom";

import { createRoot } from "react-dom/client";

import "./util/i18n";


/*
const body = document.querySelector("body");

const app = document.createElement("udan");

app.id = "udan-react-root";
app.classList.add('uda_exclude');

if (body) {
    body.appendChild(app);
}

const container = document.getElementById("udan-react-root");

const root = createRoot(container!);

root.render(<App />);*/

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
shadowHost.attachShadow({ mode: 'open' });

import App from "./App";

// adding react application into shadow dom

// Get the shadow root
const shadowRoot = document.getElementById('udan-react-root').shadowRoot;

// Create div element for react to render into
const reactDiv = document.createElement('div');
reactDiv.setAttribute('id', 'udan-react-app-root');

// Append react root to shadow root
shadowRoot.appendChild(reactDiv);

const reactRoot = createRoot(shadowRoot);
reactRoot.render(<App />);
