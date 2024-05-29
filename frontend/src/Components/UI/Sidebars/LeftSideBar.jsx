import xmark from "../../../assets/xmark-solid.svg";
import angles from "../../../assets/angles-right-solid.svg";
import { useContext, useEffect, useState } from "react";
import { WorkspaceContext } from "../../../Contexts/Workspace.jsx";
import TopLeftMenu from "../Menus/TopLeftMenu.jsx";
import BottomLeftMenu from "../Menus/BottomLeftMenu.jsx";
import diagram_project from "../../../assets/diagram-project-solid.svg";
import clock_regular from "../../../assets/clock-regular.svg";
import chart_simple from "../../../assets/chart-simple-solid.svg";
import { HelpersContext } from "../../../Contexts/Helpers.jsx";
import uuid from "react-uuid";

export default function () {
  const {
    setCurrentView,
    workspaceList,
    favoriteWorkspaceList,
    Views,
    loadingWorkspaceList,
    setWorkspaceMetaData,
    workspaceMetaData,
  } = useContext(WorkspaceContext);
  const { updateWorkspaceLists } = useContext(HelpersContext);

  const [showSideBar, setShowSideBar] = useState(true);

  useEffect(() => {
    updateWorkspaceLists();
  }, []);

  return showSideBar ? (
    <div className="flex absolute left-0">
      <div
        id="lsb"
        className="h-screen min-w-96 border-r-2 border-gray-100 bg-white px-5 pt-3 z-20 animate-shiftLR mr-6"
      >
        <div>
          <img
            src={xmark}
            className="x-button"
            onClick={() => setShowSideBar(false)}
          />
          <div
            style={{
              display:
                Object.keys(workspaceMetaData).length > 0 ? "block" : "none",
            }}
          >
            <p className="font-extrabold mt-7">This Project</p>
            <div className="space-y-3 mt-3 ml-1">
              <ProjectLabel
                icon={
                  <img
                    src={diagram_project}
                    alt="project"
                    className="ml-[1.7px] w-[15px] padding-top-[0.4rem] mr-[0.5rem]"
                  />
                }
                name="Project View"
                onClick={() => setCurrentView(Views.Project)}
              />
              <ProjectLabel
                icon={
                  <img
                    src={clock_regular}
                    alt="scheduled meetings"
                    className="ml-[1.7px] w-[15px] padding-top-[0.4rem] mr-[0.5rem]"
                  />
                }
                name="Scheduled Meetings"
                onClick={() => setCurrentView(Views.ScheduledMeetings)}
              />
              <ProjectLabel
                icon={
                  <img
                    src={chart_simple}
                    alt="analytics"
                    className="ml-[1.7px] w-[15px] padding-top-[0.4rem] mr-[0.5rem]"
                  />
                }
                name="Analytics"
                onClick={() => setCurrentView(Views.Analytics)}
              />
            </div>
          </div>

          {/* Workspaces List */}
          {favoriteWorkspaceList.length > 0 ||
            (loadingWorkspaceList && (
              <p className="font-extrabold mt-8">Favorites</p>
            ))}
          {/* Favorite Projects */}
          <div className="space-y-3 mt-3 ml-1">
            {loadingWorkspaceList ? (
              <WorkspacesListLoading n={3} />
            ) : (
              mapWorkspaces(favoriteWorkspaceList)
            )}
          </div>
          <p className="font-extrabold mt-8">Projects</p>
          {/* All Projects */}
          <div className="space-y-3 mt-3 ml-1">
            {loadingWorkspaceList ? (
              <WorkspacesListLoading />
            ) : workspaceList.length > 0 ? (
              mapWorkspaces(workspaceList)
            ) : (
              <p className="text-gray-500 text-center text-sm mt-16">
                No Projects Yet
              </p>
            )}
          </div>
        </div>
      </div>
      <div>
        <TopLeftMenu />
        <BottomLeftMenu />
      </div>
    </div>
  ) : (
    <div className="flex absolute left-0">
      <div
        id="lsb"
        className="h-screen flex flex-col justify-center items-center ml-3"
      >
        <img
          src={angles}
          className="w-4 cursor-pointer hover:opacity-50"
          onClick={() => setShowSideBar(true)}
        />
      </div>
      <div>
        <TopLeftMenu />
        <BottomLeftMenu />
      </div>
    </div>
  );

  function mapWorkspaces(w) {
    return w.map((ws) => {
      return (
        <ProjectLabel
          key={ws.id}
          icon={<div className="text-xs pt-1 mr-2">{ws.workspace_emoji}</div>}
          name={ws.workspace_name}
          onClick={() => setWorkspaceMetaData(ws)}
        />
      );
    });
  }
}

function ProjectLabel({ icon, name, onClick }) {
  return (
    <div
      className="font-semibold text-gray-800 cursor-pointer hover:opacity-50 max-w-64 truncate flex"
      onClick={onClick}
    >
      {icon}
      <div className="ml-1">{name}</div>
    </div>
  );
}

function WorkspacesListLoading({ n = 5 }) {
  const pills = [];

  for (let i = 0; i < n; i++) {
    pills.push(
      <div
        key={uuid()}
        style={{
          width: `${Math.max(256 * Math.random(), 64)}px`,
        }}
        className="h-3 bg-gray-200 animate-pulse rounded-md"
      />
    );
  }

  return pills;
}
