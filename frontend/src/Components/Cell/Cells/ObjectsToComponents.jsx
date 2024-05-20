import { Calendar } from "./Calendar/Calendar";
import { Curve } from "../Curve";
import uuid from "react-uuid";
import { createRef, useEffect, useState, useContext } from "react";
import { WorkspaceContext } from "../../../Contexts/Workspace";

export default function ({ objects }) {
  const [connections, setConnections] = useState([]);
  const [nodes, setNodes] = useState({});

  const { setComponentsStack } = useContext(WorkspaceContext);

  // Build Cells
  useEffect(() => {
    const newC = objects.map((c) => {
      switch (c.type) {
        case "Calendar":
          return (
            <Calendar
              {...c}
              key={uuid()}
              ref={createRef()}
              onNodeMount={(e) => {
                for (const n in c.nodes) {
                  if (c.nodes[n].id != e.id) continue;

                  // Add Connection
                  for (const con of c.nodes[n].next) {
                    setConnections((p) => [
                      ...p,
                      { start: c.nodes[n].id, end: con },
                    ]);
                  }
                }

                // Track Node Ref
                setNodes((p) => ({ ...p, [e.id]: e }));
              }}
            />
          );
        default:
          console.error("Unknown Cell Type: " + c.type);
          return <></>;
      }
    });

    setComponentsStack((p) => [...p, ...newC]); // Problem
  }, [objects]);

  // Build Curves
  useEffect(() => {
    connections.forEach((c) => {
      const s = nodes[c.start];
      const e = nodes[c.end];

      const curveRef = createRef();

      s.setState((p) => ({
        selected: true,
        next: [...p.next, curveRef],
      }));

      e.setState((p) => ({
        selected: true,
        prev: [...p.prev, curveRef],
      }));

      setComponentsStack((p) => [
        ...p,
        <Curve ref={curveRef} start={s} end={e} key={uuid()} />,
      ]);
    });
  }, [nodes]);

  return;
}
