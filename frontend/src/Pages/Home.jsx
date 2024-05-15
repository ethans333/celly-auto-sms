import { useState, useEffect, useContext } from "react";
import { HelpersContext } from "../Contexts/Helpers.jsx";
import { WorkspaceContext } from "../Contexts/Workspace.jsx";

// Helpers
import * as api from "../api.jsx";

// Components
import LeftSideBar from "../Components/UI/Sidebars/LeftSideBar.jsx";
import RightSideBar from "../Components/UI/Sidebars/RightSideBar.jsx";

// Views
import RegisteredNumbers from "../Components/Views/RegisteredNumbers.jsx";
import ProjectView from "../Components/Views/ProjectView.jsx";
import Analytics from "../Components/Views/Analytics.jsx";

export default function () {
  const {
    popup,
    workspaceMetaData,
    setWorkspaceMetaData,
    workspaceList,
    currentView,
    setCurrentView,
    sidebar,
  } = useContext(WorkspaceContext);
  const { parseCode, validateToken } = useContext(HelpersContext);

  const [config, setConfig] = useState({
    placeholder_1: true,
    placeholder_2: false,
    auto_save: true,
  });

  useEffect(() => {
    parseCode();
    validateToken();
  }, []);

  // useEffect(() => {
  //   api.getWorkspace(workspaceMetaData.id).then(async (res) => {
  //     if (res.status === 200) {
  //       const json = await res.json();
  //       console.log(json);
  //       setWorkspace(JSON.parse(json.workspace_raw));
  //       delete json.workspace_raw;
  //       console.log(json);
  //     } else {
  //       console.log(res);
  //     }
  //   });
  // }, [workspaceMetaData]);

  useEffect(() => {
    // Force re-render of project view when...
    setCurrentView("project");
  }, [popup]); // these variables change

  useEffect(() => {
    if (workspaceList.length > 0 && Object.keys(workspaceMetaData).length == 0)
      setWorkspaceMetaData(workspaceList[0]);
  }, [workspaceList]);

  return (
    <div>
      <LeftSideBar />
      <RightSideBar>{sidebar}</RightSideBar>
      {renderViews(currentView)}
    </div>
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
}
