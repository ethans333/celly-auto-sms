import floppy from "../assets/floppy-disk-solid.svg";
import gear from "../assets/gear-solid.svg";

import { WorkspaceContext } from "../Pages/Home.jsx";
import { useContext } from "react";

export default function () {
  const { workspace } = useContext(WorkspaceContext);

  return (
    <div className="flex pr-5 mt-3 h-fit">
      {/* Save */}
      <img
        src={floppy}
        className="square-button w-8 mr-2.5"
        onClick={() => {
          console.log(workspace);
        }}
      />
      {/* Settings */}
      <img src={gear} className="square-button w-8" />
    </div>
  );
}
