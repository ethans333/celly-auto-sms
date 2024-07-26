import { useState, createContext, useEffect } from "react";
export const WorkspaceContext = createContext();
import Premium from "../Components/Popups/Premium";
import { updateWorkspace } from "../api";

/**
 * Creates a WorkspaceProvider component that wraps its children with a WorkspaceContext.Provider.
 * The WorkspaceContext provides state and functions related to the workspace.
 *
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The children to be wrapped by the WorkspaceContext.Provider.
 * @return {JSX.Element} The WorkspaceProvider component.
 */
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
  const [loadingWorkspaceList, setLoadingWorkspaceList] = useState(true);
  const [noWorkspaces, setNoWorkspaces] = useState(false);
  const [scheduledMeetingsIsLoading, setScheduledMeetingsIsLoading] =
    useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [savedTimer, setSavedTimer] = useState(0);

  const Views = {
    Project: 0,
    ScheduledMeetings: 1,
    Analytics: 2,
  };

  const emojis = ["💼", "🏢", "🗂️", "📅", "💰", "🏛️", "📨", "📋", "☕"];

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
        loadingWorkspaceList,
        setLoadingWorkspaceList,
        noWorkspaces,
        setNoWorkspaces,
        scheduledMeetingsIsLoading,
        setScheduledMeetingsIsLoading,
        emojis,
        isSaving,
        setIsSaving,
        showSaved,
        setShowSaved,
        savedTimer,
        setSavedTimer,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
