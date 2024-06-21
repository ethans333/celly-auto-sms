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
  const [meetingDescription, setMeetingDescription] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");

  const [meetingWindowStartHour, setMeetingWindowStartHour] = useState("09");
  const [meetingWindowStartMinute, setMeetingWindowStartMinute] =
    useState("00");
  const [meetingWindowEndHour, setMeetingWindowEndHour] = useState("05");
  const [meetingWindowEndMinute, setMeetingWindowEndMinute] = useState("00");

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
      meeting_title: meetingTitle,
    });
  }, [meetingDescription, meetingTitle]);

  useEffect(() => {
    setMeetingTitle(self.state.meeting_title);
    setMeetingDescription(self.state.meeting_description);

    let s = self.state.start_time;
    let e = self.state.end_time;

    console.log(s, e);

    setStartAMPM(s < 12 ? "AM" : "PM");
    setEndAMPM(e < 12 ? "AM" : "PM");

    // Start Time

    setMeetingWindowStartHour((p) =>
      parseHour((Math.floor(s) % 12).toString(), p)
    );

    setMeetingWindowStartMinute((p) =>
      parseMinute(Math.floor((s % 1) * 60).toString(), p)
    );

    // End Time

    setMeetingWindowEndHour((p) =>
      parseHour((Math.floor(e) % 12).toString(), p)
    );

    setMeetingWindowEndMinute((p) =>
      parseMinute(Math.floor((e % 1) * 60).toString(), p)
    );

    let bdays = self.state.blackout_days;

    setSelectedDays(bdays.map((day) => dow[day]));
  }, []);

  useEffect(() => {
    let start = 0;
    const startIsAM = startAMPM == "AM";
    let end = 0;
    const endIsAM = endAMPM == "AM";

    start = parseInt(meetingWindowStartHour) + (startIsAM ? 0 : 12);
    end = parseInt(meetingWindowEndHour) + (endIsAM ? 0 : 12);

    start += parseInt(meetingWindowStartMinute) / 60;
    end += parseInt(meetingWindowEndMinute) / 60;

    if (start >= end) return;

    console.log(start, end);

    self.setState({
      start_time: start,
      end_time: end,
    });
  }, [
    meetingWindowStartHour,
    meetingWindowStartMinute,
    meetingWindowEndHour,
    meetingWindowEndMinute,
    startAMPM,
    endAMPM,
  ]);

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
    const days = selectedDays.map((day) => dow.indexOf(day));

    self.setState({
      blackout_days: days,
    });
  }, [
    selectedDays,
    meetingWindowStartHour,
    meetingWindowStartMinute,
    meetingWindowEndHour,
    meetingWindowEndMinute,
    startAMPM,
    endAMPM,
  ]);

  return (
    <div className="w-full flex flex-col space-y-2">
      <p className="font-extrabold text-lg mb-3 mt-7">Modify Scheduling</p>
      {isLoading ? (
        <mb.Loading />
      ) : isLinked ? (
        <mb.AlreadyLinked />
      ) : (
        <mb.LinkToGraph />
      )}

      <div className="pt-7 space-y-5">
        <div>
          <p className="font-bold">Meeting Title</p>
          <div className="mt-3 flex space-x-3">
            <input
              placeholder="Title"
              type="text"
              value={meetingTitle}
              onChange={(e) => {
                setMeetingTitle(e.target.value);
              }}
              className="w-full border border-gray-100 border-2 rounded-md px-3 py-1.5 text-sm"
            />
          </div>
        </div>
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
            {/* Start Hour */}
            <div className="w-fit border border-gray-100 border-2 rounded-md px-2 text-sm flex pt-[1px]">
              <input
                placeholder="00"
                value={meetingWindowStartHour}
                onChange={(e) => {
                  setMeetingWindowStartHour((p) =>
                    parseHour(e.target.value, p)
                  );
                }}
                className="w-[17px] outline-none"
              />
              <div className="px-[3px] pt-[2.5px]">:</div>
              <input
                placeholder="00"
                onChange={(e) => {
                  setMeetingWindowStartMinute((p) =>
                    parseMinute(e.target.value, p)
                  );
                }}
                value={meetingWindowStartMinute}
                className="w-[17px] outline-none"
              />
            </div>
            <Dropdown
              values={["AM", "PM"]}
              current={startAMPM}
              setCurrent={(v) => setStartAMPM(v)}
            />
            <p className="p-1">-</p>
            {/* End Hour */}
            <div className="w-fit border border-gray-100 border-2 rounded-md px-2 text-sm flex  pt-[1px]">
              <input
                placeholder="00"
                value={meetingWindowEndHour}
                onChange={(e) => {
                  setMeetingWindowEndHour((p) => parseHour(e.target.value, p));
                }}
                className="w-[17px] outline-none"
              />
              <div className="px-[3px] pt-[2.5px]">:</div>
              <input
                placeholder="00"
                onChange={(e) => {
                  setMeetingWindowEndMinute((p) =>
                    parseMinute(e.target.value, p)
                  );
                }}
                value={meetingWindowEndMinute}
                className="w-[17px] outline-none"
              />
            </div>
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

  function parseHour(v, old) {
    if (parseInt(v) == 0) {
      return "00";
    }

    if ((isNaN(v) && v !== "") || parseInt(v) > 12) {
      return old;
    }

    if (v.length > 2) {
      return v.slice(1);
    }

    if (parseInt(v) < 10 && parseInt(v) != 0) {
      v = "0" + v;
    }

    return v;
  }

  function parseMinute(v, old) {
    if ((isNaN(v) && v !== "") || parseInt(v) > 59 || parseInt(v) < 0) {
      return old;
    }

    if (v.length == 1 && parseInt(v) != 0 && parseInt(v) < 10) {
      v = "0" + v;
    } else if (v.length > 2) {
      v = v.slice(1);
    } else if (v == "0") {
      v = "00";
    }

    return v;
  }
}
