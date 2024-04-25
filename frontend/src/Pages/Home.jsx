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
  const [popupChildren, setPopupChildren] = useState();
  const [messageStack, setMessageStack] = useState([]);
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
        messageStack,
        config,
        dx,
        dy,
        lastMousePosition,
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
    api
      .updateWorkspace(
        override.id || workspaceMetaData.id,
        override.workspace_name || workspaceMetaData.workspace_name,
        override.workspace_description ||
          workspaceMetaData.workspace_description,
        override.workspace || workspace,
        override.is_favorite || workspaceMetaData.is_favorite,
        override.workspace_emoji || workspaceMetaData.workspace_emoji,
        override.is_deployed || workspaceMetaData.is_deployed
      )
      .then(async (res) => {
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
}
