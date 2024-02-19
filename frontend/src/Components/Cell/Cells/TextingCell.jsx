import CellSchema from "../CellSchema";
import { WorkspaceContext } from "../../../App";
import { useContext } from "react";
import SelectionCell from "../SelectionCell";
import createCellDataSchema from "../cellDefaultSchema";

export default function TextingCell({ id }) {
  const { workspace } = useContext(WorkspaceContext);

  return (
    <CellSchema id={id} sidebar={<p>{id}</p>}>
      <p className="card-desc">{workspace[id].prompt}</p>
    </CellSchema>
  );
}

export function TextingCellSelection() {
  return (
    <SelectionCell
      type="texting"
      title="Texting"
      emoji="💬"
      description="A simple cell that allows you to send text messages to clients."
    />
  );
}
