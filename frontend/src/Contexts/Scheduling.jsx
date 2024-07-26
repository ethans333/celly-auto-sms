import { useState, useEffect, createContext } from "react";
import { useParams } from "react-router-dom";
import * as api from "../api";
import Scheduled from "../Components/Scheduling/Scheduled";

export const SchedulingContext = createContext();

export function SchedulingProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [workspace, setWorkspace] = useState({});
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [eventsIsLoading, setEventsIsLoading] = useState(true);

  // constants
  const [title, setTitle] = useState("");
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);
  const [meetingDescription, setMeetingDescription] = useState("");
  const [blackoutDays, setBlackoutDays] = useState([0, 6]);
  const [meetingLength, setMeetingLength] = useState(-1);

  let { user_id, id } = useParams();

  useEffect(() => {
    api.getMicrosoftCalendarEvents(user_id, id).then((res) => {
      res.json().then((data) => {
        console.log(data);
        setEventsIsLoading(false);
        setMeetingDescription(data["meeting_description"]);
        setStartHour(parseFloat(data["start_time"]));
        setEndHour(parseFloat(data["end_time"]));
        setEvents(data["events"]);
        setWorkspace(data["workspace"]);
        setBlackoutDays(data["blackout_days"]);
        setTitle(data["meeting_title"]);
        setMeetingLength(data["meeting_length"]);
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
        eventsIsLoading,
        events,
        workspace,
        id,
        user_id,
        startHour,
        endHour,
        meetingDescription,
        blackoutDays,
        title,
        meetingLength,
      }}
    >
      {isScheduled ? <Scheduled /> : <>{children}</>}
    </SchedulingContext.Provider>
  );
}
