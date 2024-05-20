import { useEffect, useContext } from "react";
import { HelpersContext } from "../Contexts/Helpers.jsx";
import { WorkspaceContext } from "../Contexts/Workspace.jsx";

// Components
import LeftSideBar from "../Components/UI/Sidebars/LeftSideBar.jsx";
import RightSideBar from "../Components/UI/Sidebars/RightSideBar.jsx";
import ViewRenderer from "../Components/Views/ViewRenderer.jsx";

export default function () {
  const { sidebar, workspaceMetaData, componentsStack } =
    useContext(WorkspaceContext);
  const { parseCode, validateToken, loadWorkspace, updateWorkspaceLists } =
    useContext(HelpersContext);

  useEffect(() => {
    parseCode();
    validateToken();
    updateWorkspaceLists();
  }, []);

  useEffect(() => {
    loadWorkspace();
  }, [workspaceMetaData.id]);

  useEffect(() => {
    console.log(componentsStack);
  }, [componentsStack]);

  return (
    <div>
      <LeftSideBar />
      <RightSideBar>{sidebar}</RightSideBar>
      <ViewRenderer />
    </div>
  );
}
