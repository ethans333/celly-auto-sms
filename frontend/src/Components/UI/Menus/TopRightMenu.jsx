import floppy from "../../../assets/floppy-disk-solid.svg";
import sliders from "../../../assets/sliders-solid.svg";
import star_regular from "../../../assets/star-regular.svg";
import star_filled from "../../../assets/star-solid.svg";
import share_icon from "../../../assets/arrow-up-from-bracket-solid.svg";
import load from "../../../assets/circle-notch-solid-white.svg";
import check from "../../../assets/check-solid-white.svg";

import { WorkspaceContext } from "../../../Contexts/Workspace.jsx";
import LabeledSquareButton from "../../LabeledSquareButton.jsx";
import { useContext } from "react";
import Settings from "../../Popups/Settings.jsx";
import WorkspaceLink from "../../Popups/WorkspaceLink.jsx";
import { HelpersContext } from "../../../Contexts/Helpers.jsx";

export default function () {
  const { saveWorkspace, deployWorkspace } = useContext(HelpersContext);
  const {
    workspaceMetaData,
    setWorkspaceMetaData,
    setPopup,
    isSaving,
    showSaved,
  } = useContext(WorkspaceContext);

  return (
    <div
      style={{
        visibility:
          Object.keys(workspaceMetaData).length > 0 ? "visible" : "hidden",
      }}
      className="flex pl-5 pr-7 pt-3.5 h-fit space-x-2.5"
    >
      {/* Save */}
      <LabeledSquareButton
        icon={floppy}
        label={showSaved ? <SavedLabel /> : isSaving ? <SavingLabel /> : "Save"}
        onClick={saveWorkspace}
        showLabel={isSaving || showSaved}
      />
      {/* Favorite */}
      <LabeledSquareButton
        icon={workspaceMetaData.is_favorite ? star_filled : star_regular}
        label="Favorite"
        onClick={() => {
          // on favorite
          setWorkspaceMetaData((p) => ({ ...p, is_favorite: !p.is_favorite }));
          saveWorkspace();
        }}
      />
      {/* Share */}
      <LabeledSquareButton
        icon={share_icon}
        label="Share"
        onClick={() => {
          // deploy current workspace
          deployWorkspace(() => {
            setPopup(<WorkspaceLink />);
          });
        }}
      />
      {/* Settings */}
      <LabeledSquareButton
        icon={sliders}
        label="Settings"
        onClick={() => setPopup(<Settings />)}
      />
    </div>
  );
}

function SavingLabel() {
  return (
    <div className="flex w-fit">
      <div>Saving</div>
      <img src={load} className="w-3 mr-3 ml-[5px] animate-spin" />
    </div>
  );
}

function SavedLabel() {
  return (
    <div className="flex w-fit">
      <div>Saved</div>
      <img src={check} className="w-2.5 mr-2.5 ml-[4px]" />
    </div>
  );
}
