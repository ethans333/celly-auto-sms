import xmark from "../../../assets/xmark-solid.svg";
import angles from "../../../assets/angles-right-solid.svg";
import { useContext, useEffect, useState } from "react";
import { WorkspaceContext } from "../../../Contexts/Workspace.jsx";
import TopLeftMenu from "../Menus/TopLeftMenu.jsx";
import BottomLeftMenu from "../Menus/BottomLeftMenu.jsx";
import { AccountTree, TableChart, SsidChart } from "@mui/icons-material";
import { HelpersContext } from "../../../Contexts/Helpers.jsx";

export default function () {
  const { setCurrentView, workspaceList, favoriteWorkspaceList, Views } =
    useContext(WorkspaceContext);
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
          <p className="font-extrabold mt-7">This Project</p>
          <div className="space-y-3 mt-3 ml-1">
            <ProjectLabel
              icon={
                <AccountTree
                  sx={{ fontSize: 20, paddingTop: 0.4, marginRight: 0.5 }}
                />
              }
              name="Project View"
              onClick={() => setCurrentView(Views.Project)}
            />
            <ProjectLabel
              icon={
                <TableChart
                  sx={{ fontSize: 20, paddingTop: 0.4, marginRight: 0.5 }}
                />
              }
              name="Registered Numbers"
              onClick={() => setCurrentView(Views.RegisteredNumbers)}
            />
            <ProjectLabel
              icon={
                <SsidChart
                  sx={{ fontSize: 20, paddingTop: 0.4, marginRight: 0.5 }}
                />
              }
              name="Analytics"
              onClick={() => setCurrentView(Views.RegisteredNumbers)}
            />
          </div>

          <p className="font-extrabold mt-8">Favorites</p>
          {/* Favorite Projects */}
          <div className="space-y-3 mt-3 ml-1">
            {mapWorkspaces(favoriteWorkspaceList)}
          </div>
          <p className="font-extrabold mt-8">Projects</p>
          {/* All Projects */}
          <div className="space-y-3 mt-3 ml-1">
            {mapWorkspaces(workspaceList)}
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

function mapWorkspaces(w) {
  const { setWorkspaceMetaData } = useContext(WorkspaceContext);

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
