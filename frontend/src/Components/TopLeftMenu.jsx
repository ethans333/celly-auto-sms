import { useState, useContext } from "react";
import { WorkspaceContext } from "../Pages/Home";
import Dropdown from "./Dropdown";
import red_circle from "../assets/circle-solid-red.svg";

export default function () {
  const { workspaceMetaData, setWorkspaceMetaData } =
    useContext(WorkspaceContext);

  const [titleTemp, setTitleTemp] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <div className="mt-5 z-50">
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
              if (workspaceMetaData.workspace_name == "")
                setWorkspaceMetaData((p) => ({
                  ...p,
                  workspace_name: titleTemp,
                }));
            }}
            type="text"
            className="outline-none text-lg font-black bg-purple-200"
            placeholder="Project Title"
          />
        ) : (
          <div>
            <h1
              onClick={() => {
                setIsEditingTitle((p) => !p);
                setTitleTemp(workspaceMetaData.workspace_name);
              }}
              className="text-lg font-black hover:bg-purple-200 p-1"
            >
              {workspaceMetaData.workspace_name}
            </h1>
          </div>
        )}
        {/* Live Signal */}
        {workspaceMetaData.is_deployed && (
          <div className="relative">
            <div className="text-sm text-red-500 font-black transform translate-y-2 tracking-wide">
              LIVE
            </div>
            <div className="absolute right-0 top-0 transform translate-x-3 translate-y-2.5">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
