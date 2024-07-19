import { Calendar } from "./Cells/Calendar/Calendar";
import { WindowScheduling } from "./Cells/WindowScheduling/WindowScheduling";
import legalserver from "../../assets/legalserver.svg";
import zoom from "../../assets/zoom-app.svg";
import microsoftteams from "../../assets/microsoftteams.svg";
import Premium from "../Popups/Premium";
import texting from "../../assets/comments-solid.svg";
import { useContext } from "react";
import { WorkspaceContext } from "../../Contexts/Workspace";

export default function () {
  const { setPopup } = useContext(WorkspaceContext);

  return (
    <div className="overflow-y-scroll overflow-x-visible w-fit px-5">
      <h3 className="font-black text-lg mt-7 pb-3">Add a Cell</h3>
      <div className="flex justify-center">
        <div className="space-y-5 pb-5">
          {new Calendar().selection()}
          {new WindowScheduling().selection()}
          <div className="py-7">
            <div className="border-t" />
          </div>
          <PremiumDisplayCell
            icon={legalserver}
            title="LegalServer"
            description="LegalServer Integration."
          />
          <PremiumDisplayCell
            icon={texting}
            title="SMS"
            description="Collect data via SMS."
          />
          <PremiumDisplayCell
            icon={microsoftteams}
            title="Microsoft Teams"
            description="Integrate Scheduling with Teams."
          />
          <PremiumDisplayCell
            icon={zoom}
            title="Zoom"
            description="Integrate Scheduling with Zoom."
          />
        </div>
      </div>
    </div>
  );

  function PremiumDisplayCell({ icon, title, description }) {
    return (
      <div
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault();
          setPopup(<Premium />);
        }}
        style={{
          boxShadow: "0px 0px 10px rgb(79, 70, 229, 0.2)",
          userSelect: "none",
        }}
        className="rounded-lg shadow p-6 min-w-72 cursor-pointer bg-white"
      >
        <div className="flex">
          <img src={icon} className="w-10 p-2 mb-auto" />
          <h1 className="pt-2 font-bold text-[15px] pl-1.5">{title}</h1>
          <div className="ml-auto font-extrabold mb-auto w-fit bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-2 py-1.5 rounded rotate-6 translate-x-10 -translate-y-7 shadow-lg shadow-indigo-500/50">
            Core<a className="ml-[1px]">+</a>
          </div>
        </div>
        <div className="text-sm py-7 text-xs px-5 text-gray-600">
          {description}
        </div>
      </div>
    );
  }
}
