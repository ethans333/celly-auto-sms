import { useEffect, useState } from "react";
import { Calendar } from "../Components/Cell/Cells/Calendar/Calendar";
import uuid from "react-uuid";
import { useRef, createContext } from "react";

export const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [deltaX, setDeltaX] = useState(0);
  const [deltaY, setDeltaY] = useState(0);
  const [popup, setPopup] = useState(null);
  const [sidebar, setSidebar] = useState(null);
  const [componentsStack, setComponentsStack] = useState([
    <Calendar key={uuid()} ref={useRef()} x={500} y={500} />,
    <Calendar key={uuid()} ref={useRef()} x={900} y={500} />,
  ]);
  const [workspaceMetaData, setWorkspaceMetaData] = useState({});
  const [currentNode, setCurrentNode] = useState(null);
  const [currentView, setCurrentView] = useState("project");
  const [workspaceList, setWorkspaceList] = useState([]);
  const [favoriteWorkspaceList, setFavoriteWorkspaceList] = useState([]);

  return (
    <WorkspaceContext.Provider
      value={{
        componentsStack,
        setComponentsStack,
        deltaX,
        setDeltaX,
        deltaY,
        setDeltaY,
        popup,
        setPopup,
        sidebar,
        setSidebar,
        workspaceMetaData,
        setWorkspaceMetaData,
        currentNode,
        setCurrentNode,
        currentView,
        setCurrentView,
        workspaceList,
        setWorkspaceList,
        favoriteWorkspaceList,
        setFavoriteWorkspaceList,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
