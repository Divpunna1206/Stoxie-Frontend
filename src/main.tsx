
//  import React from "react";
//  import { createRoot } from "react-dom/client";
//   import App from "./App.tsx";
//   import "./index.css";

//   createRoot(document.getElementById("root")!).render(<App/>);
  
// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupAuthInterceptors } from "./api/authInterceptor";

setupAuthInterceptors();

const container = document.getElementById("root") as HTMLElement;

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
