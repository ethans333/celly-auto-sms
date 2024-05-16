import { useState, useEffect, useContext } from "react";
import { HelpersContext } from "../Contexts/Helpers.jsx";
import { WorkspaceContext } from "../Contexts/Workspace.jsx";

// Components
import LeftSideBar from "../Components/UI/Sidebars/LeftSideBar.jsx";
import RightSideBar from "../Components/UI/Sidebars/RightSideBar.jsx";
import ViewRenderer from "../Components/Views/ViewRenderer.jsx";

export default function () {
  const { workspaceMetaData, setWorkspaceMetaData, workspaceList, sidebar } =
    useContext(WorkspaceContext);
  const { parseCode, validateToken } = useContext(HelpersContext);

  useEffect(() => {
    parseCode();
    validateToken();
  }, []);

  useEffect(() => {
    if (workspaceList.length > 0 && Object.keys(workspaceMetaData).length == 0)
      setWorkspaceMetaData(workspaceList[0]);
  }, [workspaceList]);

  return (
    <div>
      <LeftSideBar />
      <RightSideBar>{sidebar}</RightSideBar>
      <ViewRenderer />
    </div>
  );
}
