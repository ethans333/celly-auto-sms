import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../authConfig.jsx";

import "./index.css";

// Pages
import App from "./Pages/App.jsx";
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";
import ConfirmCode from "./Pages/Auth/ConfirmCode.jsx";
import Scheduling from "./Pages/Scheduling.jsx";
import CancelMeeting from "./Pages/CancelMeeting.jsx";
import ConfirmMeeting from "./Pages/ConfirmMeeting.jsx";

// Contexts
import { HelpersProvider } from "./Contexts/Helpers.jsx";
import { WorkspaceProvider } from "./Contexts/Workspace.jsx";

const msalInstance = new PublicClientApplication(msalConfig);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <WorkspaceProvider>
        <HelpersProvider>
          <App />
        </HelpersProvider>
      </WorkspaceProvider>
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/confirm-code", element: <ConfirmCode /> },
  { path: "/scheduling/:user_id/:id", element: <Scheduling /> },
  { path: "/cancel-meeting/:id", element: <CancelMeeting /> },
  { path: "/confirm-meeting/:id/:token", element: <ConfirmMeeting /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <MsalProvider instance={msalInstance}>
    <RouterProvider router={router} />
  </MsalProvider>
);
