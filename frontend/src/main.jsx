import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../authConfig.jsx";

import "./index.css";

// Pages
import App from "./App.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";

const msalInstance = new PublicClientApplication(msalConfig);

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <MsalProvider instance={msalInstance}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </MsalProvider>
);
