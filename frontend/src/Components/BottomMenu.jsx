import plus from "../assets/plus-solid-white.svg";
import { useContext } from "react";
import { WorkspaceContext } from "../Pages/Home.jsx";
import * as api from "../api.jsx";

export default function () {
  const { workspace, workspaceMetaData, setWorkspaceMetaData, setWorkspace } =
    useContext(WorkspaceContext);

  const defaultWorkspace = {
    workspace_name: import.meta.env.VITE_DEFAULT_WORKSPACE_NAME,
    workspace_description: "Lorem Ipsum",
    workspace_raw: {},
    is_favorite: false,
    workspace_emoji: "👽",
  };

  return (
    <div className="flex pr-5 h-full">
      {/* Add Button */}
      <div
        onClick={() => {
          // Save current workspace
          if (workspaceMetaData != {}) {
            api.updateWorkspace(
              workspaceMetaData.id,
              workspaceMetaData.workspace_name,
              workspaceMetaData.workspace_description,
              workspace,
              workspaceMetaData.is_favorite,
              workspaceMetaData.workspace_emoji,
              workspaceMetaData.is_deployed
            );
          }
          // Create new workspace with default values
          api.addWorkspace(
            defaultWorkspace.workspace_name,
            defaultWorkspace.workspace_description,
            defaultWorkspace.workspace_raw,
            defaultWorkspace.is_favorite,
            defaultWorkspace.workspace_emoji
          );
          // Set current workspace to new workspace
          const tempRaw = defaultWorkspace.workspace_raw;
          delete defaultWorkspace.workspace_raw;
          setWorkspaceMetaData(defaultWorkspace);
          setWorkspace(tempRaw);
        }}
        className="bg-black p-3 rounded-lg h-fit mt-auto mb-20 ml-auto mr-5 cursor-pointer hover:opacity-50"
      >
        <img src={plus} className="w-3" alt="plus" />
      </div>
    </div>
  );
}
