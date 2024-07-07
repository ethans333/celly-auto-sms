import { useContext } from "react";
import { SchedulingContext } from "../../Pages/Scheduling";

export default function () {
  const { selectedStartTime } = useContext(SchedulingContext);

  const date = new Date(selectedStartTime);

  function geth(h) {
    if (h > 12) return h - 12;
    else return h;
  }

  return (
    <div className="bg-gradient-to-t from-[rgba(168,85,247,0.07)] flex items-center justify-center pb-[25vh] h-screen">
      <div className="border border-200 shadow-lg rounded-xl px-14 pt-32 pb-16 bg-white text-center">
        <p className="text-8xl mb-20">🎉</p>
        <p className="text-xl">Your meeting has been scheduled for</p>

        <a className="font-black text-2xl bg-gradient-to-r from-violet-600 to-indigo-600 inline-block text-transparent bg-clip-text">
          {`${dow[date.getDay()]} ${
            months[date.getMonth()]
          } ${date.getDate()}th, 
          ${geth(date.getHours())}:${date.getMinutes()}${
            date.getMinutes() == 0 ? "0" : ""
          } ${date.getHours() > 11 ? "PM" : "AM"}`}
        </a>

        <div className="mt-20 text-gray-400">
          <p>Be on the look out for reminders!</p>
          <p>You may close this window.</p>
        </div>
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
