import CellSchema from "../CellSchema";
import { WorkspaceContext } from "../../../Pages/Home.jsx";
import { useContext } from "react";
import SelectionCell from "../SelectionCell";

export default function CalendarCell({ id }) {
  const { workspace } = useContext(WorkspaceContext);

  return (
    <CellSchema id={id} sidebar={<p>{id}</p>}>
      <p className="card-desc">{workspace[id].name}</p>
    </CellSchema>
  );
}

export function CalendarCellSelection() {
  return (
    <SelectionCell
      type="qna"
      title="QnA"
      emoji="❓"
      description="Text your clients a link which adds an event to their calendar."
    />
  );
}
