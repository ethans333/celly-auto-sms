import floppy from "../../../assets/floppy-disk-solid.svg";
import sliders from "../../../assets/sliders-solid.svg";
import star_regular from "../../../assets/star-regular.svg";
import star_filled from "../../../assets/star-solid.svg";
import cloud_bolt from "../../../assets/cloud-bolt-solid.svg";

import { WorkspaceContext } from "../../../Pages/Home.jsx";
import LabeledSquareButton from "../../LabeledSquareButton.jsx";
import { useContext, useState, useEffect } from "react";
import Settings from "../../Popups/Settings.jsx";
import WorkspaceLink from "../../Popups/WorkspaceLink.jsx";
import * as api from "../../../api.jsx";

export default function () {
  const {
    workspaceMetaData,
    setWorkspaceMetaData,
    setPopupChildren,
    saveWorkspace,
  } = useContext(WorkspaceContext);

  return (
    <div className="flex pr-5 mt-3.5 h-fit space-x-2.5">
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
      {/* Deploy */}
      <LabeledSquareButton
        icon={cloud_bolt}
        label="Deploy"
        onClick={() => {
          // save current workspace
          saveWorkspace();
          /// deploy current workspace
          api.deployWorkspace(workspaceMetaData.id).then((res) => {
            if (res.status === 200) {
              setWorkspaceMetaData((p) => ({ ...p, is_deployed: true }));
              setPopupChildren(<WorkspaceLink />);
              res.json().then((data) => {
                console.log(data);
              });
            }
          });
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
}
