import eye from "../../assets/eye-solid.svg";
import uncheck from "../../assets/square-regular.svg";
import check from "../../assets/square-check-solid.svg";
import ban from "../../assets/ban-solid.svg";
import eraser from "../../assets/eraser-solid.svg";
import { useEffect, useState, useContext } from "react";
import { WorkspaceContext } from "../../Contexts/Workspace";
import { HelpersContext } from "../../Contexts/Helpers";

export default function () {
  const { workspaceMetaData, scheduledMeetingsIsLoading } =
    useContext(WorkspaceContext);
  const { getScheduledMeetings } = useContext(HelpersContext);

  const [meetings, setMeetings] = useState([]);
  const [selectedMeetings, setSelectedMeetings] = useState([]);

  useEffect(() => {
    console.log(workspaceMetaData);
    getScheduledMeetings(workspaceMetaData?.id).then((m) => {
      console.log(m);
      setMeetings(m);
    });
  }, [workspaceMetaData?.id]);

  return (
    <div>
      <div className="flex justify-center">
        <div className="mt-[15vh] overflow-y-scroll max-h-[80vh] p-5">
          <div className="mb-4 flex h-8">
            <div className="text-lg font-black">
              Active Meetings for {workspaceMetaData?.workspace_name}
            </div>

            {selectedMeetings.length > 0 && (
              <div className="ml-auto flex space-x-2">
                {/* Unselect Meetings */}
                <div
                  onClick={() => setSelectedMeetings([])}
                  className="bg-gray-900 text-xs font-semibold text-white px-3 py-[8px] rounded-lg flex space-x-2  cursor-pointer hover:opacity-50 h-fit"
                >
                  <img src={eraser} className="w-4" />
                  <div>Unselect All</div>
                </div>
                {/* Cancel Meetings */}
                <div className="bg-red-500 text-xs font-semibold text-white px-3 py-[8px] rounded-lg flex space-x-2  cursor-pointer hover:opacity-50 h-fit">
                  <img src={ban} className="w-4" />
                  <div>Cancel Selected Meetings</div>
                </div>
              </div>
            )}
          </div>

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
              ) : meetings?.length == 0 ? (
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
                meetings?.map((m, i) => (
                  <Row
                    key={i}
                    background={i % 2 == 0}
                    {...m}
                    time={new Date(parseInt(m.start_time))}
                    meeting={m}
                  />
                ))
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  function Row({
    background,
    workspace_name,
    contact_value,
    start_time,
    end_time,
    time,
    meeting,
  }) {
    const { setSidebar } = useContext(WorkspaceContext);

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
            onClick={() => {
              setSelectedMeetings((p) => {
                const currentSelected =
                  selectedMeetings.filter((m) => m.id == meeting.id).length > 0;
                if (!currentSelected) {
                  return [...p, meeting];
                } else {
                  return p.filter((m) => m.id != meeting.id);
                }
              });
            }}
            src={
              selectedMeetings.filter((m) => m.id == meeting.id).length > 0
                ? check
                : uncheck
            }
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
