import arrow from "../../assets/chevron-solid.svg";
import { SchedulingContext } from "../../Contexts/Scheduling";
import { useState } from "react";

import { useContext, useEffect } from "react";

export default function () {
  const {
    selectedStartTime,
    selectedEndTime,
    setSelectedStartTime,
    setSelectedEndTime,
    events,
    eventsIsLoading,
    workspace,
    startHour,
    endHour,
    blackoutDays,
    title,
    meetingLength,
  } = useContext(SchedulingContext);

  const oneday = 24 * 60 * 60 * 1000;
  const today = new Date().setHours(startHour, 0, 0, 0);
  const timeWindows = Math.floor(((endHour - startHour) * 60) / meetingLength);

  const [start, setStart] = useState(today); // where hour options start

  useEffect(() => {
    console.log(events);
  }, [
    selectedStartTime,
    selectedEndTime,
    setSelectedStartTime,
    setSelectedEndTime,
    events,
    eventsIsLoading,
    workspace,
    startHour,
    endHour,
    blackoutDays,
    title,
  ]);

  return (
    <div className="w-full border-r mr-5 xl:rounded-lg xl:shadow-lg xl:border">
      {/* Top Bar */}
      <div className="mx-10 2xl:mx-24 2xl:pt-8 pb-8 mb-12 border-b">
        <div className="flex justify-between pt-5 xl:pt-12 ">
          <div className="flex">
            <div className="font-black text-2xl px-3 py-1.5 rounded-lg ml-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg px-5 py-1">
              {new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              }).format(new Date(start))}
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="font-black text-2xl px-3 py-1.5 rounded-lg ml-3 mr-5 bg-gradient-to-r from-violet-500 to-indigo-500 inline-block text-transparent bg-clip-text">
              {title}
            </div>
            <div
              onClick={() => {
                if (start - oneday < today) return;
                setStart((p) => p - oneday);
              }}
              className={`${
                start - oneday < today
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              } bg-gray-200  flex items-center justify-center w-7 rounded-lg py-1 hover:opacity-50`}
            >
              <img src={arrow} className="w-3 h-3 rotate-180" />
            </div>
            <div
              onClick={() => setStart(today)}
              className="font-extrabold text-sm bg-gray-200 flex items-center justify-center py-1.5 px-4 rounded-lg cursor-pointer hover:opacity-50"
            >
              Today
            </div>
            <div
              onClick={() => {
                setStart((p) => p + oneday);
              }}
              className="bg-gray-200 flex items-center justify-center w-7 rounded-lg py-1 cursor-pointer hover:opacity-50"
            >
              <img src={arrow} className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 xl:grid-cols-2 w-3/4 mx-auto gap-5 mb-16 xl:mb-24">
        {Array(timeWindows > 0 ? timeWindows : 0)
          .fill(0)
          .map((_, i) => {
            const s = start + i * meetingLength * 60 * 1000;
            const e = start + (i + 1) * meetingLength * 60 * 1000;
            return (
              <WindowCell
                key={i}
                start_time={s}
                end_time={e}
                booked={!isAvailable(s, events, blackoutDays)}
              />
            );
          })}
      </div>
    </div>
  );

  function WindowCell({ start_time, end_time, booked = false }) {
    const time = `${getTime(start_time)} - ${getTime(end_time)}`;

    return booked ? (
      <div className="rounded-xl shadow w-full text-center px-7 py-7 bg-gradient-to-r from-violet-200 to-indigo-200 text-white font-bold cursor-not-allowed">
        <div>{time}</div>
      </div>
    ) : (
      <div
        onClick={() => {
          if (selectedStartTime == start_time) {
            setSelectedStartTime(null);
            setSelectedEndTime(null);
            return;
          }
          setSelectedStartTime(start_time);
          setSelectedEndTime(end_time);
        }}
        className={`rounded-xl shadow w-full text-center px-7 py-7 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold cursor-pointer hover:opacity-50 shadow-lg shadow-indigo-300/50 ${
          selectedStartTime === start_time &&
          "bg-gradient-to-r from-blue-400 to-cyan-400 animate-[grow_0.1s_ease-in-out_forwards] text-pink-100"
        }`}
      >
        <div>{time}</div>
      </div>
    );
  }
}

function getTime(milliseconds) {
  const date = new Date(milliseconds);
  let hours = date.getHours().toString().padStart(2, "0") % 12;
  if (hours == 0) hours = 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() < 12 ? "AM" : "PM";
  const time = `${hours}:${minutes} ${ampm}`;
  return time;
}

function isAvailable(time, events, blackout_days) {
  let available = true;

  events.forEach((event) => {
    if (
      (time >= event.start && time <= event.end) ||
      time < new Date().getTime() ||
      blackout_days.includes(new Date(time).getDay())
    ) {
      available = false;
    }
  });

  return available;
}
