import xmark from "../../../assets/xmark-solid.svg";
import TopMenu from "../Menus/TopRightMenu.jsx";
import BottomMenu from "../Menus/BottomRightMenu.jsx";
import { WorkspaceContext } from "../../../Contexts/Workspace.jsx";
import { useContext } from "react";

export default function ({ children, topChildren }) {
  const { setSidebar, currentView, Views } = useContext(WorkspaceContext);

  return children != null ? (
    // Open Sidebar
    <div className="absolute right-0 z-20 animate-shiftRL">
      <div className="flex h-screen overflow-hidden">
        <div>
          {currentView === Views.Project && <TopMenu />}
          {currentView === Views.Project && <BottomMenu />}
        </div>

        <div className="min-w-96 border-l-2 border-gray-100 bg-white px-5 pt-3 flex flex-col">
          <div className="w-full mb-3 flex justify-between items-center">
            {topChildren}
            <img
              src={xmark}
              className="x-button"
              onClick={() => setSidebar(null)}
            />
          </div>
          <div className="flex-1 overflow-y-scroll">
            <div className="bg-blue-300 absolute">{children}</div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // Closed Sidebar
    <div className="absolute right-0 h-screen">
      {currentView === Views.Project && <TopMenu />}
      {currentView === Views.Project && <BottomMenu />}
    </div>
  );
}
