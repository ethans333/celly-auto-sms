import { WorkspaceContext } from "../Contexts/Workspace";
import { useContext, createContext } from "react";
import * as jose from "jose";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import { Cell } from "../Components/Cell/Cell";
import objectsToCells from "../Components/Cell/Cells/objectsToCells";

export const HelpersContext = createContext();

export function HelpersProvider({ children }) {
  const navigate = useNavigate();
  const {
    setWorkspaceList,
    setFavoriteWorkspaceList,
    componentsStack,
    workspaceMetaData,
    setWorkspaceMetaData,
    setComponentsStack,
  } = useContext(WorkspaceContext);

  /**
   * A function to validate the token's expiration.
   *
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
   * If available, parse the token from the URL and set it as a cookie
   *
   * @param None
   * @return None
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
   * Function to save the workspace data.
   *
   */
  function saveWorkspace() {
    const objects = componentsStack
      .filter((c) => c.ref.current.constructor.prototype instanceof Cell)
      .map((c) => c.ref.current.toJSON());

    console.log(objects);

    api.updateWorkspace(workspaceMetaData, objects).then((res) => {
      console.log(res);
    });

    // let metadata;

    // if (override && !(override.constructor.name === "SyntheticBaseEvent")) {
    //   metadata = override;
    // } else {
    //   metadata = workspaceMetaData;
    // }

    // if (!metadata.id) {
    //   console.log("No workspace selected.");
    //   return;
    // }

    // if (workspace === undefined || workspace === null || workspace === "") {
    //   alert("Workspace is undefined");
    // }

    // api.updateWorkspace(metadata, workspace).then(async (res) => {
    //   if (res.status === 200) {
    //     const json = await res.json();
    //     setMessageStack((p) => [
    //       { message: json.message, type: "success" },
    //       ...p,
    //     ]);

    //     setTimeout(() => {
    //       setMessageStack((p) => {
    //         p.pop();
    //         return [...p];
    //       });
    //     }, 3000);
    //     console.log(json);

    //     updateWorkspaceLists();
    //   } else {
    //     setMessageStack((p) => [{ message: res, type: "error" }, ...p]);

    //     setTimeout(() => {
    //       setMessageStack((p) => {
    //         p.pop();
    //         return [...p];
    //       });
    //     }, 3000);
    //     console.log(res);
    //   }
    // });
  }

  function loadWorkspace() {
    api.getWorkspace(workspaceMetaData.id).then((res) => {
      if (!res.workspace_raw) return;

      const objects = JSON.parse(res.workspace_raw);
      const cells = objectsToCells(objects);
      console.log(cells);
      setComponentsStack(cells);
    });
  }

  function updateWorkspaceLists() {
    api.getAllUserWorkspaces().then((res) => {
      setWorkspaceList(res.workspaces);
      setFavoriteWorkspaceList(res.workspaces.filter((ws) => ws.is_favorite));
      if (res.workspaces.length > 0) setWorkspaceMetaData(res.workspaces[0]);
    });
  }

  return (
    <HelpersContext.Provider
      value={{
        validateToken,
        parseCode,
        saveWorkspace,
        updateWorkspaceLists,
        loadWorkspace,
      }}
    >
      {children}
    </HelpersContext.Provider>
  );
}
