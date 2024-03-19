import xmark from "../assets/xmark-solid.svg";
import TopMenu from "./TopMenu.jsx";
import BottomMenu from "./BottomMenu.jsx";
import { WorkspaceContext } from "../Pages/Home.jsx";
import { useContext } from "react";

export default function ({ children, topChildren }) {
  const { setSideBarChildren, currentView } = useContext(WorkspaceContext);

  return children != null ? (
    <div className="absolute right-0 z-20 animate-shiftRL">
      <div className="flex h-screen">
        <div>
          {currentView == "project" && <TopMenu />}
          {currentView == "project" && <BottomMenu />}
        </div>

        <div className="min-w-96 border-l-2 border-gray-100 bg-white px-5 pt-3">
          <div className="w-full mb-3 flex">
            {topChildren}
            <img
              src={xmark}
              className="x-button"
              onClick={() => setSideBarChildren(null)}
            />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  ) : (
    <div className="absolute right-0 h-screen">
      {currentView == "project" && <TopMenu />}
      {currentView == "project" && <BottomMenu />}
    </div>
  );
}
