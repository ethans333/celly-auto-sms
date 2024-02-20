import TextingCell from "./Components/Cell/Cells/TextingCell.jsx";
import CalendarCell from "./Components/Cell/Cells/CalendarCell.jsx";
import { useState, createContext } from "react";
import data from "./assets/cells.json";
import Curves from "./Components/Curves/Curves.jsx";
import RightClickMenu from "./Components/RightClickMenu.jsx";
import SideBarContainer from "./Components/Cell/SideBarContainer.jsx";
import CellSelection from "./Components/Cell/CellSelection.jsx";
import LeftSideBar from "./Components/LeftSideBar.jsx";
import RegisteredNumbers from "./Components/Views/RegisteredNumbers.jsx";

export const WorkspaceContext = createContext();

export default function App() {
  const [workspace, setWorkspace] = useState(data);
  const [sideBarChildren, setSideBarChildren] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [currentView, setCurrentView] = useState("numbers");

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        currentNode,
        currentView,
        setCurrentNode,
        setWorkspace,
        setSideBarChildren,
        setCurrentView,
      }}
    >
      <LeftSideBar />
      {renderViews(currentView)}
    </WorkspaceContext.Provider>
  );

  function renderViews(type) {
    switch (type) {
      case "cells":
        return (
          <>
            {Object.keys(workspace).map((id) => buildCell(id, workspace[id]))}
            <SideBarContainer children={sideBarChildren} />
            <Curves />
            <RightClickMenu />
          </>
        );
      case "numbers":
        return <RegisteredNumbers />;
      case "analytics":
        return <></>;
      default:
        return <></>;
    }
  }
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
