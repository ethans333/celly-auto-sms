import Calendar from "../Components/Scheduling/Calendar";
import Dropdown from "react-dropdown";
import caret from "../assets/caret-down-solid.svg";
import * as api from "../api";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function () {
  const contactOptions = ["Phone", "Email"];

  const [method, setMethod] = useState(contactOptions[0]);
  const [events, setEvents] = useState([]);
  const [workspace, setWorkspace] = useState({});
  let { user_id, id } = useParams();

  useEffect(() => {
    api.getMicrosoftCalendarEvents(user_id, id).then((res) => {
      res.json().then((data) => {
        console.log(data);
        setEvents(data["events"]);
        setWorkspace(data["workspace"]);
      });
    });
  }, []);

  return (
    <div className="xl:flex xl:w-[1280px] 2xl:w-[1536px] mx-auto mt-[3vw]">
      <Calendar events={events} workspace={workspace} />

      <div className="mx-[7vw] xl:w-[400px] 2xl:w-[500px] xl:mx-5 xl:shadow-lg rounded-lg py-10 px-8">
        <div className="font-extrabold">Enter Your Phone or Email</div>
        <div className="mt-5">
          <Dropdown
            options={contactOptions}
            value={contactOptions[0]}
            onChange={(e) => setMethod(e.value)}
            placeholder={"Select a Method"}
            className="mb-5"
            controlClassName="w-64 xl:w-60 border border-gray-300 shadow rounded-md p-2 px-3 cursor-pointer flex justify-between items-center"
            menuClassName="w-64 xl:w-60 border border-gray-300 shadow rounded-md p-2 px-3 space-y-2 cursor-pointer absolute bg-white"
            arrowClosed={<img src={caret} className="w-2" />}
            arrowOpen={<img src={caret} className="w-2 rotate-180" />}
          />
          {
            {
              Phone: (
                <input
                  type="number"
                  placeholder="Phone Number"
                  className="w-64 xl:w-60 border border-gray-300 shadow rounded-md p-2 px-3"
                />
              ),
              Email: (
                <input
                  placeholder="Email"
                  type="text"
                  className="w-64 xl:w-60 border border-gray-300 shadow rounded-md p-2 px-3"
                />
              ),
            }[method]
          }
          <br></br>
          <button className="bg-black font-semibold text-white w-64 xl:w-full rounded-lg py-2 mt-7 hover:bg-green-300 hover:text-black">
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
