import { useContext } from "react";
import { SchedulingContext } from "../../Pages/Scheduling";

export default function () {
  const { selectedStartTime } = useContext(SchedulingContext);

  const date = new Date(selectedStartTime);

  return (
    <div className="flex justify-center items-center h-screen w-full pb-48">
      <div className="text-3xl font-black w-[70vw] text-center">
        <p className="text-7xl mb-5">🎉</p>
        <p>Your meeting has been scheduled for</p>

        <p className="text-purple-500">
          {`${dow[date.getDay()]} ${
            months[date.getMonth()]
          } ${date.getDate()}th, 
          ${date.getHours() % 12}:${date.getMinutes()}${
            date.getMinutes() == 0 && "0"
          } ${date.getHours() > 11 ? "PM" : "AM"}`}
        </p>
      </div>
    </div>
  );
}

const dow = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
