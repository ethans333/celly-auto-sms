import floppy from "../assets/floppy-disk-solid.svg";
import gear from "../assets/gear-solid.svg";
import star_regular from "../assets/star-regular.svg";
import star_filled from "../assets/star-solid.svg";

import { WorkspaceContext } from "../Pages/Home.jsx";
import { useContext, useState, useEffect } from "react";
import Settings from "./Popups/Settings.jsx";

export default function () {
  const {
    workspaceMetaData,
    setWorkspaceMetaData,
    setPopupChildren,
    saveWorkspace,
  } = useContext(WorkspaceContext);

  return (
    <div className="flex pr-5 mt-3 h-fit">
      {/* Save */}
      <img
        src={floppy}
        className="square-button w-8 mr-2.5 z-50 bg-white"
        onClick={saveWorkspace}
      />
      {/* Favorite */}
      <img
        src={workspaceMetaData.is_favorite ? star_filled : star_regular}
        className="square-button w-8 mr-2.5 z-50 bg-white"
        onClick={() => {
          // on favorite
          setWorkspaceMetaData((p) => ({ ...p, is_favorite: !p.is_favorite }));
          saveWorkspace({ is_favorite: !workspaceMetaData.is_favorite });
        }}
      />
      {/* Settings */}
      <img
        onClick={() => setPopupChildren(<Settings />)}
        src={gear}
        className="square-button w-8 z-50 bg-white"
      />
    </div>
  );
}
