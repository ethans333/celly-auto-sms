import React, { useEffect, useState, useContext } from "react";
import { WorkspaceContext } from "../../Pages/Home.jsx";

export default function ({ id, start, end }) {
  const { setWorkspace } = useContext(WorkspaceContext);

  const a = {
    x: start.x < end.x ? 0 : start.x - end.x,
    y: start.y < end.y ? 0 : start.y - end.y,
  };

  const b = {
    x: start.x < end.x ? end.x - start.x : 0,
    y: start.y < end.y ? end.y - start.y : 0,
  };

  const mid1 = {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };

  const offset = {
    x: (a.x - b.x) * 0.3,
    y: (a.y - b.y) * 0.3,
  };

  const c1 = {
    x: mid1.x - offset.y,
    y: mid1.y + offset.x,
  };

  const c2 = {
    x: mid1.x + offset.y,
    y: mid1.y - offset.x,
  };

  const [dashoffset, strokeDashoffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      strokeDashoffset((p) => p - 0.1);
    }, 5);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <svg
        fill="white"
        stroke="black"
        strokeWidth={5}
        className="absolute -z-50"
        style={{
          width: Math.max(Math.abs(start.x - end.x)),
          height: Math.abs(start.y - end.y),
          top: Math.min(start.y, end.y) + start.width / 2,
          left: Math.min(start.x, end.x) + start.width / 2,
          overflow: "visible",
        }}
      >
        <path
          onClick={() => {
            // Delete curve
            const [s, e] = id.split("#");
            setWorkspace((p) => {
              delete p[s.split("$")[0]].nodes[s].next[e];
              delete p[e.split("$")[0]].nodes[e].prev[s];
              return { ...p };
            });
          }}
          className="hover:stroke-red-600 cursor-pointer"
          d={`M${a.x},${a.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}`}
          style={{
            strokeDasharray: "10,10",
            strokeDashoffset: dashoffset,
          }}
        />
      </svg>
    </div>
  );
}
