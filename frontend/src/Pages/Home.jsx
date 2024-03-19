import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Helpers
import * as jose from "jose";
import Cookies from "js-cookie";
import * as api from "../api.jsx";

// Components
import LeftSideBar from "../Components/LeftSideBar.jsx";
import RightSideBar from "../Components/RightSideBar.jsx";

// Views
import RegisteredNumbers from "../Components/Views/RegisteredNumbers.jsx";
import ProjectView from "../Components/Views/ProjectView.jsx";
import Analytics from "../Components/Views/Analytics.jsx";

export const WorkspaceContext = createContext();

export default function () {
  const [workspace, setWorkspace] = useState({});
  const [workspaceMetaData, setWorkspaceMetaData] = useState({});
  const [sideBarChildren, setSideBarChildren] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [currentView, setCurrentView] = useState("project");
  const [popupChildren, setPopupChildren] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    parseToken();
    validateToken();

    // api
    //   .getWorkspace("cbb8f7ca-e4a3-45ea-9a22-00e40769a609")
    //   .then(async (res) => {
    //     if (res.status === 200) {
    //       const json = await res.json();
    //       setWorkspace(JSON.parse(json.workspace_raw));
    //       delete json.workspace_raw;
    //       setWorkspaceMetaData(json);
    //       console.log(json);
    //     } else {
    //       console.log(res);
    //     }
    //   });
  }, []);

  useEffect(() => {
    api.getWorkspace(workspaceMetaData.id).then(async (res) => {
      if (res.status === 200) {
        const json = await res.json();
        setWorkspace(JSON.parse(json.workspace_raw));
        delete json.workspace_raw;
        console.log(json);
      } else {
        console.log(res);
      }
    });
  }, [workspaceMetaData]);

  useEffect(() => {
    // Force re-render of project view when...
    setCurrentView("project");
  }, [popupChildren]); // these variables change

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        workspaceMetaData,
        currentNode,
        currentView,
        popupChildren,
        setCurrentNode,
        setWorkspace,
        setSideBarChildren,
        setCurrentView,
        setWorkspaceMetaData,
        setPopupChildren,
      }}
    >
      <LeftSideBar />
      <RightSideBar children={sideBarChildren} />
      {renderViews(currentView)}
    </WorkspaceContext.Provider>
  );

  function renderViews(type) {
    // Different views to render, shown based on the currentView state set in the left side bar.
    switch (type) {
      case "project":
        return <ProjectView />;
      case "numbers":
        return <RegisteredNumbers />;
      case "analytics":
        return <Analytics />;
      default:
        return <></>;
    }
  }

  function parseToken() {
    // If available, parse the token from the URL and set it as a cookie
    let url = new URL(window.location.href);
    let hash = url.hash.substring(1); // remove the #
    let params = new URLSearchParams(hash);

    if (params.size === 0) return;

    Cookies.set("access_token", params.get("access_token"), {
      expires: parseInt(params.get("expires_in")),
    });
  }

  function validateToken() {
    // Check if token is expired or does not exist
    const token = Cookies.get("access_token");

    if (!token) {
      // Token does not exist
      navigate("/login");
      return;
    } else {
      // Token is expired
      const claims = jose.decodeJwt(token);
      if (Date.now() > claims.exp * 1000) {
        Cookies.remove("access_token");
        navigate("/login");
      }
    }
  }
}
