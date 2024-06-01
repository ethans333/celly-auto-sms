import { useEffect, useState, useContext } from "react";
import arrow from "../../assets/chevron-solid.svg";
import { SchedulingContext } from "../../Pages/Scheduling";

export default function () {
  const [weekShift, setWeekShift] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(getWeek(weekShift));
  const [hoverTime, setHoverTime] = useState(null);

  const {
    selectedStartTime,
    selectedEndTime,
    setSelectedStartTime,
    setSelectedEndTime,
    events,
    workspace,
    startHour,
    endHour,
    blackoutDays,
    title,
  } = useContext(SchedulingContext);

  return (
    <div className="w-full border-b xl:border border-gray-300 xl:shadow-lg rounded-lg px-10 pb-10">
      <div className="w-[90%] xl:w-full mx-auto">
        <div className="w-full">
          <div className="flex justify-between pt-5 xl:pt-12 pb-12">
            <div className="font-black text-2xl">
              {title === "" ? workspace["workspace_name"] : title}
            </div>
            <div className="flex space-x-2">
              <div
                onClick={() => {
                  setWeekShift((p) => {
                    if (p - 1 < 0) return p;

                    setCurrentWeek(getWeek(p - 1));
                    return p - 1;
                  });
                }}
                className={`${
                  weekShift - 1 < 0
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                } bg-gray-200  flex items-center justify-center w-7 rounded-lg py-1 hover:opacity-50`}
              >
                <img src={arrow} className="w-3 h-3 rotate-180" />
              </div>

              <div
                onClick={() => {
                  setWeekShift(0);
                  setCurrentWeek(getWeek(0));
                }}
                className="font-extrabold text-sm bg-gray-200 flex items-center justify-center py-1.5 px-4 rounded-lg cursor-pointer hover:opacity-50"
              >
                Today
              </div>
              <div
                onClick={() => {
                  setWeekShift((p) => {
                    setCurrentWeek(getWeek(p + 1));
                    return p + 1;
                  });
                }}
                className="bg-gray-200 flex items-center justify-center w-7 rounded-lg py-1 cursor-pointer hover:opacity-50"
              >
                <img src={arrow} className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-8 grid-rows-40 grid-rows w-full h-fit space-x-2">
            <div className="">
              <div className="invisible">
                <DateHeader DayofTheWeek={"Day"} DayofTheMonth={"Date"} />
              </div>
              {...TimeLabelColumn()}
            </div>
            {...currentWeek.map((d) => <TimeColumn day={d} />)}
          </div>
        </div>
        <div className="flex items-center tracking-wide">
          <div className="w-3 h-3 bg-white border"></div>
          <div className="text-sm ml-2">Available</div>
          <div className="w-3 h-3 ml-5 bg-gray-100 border"></div>
          <div className="text-sm ml-2">Unavailable</div>
          <div className="w-3 h-3 ml-5 bg-green-200 border"></div>
          <div className="text-sm ml-2">Selected</div>
        </div>
      </div>
    </div>
  );

  function getWeek(weekShift) {
    let today = new Date(Date.now());
    today.setDate(today.getDate() + weekShift * 7 - today.getDay());
    const week = [];

    for (let i = 0; i < 7; i++) {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() + i);
      newDate.setHours(0, 0, 0, 0);
      week.push(newDate);
    }

    return week;
  }

  function DateHeader({ DayofTheWeek, DayofTheMonth }) {
    return (
      <div className="pb-5 bg-gray-100 rounded-xl pt-3 mb-8">
        <div className="text-center text-gray-800 text-sm">{DayofTheWeek}</div>
        <div className="text-center font-extrabold text-black text-2xl">
          {DayofTheMonth}
        </div>
      </div>
    );
  }

  // TimeCell
  function TimeCell({ Time, Available = true }) {
    let isSelected =
      selectedStartTime == Time.getTime() ||
      selectedEndTime == Time.getTime() ||
      (selectedStartTime <= Time.getTime() &&
        selectedEndTime >= Time.getTime()) ||
      (selectedStartTime <= Time.getTime() && hoverTime >= Time.getTime());

    if (selectedStartTime == null && selectedEndTime == null) {
      isSelected = false;
    }

    const h = Time.getHours();
    const m = Time.getMinutes();

    return (
      <div
        onClick={() => {
          if (!Available) return;

          if (selectedStartTime != null && selectedEndTime != null) {
            setSelectedStartTime(null);
            setSelectedEndTime(null);
            return;
          }

          if (selectedStartTime == null) {
            setSelectedStartTime(Time.getTime());
            return;
          } else {
            setSelectedEndTime(Time.getTime());
          }
        }}
        onMouseOver={() => {
          if (!Available) return;
          if (selectedStartTime == null) return;
          if (selectedStartTime != null && selectedEndTime != null) return;
          if (Time.getTime() <= selectedStartTime) return;
          if (Time.getDay() != new Date(selectedStartTime).getDay()) return;

          setHoverTime(Time.getTime());
        }}
        className={`w-full  ${m == 0 ? "border-t" : ""} ${
          Available
            ? `cursor-pointer  ${isSelected ? "bg-green-200" : "bg-white"}`
            : "bg-gray-50 cursor-not-allowed"
        }`}
      >
        <p
          style={{ visibility: Available ? "visible" : "hidden" }}
          className="opacity-0 hover:opacity-100 text-gray-400 ml-2 text-sm font-[550]"
        >
          {`${h > 12 ? h % 12 : h}:${!m ? "00" : m} ${h >= 12 ? "PM" : "AM"}`}
        </p>
      </div>
    );
  }

  function TimeLabelColumn() {
    let groups = [];

    let current = startHour; // start time

    for (let i = 0; i < endHour - startHour; i++) {
      groups.push(
        <div className="row-span-4">
          <div className="text-gray-400 text-sm text-right pr-6 font-semibold">
            {current == 12 ? 12 : current % 12} {current >= 12 ? "pm" : "am"}
          </div>
        </div>,
        <div className="row-span-4 text-sm invisible">XXXX</div>,
        <div className="row-span-4 text-sm invisible">XXXX</div>,
        <div className="row-span-4 text-sm invisible">XXXX</div>
      );
      current++;
    }

    return groups;
  }

  function TimeColumn({ day }) {
    return (
      <div key={day}>
        <DateHeader
          DayofTheMonth={new Date(day).getDate()}
          DayofTheWeek={
            {
              0: "Sunday",
              1: "Monday",
              2: "Tuesday",
              3: "Wednesday",
              4: "Thursday",
              5: "Friday",
              6: "Saturday",
            }[new Date(day).getDay()]
          }
        />
        {...Array.from({ length: (endHour - startHour) * 4 - 3 }, (_, i) => {
          const time = new Date(day);
          time.setHours(9 + Math.floor(i / 4), (i % 4) * 15, 0, 0);
          return <TimeCell Time={time} Available={isAvailable(time)} />;
        })}
      </div>
    );
  }

  function isAvailable(time) {
    if (time < new Date().getTime()) return false;

    // Between busy times
    if (events.filter((e) => e.start <= time && e.end >= time).length > 0)
      return false;

    if (Object.keys(workspace).length != 0) {
      const dow = new Date(time).getDay();

      if (blackoutDays.includes(dow)) return false;
    }

    return true;
  }
}
