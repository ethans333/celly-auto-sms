import { useContext } from "react";
import { WorkspaceContext } from "../../Contexts/Workspace";
import toggle_on from "../../assets/toggle-on-solid.svg";
import toggle_off from "../../assets/toggle-off-solid.svg";
import * as api from "../../api";

export default function () {
  const {
    config,
    setConfig,
    workspaceMetaData,
    setWorkspaceMetaData,
    setWorkspace,
    setPopup,
    updateWorkspaceLists,
  } = useContext(WorkspaceContext);

  return (
    <div className="space-y-5 pb-3">
      {/* Settings */}
      <div className="pt-3">
        <h1 className="font-extrabold">Settings</h1>
        <div className="grid grid-cols-3 w-96 mt-2">
          <div className="text-gray-500 space-y-3">
            <p>Lorem Ipsum</p>
            <p>Reprehenderit</p>
            <p>Auto Save</p>
          </div>
          <div className="col-span-2 text-right space-y-3">
            {/* Placeholder */}
            <img
              src={config.placeholder_1 ? toggle_on : toggle_off}
              alt="toggle"
              className="w-7 ml-auto py-auto cursor-pointer"
              onClick={() =>
                setConfig({ ...config, placeholder_1: !config.placeholder_1 })
              }
            />
            {/* Placeholder */}
            <img
              src={config.placeholder_2 ? toggle_on : toggle_off}
              alt="toggle"
              className="w-7 ml-auto py-auto cursor-pointer"
              onClick={() =>
                setConfig({ ...config, placeholder_2: !config.placeholder_2 })
              }
            />
            {/* Auto Save */}
            <img
              src={config.auto_save ? toggle_on : toggle_off}
              alt="toggle"
              className="w-7 ml-auto py-auto cursor-pointer"
              onClick={() =>
                setConfig({ ...config, auto_save: !config.auto_save })
              }
            />
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="border-t pt-3">
        <h1 className="font-extrabold">Controls</h1>
        <div className="grid grid-cols-3 w-96 mt-2">
          <div className="text-gray-500 space-y-3">
            <p>Save</p>
            <p>New Workspace</p>
            <p>Undo</p>
            <p>Redo</p>
          </div>
          <div className="col-span-2 space-y-3">
            {/* Save */}
            <div className="flex justify-end">
              <KeyLabel k="Ctrl" />
              <p className="mx-1.5">+</p>
              <KeyLabel k="S" />
            </div>
            {/* New Workspace */}
            <div className="flex justify-end">
              <KeyLabel k="Ctrl" />
              <p className="mx-1.5">+</p>
              <KeyLabel k="Shift" />
              <p className="mx-1.5">+</p>
              <KeyLabel k="N" />
            </div>
            {/* Undo */}
            <div className="flex justify-end">
              <KeyLabel k="Ctrl" />
              <p className="mx-1.5">+</p>
              <KeyLabel k="Z" />
            </div>
            {/* Redo */}
            <div className="flex justify-end">
              <KeyLabel k="Ctrl" />
              <p className="mx-1.5">+</p>
              <KeyLabel k="Y" />
            </div>
          </div>
        </div>
      </div>
      {/* Danger Zone */}
      <div className="border-t pt-3">
        <h1 className="font-extrabold">Danger Zone</h1>
        <div className="grid grid-cols-2 w-96 mt-2">
          <div className="text-gray-500 space-y-3">
            <p>Delete Workspace</p>
            <p>Delete Numbers</p>
            <p>Unlink External Services</p>
          </div>
          <div className="space-y-3">
            {/* Delete Workspace */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this workspace?"
                    )
                  ) {
                    deleteWorkspace();
                  }
                }}
                className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg w-14 hover:opacity-50"
              >
                Delete
              </button>
            </div>
            {/* Delete Phone Numbers */}
            <div className="flex justify-end ">
              <button className="bg-yellow-300 text-black text-xs px-2 py-1 rounded-lg w-14 hover:opacity-50">
                Delete
              </button>
            </div>
            {/* Unlink Account */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  api.unlinkAllESL().then((res) => {
                    res.json().then((data) => {
                      console.log(data);
                    });
                  });
                }}
                className="bg-yellow-300 text-black text-xs px-2 py-1 rounded-lg w-14 hover:opacity-50"
              >
                Unlink
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function KeyLabel({ k }) {
    return (
      <div className="border shadow-sm w-fit text-center py-1 px-1.5 rounded-lg text-xs w-fit min-w-6 h-6">
        {k}
      </div>
    );
  }

  function deleteWorkspace() {
    api.deleteWorkspace(workspaceMetaData.id).then((res) => {
      if (res.status === 200) {
        console.log("Workspace Deleted");
        updateWorkspaceLists();
      } else {
        console.log(res);
      }
    });

    setPopup(null);
    setWorkspaceMetaData({});
    setWorkspace({});
  }
}
