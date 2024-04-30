import CellSchema from "../CellSchema";
import { WorkspaceContext } from "../../../Pages/Home.jsx";
import { useContext, useEffect, useState } from "react";
import SelectionCell from "../SelectionCell";
import calendar_icon from "../../../assets/calendar-solid.svg";
import * as mb from "../../MicrosoftButtons.jsx";
import * as api from "../../../api.jsx";
import Dropdown from "../../Dropdown.jsx";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isLinked, setIsLinked] = useState(false);
  const [selectedDays, setSelectedDays] = useState(["Saturday", "Sunday"]);

  const dow = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    api.tokenStatusMicrosoftESL().then((res) => {
      res.json().then((data) => {
        setIsLoading(false);
        if (res.status == 200 && !data.is_expired) setIsLinked(true);
      });
    });
  }, [id]);

  return (
    <div className="w-full flex flex-col space-y-2">
      <p className="font-bold text-lg mb-3">Modify Scheduling</p>
      {isLoading ? (
        <mb.Loading />
      ) : isLinked ? (
        <mb.AlreadyLinked />
      ) : (
        <mb.LinkToGraph />
      )}

      <div className="pt-7 space-y-5">
        <div>
          <p className="font-bold">Meeting Window</p>
          <div className="mt-3 flex space-x-3">
            <input
              placeholder="Start"
              type="text"
              // value={9}
              className="w-[64px] border border-gray-100 border-2 rounded-md px-3 text-sm"
            />
            <Dropdown
              values={["AM", "PM"]}
              current={"AM"}
              setCurrent={() => {}}
            />
            <p className="p-1">-</p>
            <input
              placeholder="End"
              type="text"
              // value={5}
              className="w-[64px] border border-gray-100 border-2 rounded-md px-3 text-sm"
            />
            <Dropdown
              values={["AM", "PM"]}
              current={"PM"}
              setCurrent={() => {}}
            />
          </div>
        </div>
        <div>
          <p className="font-bold pt-5">Blackout Days</p>
          <div className="mt-3">
            <Dropdown
              values={dow.filter((day) => !selectedDays.includes(day))}
              current={dow.filter((day) => !selectedDays.includes(day))[0]}
              setCurrent={function (value) {
                setSelectedDays([...selectedDays, value]);
              }}
              padded
            />
            <div className="flex flex-wrap mt-3 w-64 space-x-1">
              {selectedDays.map((day) => (
                <DayItem key={day} Day={day} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function DayItem({ Day }) {
    return (
      <div
        onClick={() =>
          setSelectedDays(selectedDays.filter((day) => day != Day))
        }
        className="text-sm bg-black text-white rounded-full px-2.5 py-1.5 w-fit hover:bg-red-500 hover:line-through cursor-pointer mt-1.5"
      >
        {Day}
      </div>
    );
  }
}
