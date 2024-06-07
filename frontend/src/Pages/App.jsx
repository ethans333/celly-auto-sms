import { useEffect, useContext } from "react";
import { HelpersContext } from "../Contexts/Helpers.jsx";
import { WorkspaceContext } from "../Contexts/Workspace.jsx";

// Components
import LeftSideBar from "../Components/UI/Sidebars/LeftSideBar.jsx";
import RightSideBar from "../Components/UI/Sidebars/RightSideBar.jsx";
import ViewRenderer from "../Components/Views/ViewRenderer.jsx";

// Hooks
import useLoadWorkspace from "../Components/Cell/Cells/useLoadWorkspace.jsx";

export default function () {
  const {
    sidebar,
    workspaceMetaData,
    setComponentsStack,
    componentsStack,
    setDeltaX,
    setDeltaY,
    currentView,
  } = useContext(WorkspaceContext);
  const { parseCode, validateToken, updateWorkspaceLists } =
    useContext(HelpersContext);

  const { cells, curves } = useLoadWorkspace();

  useEffect(() => {
    parseCode();
    validateToken();
    updateWorkspaceLists();
  }, []);

  // Load Workspace
  useEffect(() => {
    setComponentsStack([...cells, ...curves]);
    setDeltaX(parseInt(workspaceMetaData.delta_x));
    setDeltaY(parseInt(workspaceMetaData.delta_y));
  }, [workspaceMetaData.id, cells, curves]);

  return (
    <div>
      <LeftSideBar />
      <RightSideBar>{sidebar}</RightSideBar>
      <ViewRenderer />
    </div>
  );
}
