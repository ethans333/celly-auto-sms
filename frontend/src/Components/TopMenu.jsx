import floppy from "../assets/floppy-disk-solid.svg";
import gear from "../assets/gear-solid.svg";

import { WorkspaceContext } from "../Pages/Home.jsx";
import { useContext } from "react";
import * as api from "../api.jsx";

export default function () {
  const { workspace, workspaceMetaData } = useContext(WorkspaceContext);

  return (
    <div className="flex pr-5 mt-3 h-fit">
      {/* Save */}
      <img
        src={floppy}
        className="square-button w-8 mr-2.5"
        onClick={() => {
          // on save
          api.updateWorkspace(
            workspaceMetaData.workspace_id,
            workspaceMetaData.workspace_name,
            workspaceMetaData.workspace_description,
            workspace
          );
          console.log(workspace);
        }}
      />
      {/* Settings */}
      <img src={gear} className="square-button w-8" />
    </div>
  );
}
