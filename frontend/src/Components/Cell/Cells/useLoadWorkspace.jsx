import { Cell } from "../Cell";
import { Curve } from "../Curve";
import { WorkspaceContext } from "../../../Contexts/Workspace";
import uuid from "react-uuid";
import * as api from "../../../api";
import {
  createRef,
  useEffect,
  useState,
  useContext,
  createElement,
} from "react";

// Cell Types
import { Calendar } from "./Calendar/Calendar";

// Add Cell Types to types array
const types = [Calendar];

export default function () {
  const [connections, setConnections] = useState([]);
  const [nodes, setNodes] = useState({});

  const [cells, setCells] = useState([]);
  const [curves, setCurves] = useState([]);

  const { workspaceMetaData } = useContext(WorkspaceContext);

  function mapCell(c) {
    let type = types.filter((t) => t.name == c.type);

    if (type.length == 0) {
      // Type not found
      console.error(
        "Unknown Cell Type: " +
          c.type +
          "\n Perhaps you failed to add type to type array in useLoadWorkspace.jsx"
      );
      type = [Cell];
    }

    return createElement(type[0], {
      ...c,
      key: uuid(),
      ref: createRef(),
      onNodeMount: (e) => onNodeMount(e, c),
    });
  }

  // Build Cells
  useEffect(() => {
    // Fetch workspace data
    api.getWorkspace(workspaceMetaData.id).then((res) => {
      if (!res.workspace_raw) return; // Error

      const objects = JSON.parse(res.workspace_raw);

      // Map objects
      setCells(() => objects.map(mapCell));
    });
  }, [workspaceMetaData.id]);

  // Build Curves
  useEffect(() => {
    buildCurves();
  }, [nodes]);

  function onNodeMount(e, c) {
    for (const n in c.nodes) {
      if (c.nodes[n].id != e.id) continue;

      // Add Connection
      for (const con of c.nodes[n].next) {
        setConnections((p) =>
          [...p, { start: c.nodes[n].id, end: con }].filter(onlyUnique)
        );
      }
    }

    // Track Node Ref
    setNodes((p) => ({ ...p, [e.id]: e }));
  }

  function buildCurves() {
    console.log(connections);

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

      // Add Curve
      setCurves((p) => [
        ...p,
        <Curve key={uuid()} ref={curveRef} start={s} end={e} />,
      ]);
    });
  }

  return { cells, curves };
}

// Helpers
function onlyUnique(value, index, array) {
  return (
    array.findIndex((obj) => JSON.stringify(obj) === JSON.stringify(value)) ===
    index
  );
}
