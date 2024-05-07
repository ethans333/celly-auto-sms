import { useContext } from "react";
import { WorkspaceContext } from "../../Pages/Home";
import { ContentCopy } from "@mui/icons-material";
import { GenericLabeledSquareButton } from "../LabeledSquareButton";

export default function () {
  const { workspaceMetaData } = useContext(WorkspaceContext);

  const url = `${import.meta.env.VITE_BASE_URL}/scheduling/${
    workspaceMetaData.user_id
  }/${workspaceMetaData.id}`;

  return (
    <div className="space-y-7 pb-5 px-7">
      <div className="space-y-3 pt-5 pb-3">
        <div className="font-extrabold text-center text-2xl">
          '{workspaceMetaData.workspace_name}' is Live!
        </div>
        <div className="text-center text-4xl">🥳</div>
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
