import { useParams } from "react-router-dom";
import { useState } from "react";

export default function () {
  let { id } = useParams();

  return (
    <div className="xl:w-[1024px] mx-auto">
      <h1>Scheduling</h1>
      <p>User ID: {id}</p>

      <div className="w-[80%] mx-auto">
        <div className="flex w-full">
          <div className="grid grid-cols-8 grid-rows-40 grid-rows w-full h-fit divide-x">
            <div className="divide-y divide-white">
              <div className="mb-5 mr-5">
                <div className="text-center font-bold text-xl">ECT</div>
                <div className="text-center text-gray-400">Time Zone</div>
              </div>
              <div className="row-span-4 invisible">XXXX</div>
              {...TimeLabelColumn()}
            </div>
            <div>
              <DateHeader DayofTheMonth={10} DayofTheWeek={"Sun"} />
              {...TimeColumn()}
            </div>
            <div>
              <DateHeader DayofTheMonth={11} DayofTheWeek={"Mon"} />
              {...TimeColumn()}
            </div>
            <div>
              <DateHeader DayofTheMonth={12} DayofTheWeek={"Tue"} />
              {...TimeColumn()}
            </div>
            <div>
              <DateHeader DayofTheMonth={13} DayofTheWeek={"Wed"} />
              {...TimeColumn()}
            </div>
            <div>
              <DateHeader DayofTheMonth={14} DayofTheWeek={"Thu"} />
              {...TimeColumn()}
            </div>
            <div>
              <DateHeader DayofTheMonth={15} DayofTheWeek={"Fri"} />
              {...TimeColumn()}
            </div>
            <div>
              <DateHeader DayofTheMonth={16} DayofTheWeek={"Sat"} />
              {...TimeColumn()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function DateHeader({ DayofTheWeek, DayofTheMonth }) {
    return (
      <div className="mb-5">
        <div className="text-center font-bold text-xl">{DayofTheMonth}</div>
        <div className="text-center text-gray-600">{DayofTheWeek}</div>
      </div>
    );
  }

  function TimeCell({ Time, divide }) {
    const [isSelected, setIsSelected] = useState(false);

    return (
      <div
        onMouseOver={(event) => {
          if (event.buttons === 1) {
            setIsSelected(!isSelected);
          }
        }}
        className={`w-full ${isSelected ? "bg-gray-50" : "bg-white"} border-t ${
          divide ? "border-gray-200" : "border-white"
        }`}
      >
        <p className="cursor-pointer opacity-0 hover:opacity-100 text-gray-400 ml-2">
          {Time}
        </p>
      </div>
    );
  }

  function TimeLabelColumn() {
    let groups = [];

    let current = 9; // start time

    for (let i = 0; i < 8; i++) {
      groups.push(
        <div className="row-span-4 invisible">XXXX</div>,
        <div className="row-span-4 invisible">XXXX</div>,
        <div className="row-span-4 invisible">XXXX</div>,
        <div className="row-span-4">
          <div className="text-gray-400">
            {current < 10 && 0}
            {current == 12 ? 12 : current % 12}:00 {current >= 12 ? "PM" : "AM"}
          </div>
        </div>
      );
      current++;
    }

    return groups;
  }

  function TimeColumn() {
    return [
      <TimeCell Time={"08:00 AM"} />,
      <TimeCell Time={"08:15 AM"} />,
      <TimeCell Time={"08:30 AM"} />,
      <TimeCell Time={"08:45 AM"} />,
      <TimeCell divide Time={"09:00 AM"} />,
      <TimeCell Time={"09:15 AM"} />,
      <TimeCell Time={"09:30 AM"} />,
      <TimeCell Time={"09:45 AM"} />,
      <TimeCell divide Time={"10:00 AM"} />,
      <TimeCell Time={"10:15 AM"} />,
      <TimeCell Time={"10:30 AM"} />,
      <TimeCell Time={"10:45 AM"} />,
      <TimeCell divide Time={"11:00 AM"} />,
      <TimeCell Time={"11:15 AM"} />,
      <TimeCell Time={"11:30 AM"} />,
      <TimeCell Time={"11:45 AM"} />,
      <TimeCell divide Time={"12:00 PM"} />,
      <TimeCell Time={"12:15 PM"} />,
      <TimeCell Time={"12:30 PM"} />,
      <TimeCell Time={"12:45 PM"} />,
      <TimeCell divide Time={"01:00 PM"} />,
      <TimeCell Time={"01:15 PM"} />,
      <TimeCell Time={"01:30 PM"} />,
      <TimeCell Time={"01:45 PM"} />,
      <TimeCell divide Time={"02:00 PM"} />,
      <TimeCell Time={"02:15 PM"} />,
      <TimeCell Time={"02:30 PM"} />,
      <TimeCell Time={"02:45 PM"} />,
      <TimeCell divide Time={"03:00 PM"} />,
      <TimeCell Time={"03:15 PM"} />,
      <TimeCell Time={"03:30 PM"} />,
      <TimeCell Time={"03:45 PM"} />,
      <TimeCell divide Time={"04:00 PM"} />,
      <TimeCell Time={"04:15 PM"} />,
      <TimeCell Time={"04:30 PM"} />,
      <TimeCell Time={"04:45 PM"} />,
      <TimeCell divide Time={"05:00 PM"} />,
    ];
  }
}
