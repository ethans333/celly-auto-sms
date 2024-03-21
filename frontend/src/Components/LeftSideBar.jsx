import xmark from "../assets/xmark-solid.svg";
import angles from "../assets/angles-right-solid.svg";
import { useContext, useEffect, useState } from "react";
import { WorkspaceContext } from "../Pages/Home.jsx";
import * as api from "../api.jsx";
import TopLeftMenu from "./TopLeftMenu.jsx";
import BottomLeftMenu from "./BottomLeftMenu.jsx";

export default function () {
  const { setCurrentView } = useContext(WorkspaceContext);
  const [showSideBar, setShowSideBar] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [favoriteWorkspaces, setFavoriteWorkspaces] = useState([]);

  useEffect(() => {
    api.getAllUserWorkspaces().then(async (res) => {
      if (res.status === 200) {
        const json = await res.json();
        setWorkspaces(json.workspaces);
        setFavoriteWorkspaces(json.workspaces.filter((ws) => ws.is_favorite));
      } else {
        console.log(res);
      }
    });
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
          <p className="font-semibold text-gray-500 tracking-wide mt-7">
            This Project
          </p>
          <div className="space-y-3 mt-3 ml-1">
            <ProjectLabel
              emoji="🔎"
              name="Project View"
              onClick={() => setCurrentView("cells")}
            />
            <ProjectLabel
              emoji="📞"
              name="Registered Numbers"
              onClick={() => setCurrentView("numbers")}
            />
            <ProjectLabel
              emoji="📈"
              name="Analytics"
              onClick={() => setCurrentView("analytics")}
            />
          </div>

          <p className="font-semibold text-gray-500 tracking-wide mt-8">
            Favorites
          </p>
          {/* Favorite Projects */}
          <div className="space-y-3 mt-3 ml-1">
            {mapWorkspaces(favoriteWorkspaces)}
          </div>
          <p className="font-semibold text-gray-500 tracking-wide mt-8">
            Projects
          </p>
          {/* All Projects */}
          <div className="space-y-3 mt-3 ml-1">{mapWorkspaces(workspaces)}</div>
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

function ProjectLabel({ emoji, name, onClick }) {
  return (
    <p
      className="font-semibold text-gray-800 cursor-pointer hover:opacity-50 max-w-64 truncate"
      onClick={onClick}
    >
      {emoji} {name}
    </p>
  );
}

function mapWorkspaces(w) {
  const { setWorkspaceMetaData } = useContext(WorkspaceContext);

  return w.map((ws) => {
    return (
      <ProjectLabel
        key={ws.id}
        emoji={ws.workspace_emoji}
        name={ws.workspace_name}
        onClick={() => setWorkspaceMetaData(ws)}
      />
    );
  });
}
