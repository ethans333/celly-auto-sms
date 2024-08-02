import Dropdown from "react-dropdown";
import caret from "../../assets/caret-down-solid.svg";
import * as api from "../../api";
import { useState, useContext } from "react";
import { SchedulingContext } from "../../Contexts/Scheduling";
import { SnackbarContext } from "../../Contexts/Snackbar";
import { HelpersContext } from "../../Contexts/Helpers";

export default function () {
  const contactOptions = ["Phone", "Email", "Phone & Email"]; // must match values in addCalendarEvent of backend
  const [method, setMethod] = useState(contactOptions[0]);
  const [contactValue, setContactValue] = useState("");
  const [secondContactValue, setSecondContactValue] = useState("");

  const { setSnackbarMessage } = useContext(SnackbarContext);
  const { validPhone, validEmail } = useContext(HelpersContext);

  const {
    selectedStartTime,
    selectedEndTime,
    id,
    user_id,
    setIsScheduled,
    meetingDescription,
    title,
  } = useContext(SchedulingContext);

  return (
    <div className="mx-[7vw] space-x-14 xl:space-x-0 xl:space-y-7 flex xl:block xl:w-[400px] 2xl:w-[500px] xl:mx-5 xl:shadow-lg xl:border border-gray-300 rounded-lg py-10 px-8">
      {meetingDescription.length > 0 && (
        <div className="xl:border-b pb-5">
          <div className="font-extrabold">Meeting Notes</div>
          <p
            style={{
              whiteSpace: "pre-wrap",
            }}
            className="w-64 xl:96 xl:w-full max-h-44 mt-3 overflow-y-scroll pr-5"
          >
            {meetingDescription}
          </p>
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
              "Phone & Email": (
                <div className="grid grid-cols-1 space-y-5">
                  <input
                    placeholder="Phone Number"
                    type="number"
                    onChange={(e) => setContactValue(e.target.value)}
                    className="w-64 xl:w-72 border border-gray-300 shadow rounded-md p-2 px-3"
                  />
                  <input
                    placeholder="Email"
                    type="text"
                    onChange={(e) => setSecondContactValue(e.target.value)}
                    className="w-64 xl:w-72 border border-gray-300 shadow rounded-md p-2 px-3"
                  />
                </div>
              ),
            }[method]
          }
          <br></br>
          <button
            onClick={() => {
              // normalize times to UTC
              const tzOffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
              let startTime = new Date(selectedStartTime - tzOffset).getTime();
              let endTime = new Date(selectedEndTime - tzOffset).getTime();

              if (startTime < 0 || endTime < 0) {
                setSnackbarMessage("No time selected");
                return;
              }

              // Check if valid contact info
              const cm = method.toLowerCase();

              switch (cm) {
                case "phone & email":
                  if (
                    !validPhone(contactValue) ||
                    !validEmail(secondContactValue)
                  ) {
                    setSnackbarMessage("Invalid Phone Number or Email");
                    return;
                  }
                  break;
                case "phone":
                  if (!validPhone(contactValue)) {
                    setSnackbarMessage("Invalid Phone Number");
                    return;
                  }
                  break;
                case "email":
                  if (!validEmail(contactValue)) {
                    setSnackbarMessage("Invalid Email");
                    return;
                  }
                  break;
              }

              api
                .addCalendarEvent(
                  user_id,
                  id,
                  method,
                  contactValue,
                  secondContactValue,
                  startTime,
                  endTime,
                  title
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
            className="bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white w-64 xl:w-full rounded-lg py-2 mt-7 hover:opacity-50 shadow-lg shadow-indigo-500/50"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
