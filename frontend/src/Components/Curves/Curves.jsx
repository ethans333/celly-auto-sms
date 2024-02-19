import { useContext, useEffect, useState } from "react";
import Curve from "./Curve.jsx";
import { WorkspaceContext } from "../../App.jsx";

export default function () {
  const { workspace, setWorkspace } = useContext(WorkspaceContext);
  const [curves, setCurves] = useState([]);

  useEffect(() => {
    setCurves([]);
    for (const cell in workspace) {
      for (const side in workspace[cell].nodes) {
        for (const node in workspace[cell].nodes[side].next) {
          setCurves((prev) => [
            ...prev,
            <Curve
              key={side + "#" + node}
              id={side + "#" + node}
              start={document.getElementById(side).getBoundingClientRect()}
              end={document.getElementById(node).getBoundingClientRect()}
            />,
          ]);
        }
      }
    }
  }, [workspace]);

  return <>{curves}</>;
}
