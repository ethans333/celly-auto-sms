import xmark from "../assets/xmark-solid.svg";
import angles from "../assets/angles-right-solid.svg";
import { useContext, useEffect, useState } from "react";
import { WorkspaceContext } from "../Pages/Home.jsx";
import * as api from "../api.jsx";

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
    <div
      id="lsb"
      className="absolute left-0 h-screen min-w-96 border-r-2 border-gray-100 bg-white px-5 pt-3 z-20 animate-shiftLR"
    >
      <div>
        <img
          src={xmark}
          className="x-button"
          onClick={() => setShowSideBar(false)}
        />
        <p className="font-semibold text-gray-500 tracking-wide mt-8">
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
  ) : (
    <div
      id="lsb"
      className="absolute left-0 h-screen flex flex-col justify-center items-center ml-3"
    >
      <img
        src={angles}
        className="w-6 cursor-pointer hover:opacity-50"
        onClick={() => setShowSideBar(true)}
      />
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
  const emojis = [
    "🔬",
    "📚",
    "🎨",
    "🔧",
    "🚀",
    "💻",
    "🌐",
    "📈",
    "🔒",
    "🎵",
    "🎮",
    "📷",
    "🎥",
    "🌳",
    "🍔",
    "🏠",
    "🚗",
    "👔",
    "👟",
    "👓",
    "🎒",
    "🌂",
    "💄",
    "💍",
  ];

  const { setWorkspaceMetaData } = useContext(WorkspaceContext);

  return w.map((ws) => {
    return (
      <ProjectLabel
        key={ws.id}
        emoji={emojis[Math.floor(Math.random() * emojis.length)]}
        name={ws.workspace_name}
        onClick={() => setWorkspaceMetaData(ws)}
      />
    );
  });
}
