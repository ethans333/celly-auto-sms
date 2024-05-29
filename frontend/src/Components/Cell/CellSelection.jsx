import { Calendar } from "./Cells/Calendar/Calendar";
import legalserver from "../../assets/legalserver.svg";
import zoom from "../../assets/zoom-app.svg";
import microsoftteams from "../../assets/microsoftteams.svg";
import Premium from "../Popups/Premium";
import { useContext } from "react";
import { WorkspaceContext } from "../../Contexts/Workspace";

export default function () {
  const { setPopup } = useContext(WorkspaceContext);

  return (
    <div>
      <div className="selection-area">
        <h3 className="selection-cell-header mt-7">Add a Cell</h3>
        <div className="flex justify-center">
          <div className="absolute space-y-5">
            {new Calendar().selection()}
            <div className="py-7">
              <div className="border-t" />
            </div>
            <PremiumDisplayCell
              icon={legalserver}
              title="Legal Server"
              description="Legal Server Integration."
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
        className="rounded-lg shadow p-6 min-w-72 max-w-96 cursor-pointer bg-white w-fit"
      >
        <div className="flex">
          <img src={icon} className="w-10 p-2 mb-auto" />
          <h1 className="pt-2 font-bold text-[15px] pl-1.5">{title}</h1>
          <div className="ml-auto font-bold mb-auto w-fit bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm px-2 py-1.5 rounded rotate-6 translate-x-10 -translate-y-7 shadow-lg shadow-indigo-500/50">
            Premium
          </div>
        </div>
        <div className="text-sm py-7 text-xs px-5 text-gray-600">
          {description}
        </div>
      </div>
    );
  }
}
