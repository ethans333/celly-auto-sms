import xmark from "../assets/xmark-solid.svg";
import angles from "../assets/angles-right-solid.svg";
import { useContext, useState } from "react";
import { WorkspaceContext } from "../Pages/Home.jsx";

export default function () {
  const { setCurrentView } = useContext(WorkspaceContext);
  const [showSideBar, setShowSideBar] = useState(true);

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
        <div className="space-y-3 mt-3 ml-1">
          <ProjectLabel emoji="🌲" name="Incididunt est" />
          <ProjectLabel emoji="♻️" name="Anim irure dolor anim ipsum" />
        </div>
        <p className="font-semibold text-gray-500 tracking-wide mt-8">
          Projects
        </p>
        <div className="space-y-3 mt-3 ml-1">
          <ProjectLabel emoji="🪧" name="Incididunt est" />
          <ProjectLabel emoji="🏡" name="Anim irure dolor anim ipsum" />
          <ProjectLabel emoji="📱" name="In non occaecat" />
          <ProjectLabel emoji="📣" name="Ullamco cillum laborum aliquip" />
        </div>
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
