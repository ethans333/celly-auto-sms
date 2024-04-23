import CellSchema from "../CellSchema";
import { WorkspaceContext } from "../../../Pages/Home.jsx";
import { useContext } from "react";
import SelectionCell from "../SelectionCell";
import createCellDataSchema from "../cellDefaultSchema";
import message_icon from "../../../assets/comment-solid.svg";

export default function TextingCell({ id }) {
  const { workspace } = useContext(WorkspaceContext);

  return (
    <CellSchema id={id} sidebar={<p>{id}</p>} icon={message_icon}>
      <p className="w-64 px-4 pt-6 text-xs text-gray-500 h-14">
        Automated conversation via texting.
      </p>
    </CellSchema>
  );
}

export function TextingCellSelection() {
  return (
    <SelectionCell
      type="texting"
      title="Texting"
      icon={message_icon}
      description="A simple cell that allows you to send text messages to clients."
    />
  );
}
