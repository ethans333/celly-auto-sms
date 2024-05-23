import plus from "../../../assets/plus-solid-white.svg";
import { useContext } from "react";
import { WorkspaceContext } from "../../../Contexts/Workspace.jsx";
import * as api from "../../../api.jsx";
import { HelpersContext } from "../../../Contexts/Helpers.jsx";

export default function () {
  const { setWorkspaceMetaData, updateWorkspaceLists, setComponentsStack } =
    useContext(WorkspaceContext);

  const { saveWorkspace } = useContext(HelpersContext);

  const defaultWorkspace = {
    workspace_name: "My Workspace",
    workspace_description: "Lorem Ipsum",
    workspace_raw: [],
    is_favorite: false,
    workspace_emoji: "👽",
    workspace_id: null,
    is_deployed: false,
  };

  return (
    <div className="pl-20">
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
            setComponentsStack([]);
            updateWorkspaceLists();
          }
        }}
        className="bg-black p-3 rounded-lg h-fit cursor-pointer hover:opacity-50 w-fit absolute bottom-10"
      >
        <img src={plus} className="w-3" alt="plus" />
      </div>
    </div>
  );
}
