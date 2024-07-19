import arrow from "../../assets/chevron-solid.svg";

export default function () {
  return (
    <div className="w-full border-r mr-5">
      <div className="mx-10 2xl:mx-24 mb-5">
        <div className="flex justify-between pt-5 xl:pt-12 pb-12">
          <div className="flex">
            <div className="font-black text-2xl px-3 py-1.5 rounded-lg ml-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg px-5 py-1">
              {/* {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
                currentWeek[0]
              )} */}
              Wednesday, July 19th
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="font-black text-2xl px-3 py-1.5 rounded-lg ml-3 mr-5 bg-gradient-to-r from-violet-500 to-indigo-500 inline-block text-transparent bg-clip-text">
              Meeting Title
            </div>
            <div
              //   onClick={() => {
              //     setWeekShift((p) => {
              //       if (p - 1 < 0) return p;

              //       setCurrentWeek(getWeek(p - 1));
              //       return p - 1;
              //     });
              //   }}
              className={`${
                0 - 1 < 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } bg-gray-200  flex items-center justify-center w-7 rounded-lg py-1 hover:opacity-50`}
            >
              <img src={arrow} className="w-3 h-3 rotate-180" />
            </div>

            <div
              //   onClick={() => {
              //     setWeekShift(0);
              //     setCurrentWeek(getWeek(0));
              //   }}
              className="font-extrabold text-sm bg-gray-200 flex items-center justify-center py-1.5 px-4 rounded-lg cursor-pointer hover:opacity-50"
            >
              Today
            </div>
            <div
              onClick={() => {
                // setWeekShift((p) => {
                //   setCurrentWeek(getWeek(p + 1));
                //   return p + 1;
                // });
              }}
              className="bg-gray-200 flex items-center justify-center w-7 rounded-lg py-1 cursor-pointer hover:opacity-50"
            >
              <img src={arrow} className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 w-fit mx-auto gap-5">
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <WindowCell
              start_time={Date.now() + i * 60 * 60 * 1000}
              end_time={Date.now() + (i + 1) * 60 * 60 * 1000}
              booked={i % 7 == 0}
            />
          ))}
      </div>
    </div>
  );
}

function WindowCell({ start_time, end_time, booked = false }) {
  start_time = getTime(start_time);
  end_time = getTime(end_time);

  const time = `${start_time} - ${end_time}`;

  return booked ? (
    <div className="rounded-xl shadow w-54 text-center px-7 py-7 bg-gradient-to-r from-violet-200 to-indigo-200 text-white font-bold cursor-not-allowed">
      <div>{time}</div>
    </div>
  ) : (
    <div className="rounded-xl shadow w-54 text-center px-7 py-7 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold cursor-pointer hover:opacity-50 shadow-lg shadow-indigo-300/50">
      <div>{time}</div>
    </div>
  );
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
