import eye from "../../assets/eye-solid.svg";
import uncheck from "../../assets/square-regular.svg";
import check from "../../assets/square-check-solid.svg";
import ban from "../../assets/ban-solid.svg";
import eraser from "../../assets/eraser-solid.svg";
import { useEffect, useState, useContext } from "react";
import { WorkspaceContext } from "../../Contexts/Workspace";
import { HelpersContext } from "../../Contexts/Helpers";
import * as api from "../../api";

export default function () {
  const { workspaceMetaData, scheduledMeetingsIsLoading } =
    useContext(WorkspaceContext);
  const { getScheduledMeetings } = useContext(HelpersContext);

  const [meetings, setMeetings] = useState([]);
  const [selectedMeetings, setSelectedMeetings] = useState([]);
  const [meetingTitle, setMeetingTitle] = useState(
    workspaceMetaData?.workspace_name
  );

  useEffect(() => {
    fetchMeetings();
  }, [workspaceMetaData]);

  function fetchMeetings() {
    getScheduledMeetings(workspaceMetaData?.id).then((m) => {
      // Set meeting title
      if (m.length > 0) {
        setMeetingTitle(m[0].meeting_name);
      }

      // Get future meetings only
      const currentTime = new Date();
      const utcOffset = currentTime.getTimezoneOffset() * 60000;
      const currentTimeInUtc = new Date(currentTime - utcOffset);

      setMeetings(
        m.filter((mting) => {
          return parseInt(mting.end_time) > currentTimeInUtc.getTime();
        })
      );
    });
  }

  return (
    <div>
      <div className="flex justify-center">
        <div className="mt-[15vh] overflow-y-scroll max-h-[80vh] p-5">
          <div className="mb-4 flex h-8">
            <div className="text-lg font-black">
              Active Meetings for {meetingTitle}
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
                <div
                  onClick={() => {
                    api
                      .cancelScheduledMeetings(
                        workspaceMetaData?.id,
                        selectedMeetings
                      )
                      .then((r) => {
                        console.log(r);
                        fetchMeetings();
                        setSelectedMeetings([]);
                      });
                  }}
                  className="bg-red-500 text-xs font-semibold text-white px-3 py-[8px] rounded-lg flex space-x-2  cursor-pointer hover:opacity-50 h-fit"
                >
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
                  <th scope="col" className="px-6 py-3 tracking-wide w-16"></th>
                  <th scope="col" className="px-6 py-3 tracking-wide w-24">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 w-24">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wide w-24">
                    Length
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wide w-34">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wide">
                    Confirmations
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wide w-16"></th>
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
                      className="px-6 py-8 font-medium text-center"
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
    confirmations_confirmed,
    confirmations_sent,
    contact_value,
    start_time,
    end_time,
    time,
    meeting,
  }) {
    const { setSidebar } = useContext(WorkspaceContext);

    const { timeString, dateString } = convertTimestamp(time);

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
        <td className="px-6 py-4">
          <div className="truncate w-24">{contact_value}</div>
        </td>
        <td className="px-6 py-4">
          <div className="truncate w-24">{timeString}</div>
        </td>
        <td className="px-6 py-4">
          <div className="truncate w-24">{duration} min</div>
        </td>
        <td className="px-6 py-4">
          <div className="truncate w-34">{dateString}</div>
        </td>
        <td className="px-6 py-4 w-24">
          <div className="flex justify-center">
            <Confirmations
              n={confirmations_confirmed}
              total={confirmations_sent}
            />
          </div>
        </td>
        <td className="px-6 py-4 w-16">
          <img
            src={eye}
            className="w-4 h-4 mx-auto cursor-pointer hover:opacity-50"
            onClick={() =>
              setSidebar(<div>There is no info at this time.</div>)
            }
          />
        </td>
      </tr>
    );
  }
}

function Confirmations({ n, total }) {
  return (
    <div className="flex space-x-2 font-semibold text-gray-900">
      {n}/{total}
    </div>
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

function convertTimestamp(timestamp) {
  // Create a Date object using the timestamp in milliseconds
  const date = new Date(timestamp);

  // Get the hours, minutes, and AM/PM indicator
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours) as 12 AM

  // Format the timeString as HH:MM AM/PM with preceding zero if minute is a single digit
  const timeString = `${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${period}`;

  // Get the day, month, and year
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const year = date.getFullYear();

  // Format the dateString as MM/DD/YYYY with no preceding zeros
  const dateString = `${month}/${day}/${year}`;

  return { timeString, dateString };
}
