import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const rootEl = document.getElementById("root");
if(rootEl) {
    const root = createRoot(rootEl);
    root.render(
        <StrictMode>
            <App/>
        </StrictMode>
    );
}
