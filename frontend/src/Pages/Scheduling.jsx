import Calendar from "../Components/Scheduling/Calendar";
import SchedulingMenu from "../Components/Scheduling/SchedulingMenu";
import { useState, useEffect, createContext } from "react";
import { useParams } from "react-router-dom";
import * as api from "../api";
import Scheduled from "../Components/Scheduling/Scheduled";
import { Schedule } from "@mui/icons-material";

export const SchedulingContext = createContext();

export default function () {
  const [events, setEvents] = useState([]);
  const [workspace, setWorkspace] = useState({});
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [isScheduled, setIsScheduled] = useState(false);

  // constants
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);
  const [meetingDescription, setMeetingDescription] = useState("");

  let { user_id, id } = useParams();

  useEffect(() => {
    api.getMicrosoftCalendarEvents(user_id, id).then((res) => {
      res.json().then((data) => {
        console.log(data);
        setMeetingDescription(data["meeting_description"]);
        setStartHour(data["start_time"]);
        setEndHour(data["end_time"]);
        setEvents(data["events"]);
        setWorkspace(data["workspace"]);
      });
    });
  }, []);

  return (
    <SchedulingContext.Provider
      value={{
        selectedStartTime,
        setSelectedStartTime,
        selectedEndTime,
        setSelectedEndTime,
        setIsScheduled,
        events,
        workspace,
        id,
        user_id,
        startHour,
        endHour,
        meetingDescription,
      }}
    >
      {isScheduled ? (
        <Scheduled />
      ) : (
        <div className="xl:flex xl:w-[1280px] 2xl:w-[1536px] mx-auto mt-[3vw]">
          <Calendar />
          <SchedulingMenu />
        </div>
      )}
    </SchedulingContext.Provider>
  );
}
