import plus from "../../../assets/plus-solid-white.svg";
import { useContext } from "react";
import { WorkspaceContext } from "../../../Contexts/Workspace.jsx";
import * as api from "../../../api.jsx";
import { HelpersContext } from "../../../Contexts/Helpers.jsx";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function () {
  const {
    setWorkspaceMetaData,
    setComponentsStack,
    noWorkspaces,
    setSidebar,
    emojis,
  } = useContext(WorkspaceContext);

  const { saveWorkspace, updateWorkspaceLists } = useContext(HelpersContext);

  async function addWorkspace() {
    // Save current workspace
    saveWorkspace();
    // Create new workspace with default values
    const res = await api.addWorkspace(
      "My Workspace",
      [],
      emojis[Math.floor(Math.random() * emojis.length)]
    );

    if (res.status === 200) {
      const json = await res.json();

      console.log(json);

      setSidebar(null);
      setWorkspaceMetaData(json.workspace_metadata);
      setComponentsStack([]);
      updateWorkspaceLists();
    }
  }

  return (
    <div className="absolute bottom-10">
      {noWorkspaces ? <NoWorkspacesAddButton /> : <AddButton />}
    </div>
  );

  function NoWorkspacesAddButton() {
    return (
      <div>
        <div className="animate-bounce">
          <div className="text-sm ml-[32px] w-32 text-center font-semibold text-indigo-600">
            Create a New Project
          </div>

          <div className="ml-[85.5px] mt-1 mb-5">
            <ArrowDownwardIcon sx={{ fill: "#4F46E5" }} />
          </div>
        </div>

        <AddButton />
      </div>
    );
  }

  function AddButton() {
    return (
      <div
        onClick={addWorkspace}
        className="ml-20 bg-black p-3 rounded-lg h-fit cursor-pointer hover:opacity-50 w-fit"
      >
        <img src={plus} className="w-3" alt="plus" />
      </div>
    );
  }
}
