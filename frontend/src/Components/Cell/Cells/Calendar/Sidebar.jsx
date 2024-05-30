import { WorkspaceContext } from "../../../../Contexts/Workspace.jsx";
import { useContext, useEffect, useState } from "react";
import * as mb from "../../../MicrosoftButtons.jsx";
import * as api from "../../../../api.jsx";
import Dropdown from "../../../Dropdown.jsx";

export default function ({ self }) {
  const { workspaceMetaData, setWorkspaceMetaData } =
    useContext(WorkspaceContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isLinked, setIsLinked] = useState(false);
  const [selectedDays, setSelectedDays] = useState(["Saturday", "Sunday"]);
  const [startAMPM, setStartAMPM] = useState("AM");
  const [endAMPM, setEndAMPM] = useState("PM");
  const [mwStart, setMwStart] = useState(9);
  const [mwEnd, setMwEnd] = useState(5);
  const [meetingDescription, setMeetingDescription] = useState("");

  const dow = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    self.setState({
      meeting_description: meetingDescription,
    });
    console.log(self);
    console.log(self.state.meeting_description);
  }, [meetingDescription]);

  useEffect(() => {
    setMeetingDescription(self.state.meeting_description);

    let s = self.state.start_time;
    let e = self.state.end_time;

    setStartAMPM(s < 12 ? "AM" : "PM");
    setEndAMPM(e < 12 ? "AM" : "PM");

    setMwStart(s < 12 ? s : s - 12);
    setMwEnd(e < 12 ? e : e - 12);

    let bdays = self.state.blackout_days;

    setSelectedDays(bdays.map((day) => dow[day]));
  }, []);

  useEffect(() => {
    api.tokenStatusMicrosoftESL().then((res) => {
      setIsLoading(false);

      if (res.status != 200) return;

      res.json().then((data) => {
        if (res.status == 200 && !data.is_expired) setIsLinked(true);
      });
    });
  }, [self]);

  useEffect(() => {
    if (mwStart == "" || mwEnd == "") return;

    const s = parseInt(mwStart) + (startAMPM == "AM" ? 0 : 12);
    const e = parseInt(mwEnd) + (endAMPM == "AM" ? 0 : 12);

    if (s >= e) return;

    const days = selectedDays.map((day) => dow.indexOf(day));

    self.setState((p) => ({
      meeting_window_start: s,
      meeting_window_end: e,
      blackout_days: days,
    }));
  }, [selectedDays, mwStart, mwEnd, startAMPM, endAMPM]);

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
          <p className="font-bold">Meeting Notes</p>
          <div className="mt-3 flex space-x-3">
            <textarea
              className="border border-gray-100 border-2 rounded-md px-3 py-3 text-sm w-full"
              placeholder="Optional"
              type="text"
              rows={5}
              value={meetingDescription}
              onChange={(e) => setMeetingDescription(e.target.value)}
            />
          </div>
        </div>
        <div>
          <p className="font-bold">Meeting Window</p>
          <div className="mt-3 flex space-x-3">
            <input
              placeholder="Start"
              type="text"
              value={mwStart}
              onChange={(e) => {
                let value = parseInt(e.target.value);

                if (
                  (isNaN(value) && e.target.value !== "") ||
                  value > 12 ||
                  value < 1
                )
                  return;

                setMwStart(e.target.value);
              }}
              className="w-[64px] border border-gray-100 border-2 rounded-md px-3 text-sm"
            />
            <Dropdown
              values={["AM", "PM"]}
              current={startAMPM}
              setCurrent={(v) => setStartAMPM(v)}
            />
            <p className="p-1">-</p>
            <input
              placeholder="End"
              type="text"
              value={mwEnd}
              onChange={(e) => {
                let value = parseInt(e.target.value);

                if (
                  (isNaN(value) && e.target.value !== "") ||
                  value > 12 ||
                  value < 1
                )
                  return;

                setMwEnd(e.target.value);
              }}
              className="w-[64px] border border-gray-100 border-2 rounded-md px-3 text-sm"
            />
            <Dropdown
              values={["AM", "PM"]}
              current={endAMPM}
              setCurrent={(v) => setEndAMPM(v)}
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
