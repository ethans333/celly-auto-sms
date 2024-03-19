import plus from "../assets/plus-solid-white.svg";
import { useContext } from "react";
import { WorkspaceContext } from "../Pages/Home.jsx";

export default function () {
  const { setPopupChildren } = useContext(WorkspaceContext);

  return (
    <div className="flex pr-5 h-full">
      {/* Add Button */}
      <div
        onClick={() => {
          /*
                Create new project via api
                Set current project to new project
                Set default name to My New Project or something
            */
        }}
        className="bg-black p-3 rounded-lg h-fit mt-auto mb-20 ml-auto mr-5 cursor-pointer hover:opacity-50"
      >
        <img src={plus} className="w-3" alt="plus" />
      </div>
    </div>
  );
}
