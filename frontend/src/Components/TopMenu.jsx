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
          api
            .updateWorkspace(
              workspaceMetaData.workspace_id,
              workspaceMetaData.workspace_name,
              workspaceMetaData.workspace_description,
              JSON.stringify(workspace)
            )
            .then(async (res) => {
              if (res.status === 200) {
                const json = await res.json();
                console.log(json);
              } else {
                console.log(res);
              }
            });
        }}
      />
      {/* Settings */}
      <img src={gear} className="square-button w-8" />
    </div>
  );
}
