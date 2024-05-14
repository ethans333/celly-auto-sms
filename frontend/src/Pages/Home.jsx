import { useState, createContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Helpers
import * as jose from "jose";
import Cookies from "js-cookie";
import * as api from "../api.jsx";

// Components
import LeftSideBar from "../Components/UI/Sidebars/LeftSideBar.jsx";
import RightSideBar from "../Components/UI/Sidebars/RightSideBar.jsx";

// Views
import RegisteredNumbers from "../Components/Views/RegisteredNumbers.jsx";
import ProjectView from "../Components/Views/ProjectView.jsx";
import Analytics from "../Components/Views/Analytics.jsx";

import { Calendar } from "../Components/Cell/Cells/Calendar/Calendar.jsx";
import uuid from "react-uuid";

export const WorkspaceContext = createContext();

export default function () {
  const [workspace, setWorkspace] = useState({});
  const [workspaceMetaData, setWorkspaceMetaData] = useState({});
  const [sideBarChildren, setSideBarChildren] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [currentView, setCurrentView] = useState("project");
  const [popupChildren, setPopupChildren] = useState();
  const [messageStack, setMessageStack] = useState([]);
  const [workspaceList, setWorkspaceList] = useState([]);
  const [favoriteWorkspaceList, setFavoriteWorkspaceList] = useState([]);

  const [componentsStack, setComponentsStack] = useState([
    <Calendar key={uuid()} ref={useRef()} x={500} y={500} />,
    <Calendar key={uuid()} ref={useRef()} x={900} y={500} />,
  ]);

  const [config, setConfig] = useState({
    placeholder_1: true,
    placeholder_2: false,
    auto_save: true,
  });

  const [dx, setDX] = useState(0);
  const [dy, setDY] = useState(0);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    parseCode();
    validateToken();
  }, []);

  useEffect(() => {
    api.getWorkspace(workspaceMetaData.id).then(async (res) => {
      if (res.status === 200) {
        const json = await res.json();
        console.log(json);
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

  useEffect(() => {
    if (workspaceList.length > 0 && Object.keys(workspaceMetaData).length == 0)
      setWorkspaceMetaData(workspaceList[0]);
  }, [workspaceList]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        workspaceMetaData,
        currentNode,
        currentView,
        popupChildren,
        messageStack,
        config,
        dx,
        dy,
        lastMousePosition,
        workspaceList,
        favoriteWorkspaceList,
        componentsStack,
        setCurrentNode,
        setWorkspace,
        setSideBarChildren,
        setCurrentView,
        setWorkspaceMetaData,
        setPopupChildren,
        saveWorkspace,
        setMessageStack,
        setConfig,
        setDX,
        setDY,
        setLastMousePosition,
        updateWorkspaceLists,
        setComponentsStack,
        pushToComponentsStack,
      }}
    >
      <LeftSideBar />
      <RightSideBar>{sideBarChildren}</RightSideBar>

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

  function parseCode() {
    // If available, parse the token from the URL and set it as a cookie
    let url = new URL(window.location.href);
    let params = url.searchParams;

    if (params.size === 0) return;

    api.storeMicrosoftTokenESL(params.get("code")).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          console.log(data);
        });
      } else {
        console.error(res);
      }
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

  /**
   * Save workspace to database
   * @param {object} override - Override what gets passed as an updated value to the server. Useful for when calling saveWorkspace directly after setting to workspaceMetaData.
   * @returns {Promise<void>} - Promise that resolves when the workspace is saved.
   */
  function saveWorkspace(override) {
    let metadata;

    if (override && !(override.constructor.name === "SyntheticBaseEvent")) {
      metadata = override;
    } else {
      metadata = workspaceMetaData;
    }

    if (!metadata.id) {
      console.log("No workspace selected.");
      return;
    }

    if (workspace === undefined || workspace === null || workspace === "") {
      alert("Workspace is undefined");
    }

    api.updateWorkspace(metadata, workspace).then(async (res) => {
      if (res.status === 200) {
        const json = await res.json();
        setMessageStack((p) => [
          { message: json.message, type: "success" },
          ...p,
        ]);

        setTimeout(() => {
          setMessageStack((p) => {
            p.pop();
            return [...p];
          });
        }, 3000);
        console.log(json);

        updateWorkspaceLists();
      } else {
        setMessageStack((p) => [{ message: res, type: "error" }, ...p]);

        setTimeout(() => {
          setMessageStack((p) => {
            p.pop();
            return [...p];
          });
        }, 3000);
        console.log(res);
      }
    });
  }

  function updateWorkspaceLists() {
    api.getAllUserWorkspaces().then(async (res) => {
      if (res.status === 200) {
        const json = await res.json();
        console.log(json);
        setWorkspaceList(json.workspaces);
        setFavoriteWorkspaceList(
          json.workspaces.filter((ws) => ws.is_favorite)
        );
      } else {
        console.log(res);
      }
    });
  }

  function pushToComponentsStack(component) {
    setComponentsStack((p) => [...p, component]);
  }
}
