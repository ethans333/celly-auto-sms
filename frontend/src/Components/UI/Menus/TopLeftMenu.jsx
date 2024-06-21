import { useState, useContext, useEffect } from "react";
import { WorkspaceContext } from "../../../Contexts/Workspace";
import { HelpersContext } from "../../../Contexts/Helpers";
import Dropdown from "../../Dropdown";

export default function () {
  const { workspaceMetaData, setWorkspaceMetaData } =
    useContext(WorkspaceContext);

  const { saveWorkspace } = useContext(HelpersContext);

  const [titleTemp, setTitleTemp] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // useEffect(() => { // Clearing workspace raw for some reason on refresh?
  //   saveWorkspace();
  // }, [workspaceMetaData.workspace_emoji]);

  return (
    <div
      style={{
        visibility:
          Object.keys(workspaceMetaData).length > 0 ? "visible" : "hidden",
      }}
      className="mt-5"
    >
      <div className="flex gap-x-3">
        {/* Emoji Dropdown */}
        <Dropdown
          values={["👽", "🛸", "🚀"]}
          current={workspaceMetaData.workspace_emoji}
          setCurrent={(emo) => {
            setWorkspaceMetaData((p) => ({ ...p, workspace_emoji: emo }));
          }}
        />
        {/* Title */}
        {isEditingTitle ? (
          <input
            value={workspaceMetaData.workspace_name}
            onChange={(e) =>
              setWorkspaceMetaData((p) => ({
                ...p,
                workspace_name: e.target.value,
              }))
            }
            onBlur={() => {
              setIsEditingTitle((p) => !p);

              if (workspaceMetaData.workspace_name == "") {
                setWorkspaceMetaData((p) => ({
                  ...p,
                  workspace_name: titleTemp,
                }));

                return;
              }

              saveWorkspace();
            }}
            type="text"
            className="outline-none text-xl font-extrabold bg-purple-100 px-1 py-0.5"
            placeholder="Project Title"
          />
        ) : (
          <div>
            <h1
              onClick={() => {
                setIsEditingTitle((p) => !p);
                setTitleTemp(workspaceMetaData.workspace_name);
              }}
              className="text-xl font-extrabold hover:bg-purple-100 px-1 py-0.5 cursor-pointer"
            >
              {workspaceMetaData.workspace_name}
            </h1>
          </div>
        )}
        {/* Live Signal
        {workspaceMetaData.is_deployed && (
          <div className="relative">
            <div className="text-sm text-red-500 font-black transform translate-y-2 tracking-wide">
              LIVE
            </div>
            <div className="absolute right-0 top-0 transform translate-x-3 translate-y-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
