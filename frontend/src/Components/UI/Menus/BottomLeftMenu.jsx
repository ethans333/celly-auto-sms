import { useContext } from "react";
import { WorkspaceContext } from "../../../Contexts/Workspace";

export default function () {
  return (
    <div className="absolute bottom-0 pb-5 flex pr-5">
      <div className="mt-auto ml-5 w-[50vw]">
        {/* {messageStack.map((m, i) => (
          <p
            key={i}
            className={`text-sm ${
              {
                error: "text-red-500",
                success: "text-gray-400",
              }[m.type]
            }`}
          >
            {m.message}
          </p>
        ))} */}
      </div>
    </div>
  );
}
