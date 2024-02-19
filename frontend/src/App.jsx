import TextingCell from "./Components/Cell/Cells/TextingCell.jsx";
import CalendarCell from "./Components/Cell/Cells/CalendarCell.jsx";
import { useState, createContext } from "react";
import data from "./assets/cells.json";
import Curves from "./Components/Curves/Curves.jsx";
import RightClickMenu from "./Components/RightClickMenu.jsx";
import SideBarContainer from "./Components/Cell/SideBarContainer.jsx";
import CellSelection from "./Components/Cell/CellSelection.jsx";

export const WorkspaceContext = createContext();

export default function App() {
  const [workspace, setWorkspace] = useState(data);
  const [sideBarChildren, setSideBarChildren] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        currentNode,
        setCurrentNode,
        setWorkspace,
        setSideBarChildren,
      }}
    >
      {Object.keys(workspace).map((id) => buildCell(id, workspace[id]))}
      <SideBarContainer children={sideBarChildren} />
      <Curves />
      <RightClickMenu />
    </WorkspaceContext.Provider>
  );
}

function buildCell(id, cell) {
  switch (cell.type) {
    case "texting":
      return <TextingCell key={id} id={id} />;
    case "calendar":
      return <CalendarCell key={id} id={id} />;
    default:
      return <></>;
  }
}
