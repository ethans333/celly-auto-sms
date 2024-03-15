import Draggable from "react-draggable";
import { useState, useContext, useEffect, useRef } from "react";
import { WorkspaceContext } from "../../Pages/Home.jsx";

import circle from "../../assets/circle-solid.svg";

export default function CellContainer({ children, id }) {
  const { workspace, setWorkspace } = useContext(WorkspaceContext);

  const cell = useRef(null);

  return (
    <div id={id} className="absolute">
      <Draggable
        ref={cell}
        defaultPosition={workspace[id].position}
        onDrag={(event) => {
          setWorkspace((p) => {
            p[id].position = {
              x: event.clientX,
              y: event.clientY,
            };
            return { ...p };
          });
        }}
      >
        <div ref={cell} className="flex w-fit">
          {/* Left */}
          <Node id={`${id}$left`} />
          <div>
            {/* Top */}
            <Node id={`${id}$top`} />
            {/* Children */}
            <div className="card">{children}</div>
            {/* Bottom */}
            <Node id={`${id}$bottom`} />
          </div>
          {/* Right */}
          <Node id={`${id}$right`} />
        </div>
      </Draggable>
    </div>
  );
}

function Node({ id }) {
  const [show, setShow] = useState(false);
  const { workspace, setWorkspace, currentNode, setCurrentNode } =
    useContext(WorkspaceContext);

  useEffect(() => {
    const n = workspace[id.split("$")[0]].nodes[id];

    // for (const prev in n.prev) {
    //   Object.keys(workspace).includes(prev.split("$")[0])
    //   // if (!Object.keys(workspace).includes(prev.split("$")[0]))
    //   //   delete n.nodes[id];
    // }

    setShow(Object.keys(n.next).length > 0 || Object.keys(n.prev).length > 0);
  }, [workspace]);

  return (
    <div className="flex justify-center my-auto">
      <div className="group">
        <img
          onMouseDown={() => setShow((p) => !p)}
          id={id}
          src={circle}
          className={show ? "show-cell-node" : "cell-node"}
          alt="node"
          draggable={false}
          onClick={() => {
            if (currentNode != null) {
              if (
                currentNode === id ||
                currentNode.split("$")[0] === id.split("$")[0]
              ) {
                setCurrentNode(null);
                return;
              }
              setWorkspace((p) => {
                p[currentNode.split("$")[0]].nodes[currentNode].next = {
                  ...p[currentNode.split("$")[0]].nodes[currentNode].next,
                  [id]: "TRIGGER",
                };

                p[id.split("$")[0]].nodes[id].prev = {
                  ...p[id.split("$")[0]].nodes[id].prev,
                  [currentNode]: "TRIGGER",
                };

                return { ...p };
              });
              setCurrentNode(null);
            } else {
              setCurrentNode(id);
            }
          }}
        />
      </div>
    </div>
  );
}
