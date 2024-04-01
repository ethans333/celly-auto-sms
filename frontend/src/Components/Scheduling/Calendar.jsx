import { useParams } from "react-router-dom";
import { useState } from "react";

export default function () {
  let { id } = useParams();

  const startHour = 9;
  const endHour = 18;

  const [weekShift, setWeekShift] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(getWeek(weekShift));
  const [selectedDates, setSelectedDates] = useState([]);

  return (
    <div className="w-full shadow-lg rounded-lg p-10">
      <div className="w-[90%] xl:w-full mx-auto">
        <div className="flex w-full">
          <div className="grid grid-cols-8 grid-rows-40 grid-rows w-full h-fit space-x-2">
            <div className="">
              <div className="invisible">
                <DateHeader DayofTheWeek={"Day"} DayofTheMonth={"Date"} />
              </div>
              {...TimeLabelColumn()}
            </div>
            {...currentWeek.map((d) => (
              <div key={d}>
                <DateHeader
                  DayofTheMonth={new Date(d).getDate()}
                  DayofTheWeek={
                    {
                      0: "Sunday",
                      1: "Monday",
                      2: "Tuesday",
                      3: "Wednesay",
                      4: "Thursday",
                      5: "Friday",
                      6: "Saturday",
                    }[new Date(d).getDay()]
                  }
                />
                {...TimeColumn(d)}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-50 border"></div>
          <div className="text-sm ml-2">Available</div>
          <div className="w-3 h-3 ml-5 bg-green-200 border"></div>
          <div className="text-sm ml-2">Selected</div>
          <div className="w-3 h-3 ml-5 bg-red-200 border"></div>
          <div className="text-sm ml-2">Unavailable</div>
        </div>
      </div>
    </div>
  );

  function getWeek(weekShift) {
    let today = new Date(Date.now());
    today.setDate(today.getDate() + weekShift * 7);
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

  function TimeCell({ Time, Available = true }) {
    const [isSelected, setIsSelected] = useState(false);
    const h = Time.getHours();
    const m = Time.getMinutes();

    return (
      <div
        onClick={() => {
          if (Available) {
            setIsSelected(!isSelected);
            // setSelectedDates((prev) => [...prev, Time]);
          }
        }}
        className={`w-full ${isSelected ? "bg-green-200" : "bg-gray-50"} ${
          !Available && "bg-gray-950"
        }`}
      >
        <p className="cursor-pointer opacity-0 hover:opacity-100 text-gray-400 ml-2 text-sm">
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

  function TimeColumn(day) {
    let times = [];

    let hour = startHour;
    let minute = 0;

    for (let i = 0; i < (endHour - startHour) * 4 - 3; i++) {
      if (minute == 60) {
        hour++;
        minute = 0;
      }
      times.push(
        <TimeCell Time={new Date(day.setHours(hour, minute, 0, 0))} />
      );
      minute += 15;
    }

    return times;
  }
}
