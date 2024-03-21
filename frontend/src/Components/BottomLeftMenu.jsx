import { useContext } from "react";
import { WorkspaceContext } from "../Pages/Home";

export default function () {
  const { messageStack } = useContext(WorkspaceContext);

  return (
    <div className="flex pr-5 h-full">
      <div className="mt-auto mb-20 ml-5">
        {messageStack.map((m, i) => (
          <p
            key={i}
            className={`text-sm ${
              {
                error: "text-red-500",
                success: "text-gray-300",
              }[m.type]
            }`}
          >
            {m.message}
          </p>
        ))}
      </div>
    </div>
  );
}
