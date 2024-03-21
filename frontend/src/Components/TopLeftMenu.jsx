import { useState, useContext } from "react";
import { WorkspaceContext } from "../Pages/Home";
import Dropdown from "./Dropdown";

export default function () {
  const { workspaceMetaData, setWorkspaceMetaData } =
    useContext(WorkspaceContext);

  const [titleTemp, setTitleTemp] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <div className="mt-5 z-50">
      <div className="flex gap-x-3">
        <Dropdown
          values={["👽", "🛸", "🚀"]}
          current={workspaceMetaData.workspace_emoji}
          setCurrent={(emo) => {
            setWorkspaceMetaData((p) => ({ ...p, workspace_emoji: emo }));
          }}
        />
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
            className="outline-none text-lg font-extrabold bg-purple-200"
            placeholder="Project Title"
          />
        ) : (
          <h1
            onClick={() => {
              setIsEditingTitle((p) => !p);
              setTitleTemp(workspaceMetaData.workspace_name);
            }}
            className="text-lg font-extrabold hover:bg-purple-200 p-1"
          >
            {workspaceMetaData.workspace_name}
          </h1>
        )}
      </div>
    </div>
  );
}
