import { useContext } from "react";
import { WorkspaceContext } from "../../Contexts/Workspace";
import { ContentCopy } from "@mui/icons-material";
import { GenericLabeledSquareButton } from "../LabeledSquareButton";

export default function () {
  const { workspaceMetaData } = useContext(WorkspaceContext);

  const url = `${window.location.origin}/scheduling/${workspaceMetaData.user_id}/${workspaceMetaData.id}`;

  return (
    <div className="space-y-7 pb-10 px-7">
      <div className="space-y-3 pt-10">
        <div className="font-extrabold text-center text-2xl">
          <a className="bg-gradient-to-r from-violet-600 to-indigo-600 inline-block text-transparent bg-clip-text">
            {workspaceMetaData.workspace_name}
          </a>{" "}
          is Live
        </div>
        <div className="text-gray-500 text-center py-3">Share this link with others to schedule them.</div>
      </div>

      <div className="flex space-x-2">
        <input
          readOnly
          className="border border-black px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-black rounded-lg"
          type="text"
          value={url}
        />
        <GenericLabeledSquareButton
          label="Copy"
          onClick={() => {
            navigator.clipboard.writeText(url);
          }}
        >
          <div className="h-full bg-black w-fit px-2 rounded-lg py-1 hover:opacity-50 cursor-pointer">
            <ContentCopy sx={{ color: "white", fontSize: 16 }} />
          </div>
        </GenericLabeledSquareButton>
      </div>
    </div>
  );
}
