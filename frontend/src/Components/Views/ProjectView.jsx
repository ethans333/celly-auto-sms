import { useContext } from "react";
import Popup from "../Popup";
import RightClickMenu from "../UI/Menus/RightClickMenu";
import { WorkspaceContext } from "../../Contexts/Workspace.jsx";
import ProjectViewController from "../UI/Controllers/ProjectViewController.jsx";
import Tutorial from "../Popups/Tutorial.jsx";

export default function () {
  const { componentsStack, deltaX, deltaY, popup, scale, setPopup } =
    useContext(WorkspaceContext);

  return (
    <>
      <Tutorial />
      <ProjectViewController />
      <div
        style={{
          transform: `translate(${deltaX}px, ${deltaY}px) scale(${scale})`,
        }}
      >
        {componentsStack}
      </div>
      <RightClickMenu />
      {popup != null && <Popup onClose={() => setPopup(null)}>{popup}</Popup>}
    </>
  );
}
