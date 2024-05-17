import { Calendar } from "../Components/Cell/Cells/Calendar/Calendar";
import uuid from "react-uuid";
import { useState, useRef, createContext } from "react";

export const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [scale, setScale] = useState(1);
  const [deltaX, setDeltaX] = useState(0);
  const [deltaY, setDeltaY] = useState(0);
  const [popup, setPopup] = useState(null);
  const [sidebar, setSidebar] = useState(null);
  const [componentsStack, setComponentsStack] = useState([]);
  const [workspaceMetaData, setWorkspaceMetaData] = useState({});
  const [currentNode, setCurrentNode] = useState(null);
  const [workspaceList, setWorkspaceList] = useState([]);
  const [favoriteWorkspaceList, setFavoriteWorkspaceList] = useState([]);

  const Views = {
    Project: 0,
    RegisteredNumbers: 1,
    Analytics: 2,
  };

  const [currentView, setCurrentView] = useState(Views.Project);

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
        Views,
        scale,
        setScale,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
