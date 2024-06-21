import floppy from "../../../assets/floppy-disk-solid.svg";
import sliders from "../../../assets/sliders-solid.svg";
import star_regular from "../../../assets/star-regular.svg";
import star_filled from "../../../assets/star-solid.svg";
import share_icon from "../../../assets/arrow-up-from-bracket-solid.svg";

import { WorkspaceContext } from "../../../Contexts/Workspace.jsx";
import LabeledSquareButton from "../../LabeledSquareButton.jsx";
import { useContext } from "react";
import Settings from "../../Popups/Settings.jsx";
import WorkspaceLink from "../../Popups/WorkspaceLink.jsx";
import { HelpersContext } from "../../../Contexts/Helpers.jsx";

export default function () {
  const { saveWorkspace, deployWorkspace } = useContext(HelpersContext);
  const { workspaceMetaData, setWorkspaceMetaData, setPopup } =
    useContext(WorkspaceContext);

  return (
    <div
      style={{
        visibility:
          Object.keys(workspaceMetaData).length > 0 ? "visible" : "hidden",
      }}
      className="flex pr-5 mt-3.5 h-fit space-x-2.5"
    >
      {/* Save */}
      <LabeledSquareButton icon={floppy} label="Save" onClick={saveWorkspace} />
      {/* Favorite */}
      <LabeledSquareButton
        icon={workspaceMetaData.is_favorite ? star_filled : star_regular}
        label="Favorite"
        onClick={() => {
          // on favorite
          setWorkspaceMetaData((p) => ({ ...p, is_favorite: !p.is_favorite }));

          let metadata = workspaceMetaData;
          workspaceMetaData.is_favorite = !workspaceMetaData.is_favorite;

          saveWorkspace(metadata);
        }}
      />
      {/* Share */}
      <LabeledSquareButton
        icon={share_icon}
        label="Share"
        onClick={() => {
          // save current workspace
          saveWorkspace();
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
