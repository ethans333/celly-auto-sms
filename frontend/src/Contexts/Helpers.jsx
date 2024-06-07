import { WorkspaceContext } from "../Contexts/Workspace";
import { useContext, createContext } from "react";
import * as jose from "jose";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import { Cell } from "../Components/Cell/Cell";
import Tutorial from "../Components/Popups/Tutorial";

export const HelpersContext = createContext();

/**
 * A provider component that wraps its children with the HelpersContext.
 * HelpersContext provides helper functions for various operations for the application.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {ReactNode} props.children - The child components to be wrapped.
 * @return {ReactNode} The wrapped child components.
 */
export function HelpersProvider({ children }) {
  const navigate = useNavigate();
  const {
    setWorkspaceList,
    setFavoriteWorkspaceList,
    componentsStack,
    workspaceMetaData,
    setWorkspaceMetaData,
    setComponentsStack,
    setPopup,
    setLoadingWorkspaceList,
    setNoWorkspaces,
    deltaX,
    deltaY,
  } = useContext(WorkspaceContext);

  /**
   * Validates the token's expiration.
   *
   * @return {void} This function does not return a value.
   */
  function validateToken() {
    // Check if token is expired or does not exist
    const token = Cookies.get("access_token");

    if (!token) {
      // Token does not exist
      navigate("/login");
      return;
    } else {
      // Token is expired
      const claims = jose.decodeJwt(token);
      if (Date.now() > claims.exp * 1000) {
        Cookies.remove("access_token");
        navigate("/login");
      }
    }
  }

  /**
   * Parses the code from the URL and sets it as a cookie.
   *
   * @return {void} This function does not return a value.
   */
  function parseCode() {
    // If available, parse the token from the URL and set it as a cookie
    let url = new URL(window.location.href);
    let params = url.searchParams;

    if (params.size === 0) return;

    api.storeMicrosoftTokenESL(params.get("code")).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          console.log(data);
        });
      } else {
        console.error(res);
      }
    });
  }

  /**
   * Saves the current workspace by extracting the JSON representation of all cells in the componentsStack,
   * and updating the workspace with the extracted objects using the api.updateWorkspace function.
   *
   * @return {Promise} A Promise that resolves when the workspace is successfully updated.
   */
  function saveWorkspace() {
    const metadata = workspaceMetaData;

    metadata["delta_x"] = deltaX.toString();
    metadata["delta_y"] = deltaY.toString();
    console.log(metadata);

    const objects = componentsStack
      .filter((c) => c.ref.current.constructor.prototype instanceof Cell)
      .map((c) => c.ref.current.toJSON());

    api.updateWorkspace(metadata, objects).then((res) => {
      updateWorkspaceLists(false);
    });
  }

  /**
   * Deploys a workspace by calling the API and updating the state variables.
   *
   * @param {function} callback - A callback function to be executed after the deployment is complete.
   * @return {Promise<void>} A Promise that resolves when the deployment is complete.
   */
  async function deployWorkspace(callback) {
    api.deployWorkspace(workspaceMetaData.id).then((res) => {
      console.log(res);
      callback();
      setWorkspaceMetaData((p) => ({ ...p, is_deployed: true }));
    });
  }

  /**
   * Updates the workspace lists by fetching all user workspaces from the API and updating the state variables accordingly.
   *
   * @param {boolean} setWorkspace - Indicates whether to set the first workspace as the workspace metadata. Defaults to true.
   * @return {void} This function does not return a value.
   */
  function updateWorkspaceLists(setWorkspace = true) {
    setLoadingWorkspaceList(true);

    api.getAllUserWorkspaces().then((res) => {
      setLoadingWorkspaceList(false);
      setWorkspaceList(res.workspaces);
      setFavoriteWorkspaceList(res.workspaces.filter((ws) => ws.is_favorite));
      if (res.workspaces.length == 0) {
        setNoWorkspaces(true);
        console.log(workspaceMetaData);
        return;
      }
      if (setWorkspace) setWorkspaceMetaData(res.workspaces[0]);
      setNoWorkspaces(false);
    });
  }

  /**
   * Deletes a workspace by calling the API and updating the state variables.
   *
   * @return {Promise<void>} A Promise that resolves when the workspace is deleted.
   */
  function deleteWorkspace() {
    api.deleteWorkspace(workspaceMetaData.id).then((res) => {
      updateWorkspaceLists();
      setPopup(null);
      setWorkspaceMetaData({});
      setComponentsStack([]);
    });
  }

  async function showTutorial() {
    const res = await api.getUser();
    const show_demo =
      res.UserAttributes.filter(
        (u) => u.Name === "custom:show_demo"
      )[0].Value.toLowerCase() == "true";

    return show_demo;
  }

  function hideTutorial() {
    api.hideDemo().then((res) => {
      console.log(res);
    });
  }

  return (
    <HelpersContext.Provider
      value={{
        validateToken,
        parseCode,
        saveWorkspace,
        deployWorkspace,
        updateWorkspaceLists,
        deleteWorkspace,
        showTutorial,
        hideTutorial,
      }}
    >
      {children}
    </HelpersContext.Provider>
  );
}
