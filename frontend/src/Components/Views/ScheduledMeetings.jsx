import eye from "../../assets/eye-solid.svg";
import square from "../../assets/square-regular.svg";
import numbers from "../../assets/numbers.json";
import { useEffect, useState, useContext } from "react";
import { WorkspaceContext } from "../../Contexts/Workspace";
import { HelpersContext } from "../../Contexts/Helpers";

export default function () {
  const { workspaceMetaData, scheduledMeetingsIsLoading } =
    useContext(WorkspaceContext);
  const { getScheduledMeetings } = useContext(HelpersContext);

  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    getScheduledMeetings().then((m) => {
      console.log(m);
      setMeetings(m);
    });
  }, []);

  return (
    <div>
      <div className="flex justify-center">
        <div className="mt-[15vh] overflow-y-scroll max-h-[80vh] p-5">
          <div className="relative overflow-x-auto shadow-md border pt-5 sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-sm text-black">
                <tr>
                  <th scope="col" className="px-6 py-3 tracking-wide"></th>
                  <th scope="col" className="px-6 py-3 tracking-wide">
                    Meeting
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wide">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wide">
                    Length
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wide">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wide"></th>
                </tr>
              </thead>
              {scheduledMeetingsIsLoading ? (
                <tbody>
                  {Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <LoadingRow key={i} i={i} />
                    ))}
                </tbody>
              ) : meetings.length == 0 ? (
                <tbody>
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 font-medium text-center"
                    >
                      No meetings scheduled
                    </td>
                  </tr>
                </tbody>
              ) : (
                meetings.map((m, i) => (
                  <Row
                    key={i}
                    background={i % 2 == 0}
                    {...m}
                    time={new Date(parseInt(m.start_time))}
                  />
                ))
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  background,
  workspace_name,
  contact_value,
  start_time,
  end_time,
  time,
}) {
  const { setSidebar } = useContext(WorkspaceContext);

  console.log(time.getHours());

  const dateOptions = {
    weekday: "long",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  };
  const dateString = time.toLocaleDateString("en-us", dateOptions);

  const hourOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  };
  const timeString = time.toLocaleTimeString("en-us", hourOptions);

  const startDate = new Date(parseInt(start_time));
  const endDate = new Date(parseInt(end_time));
  const duration = (endDate - startDate) / 1000 / 60;

  return (
    <tr className={`${background && "bg-[#fdfdfd]"}`}>
      <td className="px-6 py-4 w-16">
        <img
          src={square}
          className="w-4 h-4 mx-auto cursor-pointer hover:opacity-50"
        />
      </td>
      <th
        scope="row"
        className="px-6 py-4 w-16 font-medium text-gray-900 whitespace-nowrap"
      >
        {workspace_name}
      </th>
      <td className="px-6 py-4">
        <div className="truncate max-w-48">{contact_value}</div>
      </td>
      <td className="px-6 py-4">
        <div className="w-fit">{timeString}</div>
      </td>
      <td className="px-6 py-4">
        <div className="w-fit">{duration} min</div>
      </td>
      <td className="px-6 py-4">
        <div className="w-fit">{dateString}</div>
      </td>
      <td className="px-6 py-4 w-16">
        <img
          src={eye}
          className="w-4 h-4 mx-auto cursor-pointer hover:opacity-50"
          onClick={() => setSidebar(<div>More Info</div>)}
        />
      </td>
    </tr>
  );
}

function LoadingRow({ i }) {
  return (
    <tr className={`${i % 2 == 0 && "bg-[#fdfdfd] animate-pulse"}`}>
      <td className="px-6 py-4 w-16">
        <div className="w-4 h-4"></div>
      </td>
      <th
        scope="row"
        className="px-6 py-4 w-16 font-medium text-gray-900 whitespace-nowrap"
      ></th>
      <td className="px-6 py-4">
        <div className="w-32"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-32"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-32"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-32"></div>
      </td>
      <td className="px-6 py-4 w-16">
        <div className="w-4 h-4"></div>
      </td>
    </tr>
  );
}
