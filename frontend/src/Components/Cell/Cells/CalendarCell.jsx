import CellSchema from "../CellSchema";
import { WorkspaceContext } from "../../../Pages/Home.jsx";
import { useContext } from "react";
import SelectionCell from "../SelectionCell";
import calendar_icon from "../../../assets/calendar-solid.svg";
import * as mb from "../../MicrosoftButtons.jsx";

export default function CalendarCell({ id }) {
  const { workspace } = useContext(WorkspaceContext);

  return (
    <CellSchema
      id={id}
      sidebar={<CalendarCellSidebar id={id} />}
      icon={calendar_icon}
    >
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

export function CalendarCellSidebar({ id }) {
  const { workspace } = useContext(WorkspaceContext);

  return (
    <div className="w-full flex flex-col space-y-2">
      <p className="font-bold text-lg mb-7">Modify Calendar Cell</p>
      <mb.LinkToGraph />
    </div>
  );
}
