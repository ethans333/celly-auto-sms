import xmark from "../assets/xmark-solid.svg";
import { useContext } from "react";
import { WorkspaceContext } from "../App";

export default function () {
  const { setCurrentView } = useContext(WorkspaceContext);

  return (
    <div className="absolute left-0 h-screen min-w-96 border-r-2 border-gray-100 bg-white px-5 pt-3 z-20">
      <div>
        <img
          src={xmark}
          className="x-button"
          //   onClick={() => setSideBarChildren(null)}
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
          <ProjectLabel emoji="📈" name="Analytics" />
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
