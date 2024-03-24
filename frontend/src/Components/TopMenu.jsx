import floppy from "../assets/floppy-disk-solid.svg";
import gear from "../assets/gear-solid.svg";
import sliders from "../assets/sliders-solid.svg";
import star_regular from "../assets/star-regular.svg";
import star_filled from "../assets/star-solid.svg";
import cloud_bolt from "../assets/cloud-bolt-solid.svg";

import { WorkspaceContext } from "../Pages/Home.jsx";
import { useContext, useState, useEffect } from "react";
import Settings from "./Popups/Settings.jsx";

export default function () {
  const {
    workspaceMetaData,
    setWorkspaceMetaData,
    setPopupChildren,
    saveWorkspace,
    settingsConfig,
  } = useContext(WorkspaceContext);

  return (
    <div className="flex pr-5 mt-3 h-fit space-x-2.5">
      {/* Save */}
      <LabeledSquareButton icon={floppy} label="Save" onClick={saveWorkspace} />
      {/* Favorite */}
      <LabeledSquareButton
        icon={workspaceMetaData.is_favorite ? star_filled : star_regular}
        label="Favorite"
        onClick={() => {
          // on favorite
          setWorkspaceMetaData((p) => ({ ...p, is_favorite: !p.is_favorite }));
          saveWorkspace({ is_favorite: !workspaceMetaData.is_favorite });
        }}
      />
      {/* Deploy */}
      <LabeledSquareButton
        icon={cloud_bolt}
        label="Deploy"
        onClick={() => {
          // save current workspace
          /// deploy current workspace
        }}
      />
      {/* Settings */}
      <LabeledSquareButton
        icon={sliders}
        label="Settings"
        onClick={() => setPopupChildren(<Settings />)}
      />
    </div>
  );

  function LabeledSquareButton({ icon, label, onClick }) {
    const [isHovering, setIsHovering] = useState(false);

    return (
      <div className="relative mt-1">
        <img
          src={icon}
          className="square-button w-8 h-7 z-50 bg-white"
          onClick={onClick}
          onMouseOver={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        />
        {isHovering && (
          <div className="absolute top-7 left-4 transform -translate-x-1/2 bg-black text-white text-xs rounded p-1">
            {label}
          </div>
        )}
      </div>
    );
  }
}
