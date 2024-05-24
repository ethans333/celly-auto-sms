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
  const nodes = {};
  const processed = [];

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
          "\n Perhaps you failed to add Cell Type to type array in useLoadWorkspace.jsx"
      );
      type = [Cell];
    }

    return createElement(type[0], {
      ...c,
      key: c.id,
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

      console.log(objects);

      // Map objects
      setCells(() => objects.map(mapCell));
    });
  }, [workspaceMetaData.id]);

  function onNodeMount(e, c) {
    for (const n in c.nodes) {
      // for each cell node
      if (c.nodes[n].id != e.id) continue; // skip non self

      // Add Curve
      for (const id of c.nodes[n].next) {
        if (
          nodes[id] &&
          !processed.find((p) => p.start == e.id && p.end == id)
        ) {
          // partner exists and pair not yet processed

          // Create Curve
          const start = e;
          const end = nodes[id];

          const curveRef = createRef();
          const cid = uuid();

          start.setState((p) => ({
            selected: true,
            next: [...p.next, curveRef],
          }));

          end.setState((p) => ({
            selected: true,
            prev: [...p.prev, curveRef],
          }));

          setCurves((p) => [
            ...p,
            <Curve key={cid} id={cid} ref={curveRef} start={start} end={end} />,
          ]);

          processed.push({
            start: e.id,
            end: id,
          });
        }
      }

      for (const id of c.nodes[n].prev) {
        if (
          nodes[id] &&
          !processed.find((p) => p.start == id && p.end == e.id)
        ) {
          // partner exists and pair not yet processed

          // Create Curve
          const start = nodes[id];
          const end = e;

          const curveRef = createRef();

          start.setState((p) => ({
            selected: true,
            next: [...p.next, curveRef],
          }));

          end.setState((p) => ({
            selected: true,
            prev: [...p.prev, curveRef],
          }));

          const cid = uuid();

          setCurves((p) => [
            ...p,
            <Curve key={cid} id={cid} ref={curveRef} start={start} end={end} />,
          ]);
          processed.push({
            start: id,
            end: e.id,
          });
        }
      }
    }

    // Track Node Ref
    nodes[e.id] = e;
  }

  return { cells, curves };
}
