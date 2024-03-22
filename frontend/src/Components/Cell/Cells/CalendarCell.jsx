import CellSchema from "../CellSchema";
import { WorkspaceContext } from "../../../Pages/Home.jsx";
import { useContext } from "react";
import SelectionCell from "../SelectionCell";
import calendar_icon from "../../../assets/calendar-solid.svg";

export default function CalendarCell({ id }) {
  const { workspace } = useContext(WorkspaceContext);

  return (
    <CellSchema id={id} sidebar={<p>{id}</p>} icon={calendar_icon}>
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
      icon={calendar_icon}
      description="Text your clients a link which adds an event to their calendar."
    />
  );
}
