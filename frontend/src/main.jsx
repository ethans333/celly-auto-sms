import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../authConfig.jsx";

import "./index.css";

// Pages
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";
import ConfirmCode from "./Pages/Auth/ConfirmCode.jsx";
import Scheduling from "./Pages/Scheduling.jsx";

const msalInstance = new PublicClientApplication(msalConfig);

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/confirm-code", element: <ConfirmCode /> },
  { path: "/scheduling/:id", element: <Scheduling /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <MsalProvider instance={msalInstance}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </MsalProvider>
);
