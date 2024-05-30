import Dropdown from "react-dropdown";
import caret from "../../assets/caret-down-solid.svg";
import * as api from "../../api";
import { useState, useContext } from "react";
import { SchedulingContext } from "../../Pages/Scheduling";

export default function () {
  const contactOptions = ["Phone", "Email"];
  const [method, setMethod] = useState(contactOptions[0]);
  const [contactValue, setContactValue] = useState("");

  const {
    selectedStartTime,
    selectedEndTime,
    id,
    user_id,
    setIsScheduled,
    meetingDescription,
  } = useContext(SchedulingContext);

  return (
    <div className="mx-[7vw] space-x-14 xl:space-x-0 xl:space-y-7 flex xl:block xl:w-[400px] 2xl:w-[500px] xl:mx-5 xl:shadow-lg xl:border border-gray-300 rounded-lg py-10 px-8">
      {meetingDescription.length > 0 && (
        <div className="border-b pb-5">
          <div className="font-extrabold">Meeting Notes</div>
          <div className="w-64 xl:96 xl:w-full max-h-44 mt-3 overflow-y-scroll pr-5">
            {meetingDescription}
          </div>
        </div>
      )}
      <div>
        <div className="font-extrabold">Remind Me Via</div>
        <div className="mt-5">
          <Dropdown
            options={contactOptions}
            value={contactOptions[0]}
            onChange={(e) => {
              setMethod(e.value);
              setContactValue("");
            }}
            placeholder={"Select a Method"}
            className="mb-5"
            controlClassName="w-64 xl:w-72 border border-gray-300 shadow rounded-md p-2 px-3 cursor-pointer flex justify-between items-center"
            menuClassName="w-64 xl:w-72 border border-gray-300 shadow rounded-md p-2 px-3 space-y-2 cursor-pointer absolute bg-white"
            arrowClosed={<img src={caret} className="w-2" />}
            arrowOpen={<img src={caret} className="w-2 rotate-180" />}
          />
          {
            {
              Phone: (
                <input
                  type="number"
                  placeholder="Phone Number"
                  onChange={(e) => setContactValue(e.target.value)}
                  className="w-64 xl:w-72 border border-gray-300 shadow rounded-md p-2 px-3"
                />
              ),
              Email: (
                <input
                  placeholder="Email"
                  type="text"
                  onChange={(e) => setContactValue(e.target.value)}
                  className="w-64 xl:w-72 border border-gray-300 shadow rounded-md p-2 px-3"
                />
              ),
            }[method]
          }
          <br></br>
          <button
            onClick={() => {
              api
                .addCalendarEvent(
                  user_id,
                  id,
                  method,
                  contactValue,
                  selectedStartTime,
                  selectedEndTime
                )
                .then((res) => {
                  if (res.status === 200) {
                    setIsScheduled(true);
                    res.json().then((data) => {
                      console.log(data);
                    });
                  }
                });
            }}
            className="bg-black font-semibold text-white w-64 xl:w-full rounded-lg py-2 mt-7 hover:bg-gray-300 hover:text-black"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
