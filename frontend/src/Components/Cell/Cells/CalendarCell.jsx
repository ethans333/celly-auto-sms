import CellSchema from "../CellSchema";
import { WorkspaceContext } from "../../../Pages/Home.jsx";
import { useContext, useEffect, useState } from "react";
import SelectionCell from "../SelectionCell";
import calendar_icon from "../../../assets/calendar-solid.svg";
import * as mb from "../../MicrosoftButtons.jsx";
import * as api from "../../../api.jsx";

export default function CalendarCell({ id }) {
  const { workspace } = useContext(WorkspaceContext);

  return (
    <CellSchema
      id={id}
      sidebar={<CalendarCellSidebar id={id} />}
      icon={calendar_icon}
    >
      <p className="w-64 px-4 pt-6 text-xs text-gray-500 h-14">
        Calendar for scheduling events.
      </p>
      {/* <div className="flex space-x-3">
        <p className="bg-gray-100 w-fit px-2 rounded-lg text-sm">
          {workspace[id].time}
        </p>
        <p className="bg-gray-100 w-fit px-2 rounded-lg text-sm">
          {workspace[id].date}
        </p>
      </div> */}
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
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    api.tokenStatusMicrosoftESL().then((res) => {
      res.json().then((data) => {
        if (res.status == 200 && !data.is_expired) setIsLinked(true);
      });
    });
  }, [id]);

  return (
    <div className="w-full flex flex-col space-y-2">
      <p className="font-bold text-lg mb-7">Modify Calendar Cell</p>
      {isLinked ? <mb.AlreadyLinked /> : <mb.LinkToGraph />}
    </div>
  );
}
