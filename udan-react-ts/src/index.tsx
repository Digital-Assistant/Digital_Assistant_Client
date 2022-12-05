/**
 * React app bootstrap & Page Injection
 */
import React from "react";
import { createRoot } from "react-dom/client";

import "./util/i18n";
import App from "./App";

const body = document.querySelector("body");

const app = document.createElement("div");

app.id = "udan-react-root";
app.classList.add('uda_exclude');

if (body) {
  body.appendChild(app);
}

const container = document.getElementById("udan-react-root");
const root = createRoot(container!);

root.render(<App />);
