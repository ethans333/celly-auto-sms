import plus from "../assets/plus-solid-white.svg";
import { useContext } from "react";
import { WorkspaceContext } from "../Pages/Home.jsx";
import * as api from "../api.jsx";

export default function () {
  const {
    workspace,
    workspaceMetaData,
    saveWorkspace,
    setWorkspaceMetaData,
    setWorkspace,
    updateWorkspaceLists,
  } = useContext(WorkspaceContext);

  const defaultWorkspace = {
    workspace_name: "My Workspace",
    workspace_description: "Lorem Ipsum",
    workspace_raw: {},
    is_favorite: false,
    workspace_emoji: "👽",
    workspace_id: null,
    is_deployed: false,
  };

  return (
    <div className="flex pr-5 h-full">
      {/* Add Button */}
      <div
        onClick={async () => {
          // Save current workspace
          saveWorkspace();
          // Create new workspace with default values
          const res = await api.addWorkspace(
            defaultWorkspace.workspace_name,
            defaultWorkspace.workspace_description,
            defaultWorkspace.workspace_raw,
            defaultWorkspace.is_favorite
          );

          if (res.status === 200) {
            const json = await res.json();

            console.log(json);

            setWorkspaceMetaData(json.workspace_metadata);
            setWorkspace({});

            updateWorkspaceLists();
          }
        }}
        className="bg-black p-3 rounded-lg h-fit mt-auto mb-20 ml-auto mr-5 cursor-pointer hover:opacity-50"
      >
        <img src={plus} className="w-3" alt="plus" />
      </div>
    </div>
  );
}
