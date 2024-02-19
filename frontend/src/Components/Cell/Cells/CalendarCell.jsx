import CellSchema from "../CellSchema";
import { WorkspaceContext } from "../../../App";
import { useContext } from "react";
import SelectionCell from "../SelectionCell";

export default function CalendarCell({ id }) {
  const { workspace } = useContext(WorkspaceContext);

  return (
    <CellSchema id={id} sidebar={<p>{id}</p>}>
      <p className="card-desc">{workspace[id].name}</p>
      <div className="flex space-x-3">
        <p className="bg-gray-100 w-fit px-2 rounded-lg text-sm">
          {workspace[id].time}
        </p>
        <p className="bg-gray-100 w-fit px-2 rounded-lg text-sm">
          {workspace[id].date}
        </p>
      </div>
    </CellSchema>
  );
}

export function CalendarCellSelection() {
  return (
    <SelectionCell
      type="calendar"
      title="Calendar"
      emoji="📅"
      description="Text your clients a link which adds an event to their calendar."
    />
  );
}
