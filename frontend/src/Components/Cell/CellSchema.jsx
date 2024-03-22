import CellContainer from "./CellContainer";
import ellipsis from "../../assets/ellipsis-vertical.svg";
import { WorkspaceContext } from "../../Pages/Home.jsx";
import { useState, useContext, useEffect } from "react";
import CellMenu from "./CellMenu";

export default function ({ id, children, sidebar, icon }) {
  const { workspace, setWorkspace, setSideBarChildren } =
    useContext(WorkspaceContext);
  const [showMenu, setShowMenu] = useState(false);
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0 });

  useEffect(() => {
    if (document.getElementById(id))
      setRect(document.getElementById(id).getBoundingClientRect());
  }, []);

  return (
    <div>
      <CellContainer id={id}>
        <div className="flex">
          <img src={icon} className="w-3 " />
          <h1 className="card-title">{workspace[id].title}</h1>
          <img
            src={ellipsis}
            className="card-ellipsis"
            alt="ellipsis"
            draggable={false}
            onClick={() => setShowMenu((p) => !p)}
          />
          <CellMenu
            show={showMenu}
            setShow={setShowMenu}
            top={rect.y + 60}
            left={rect.x + rect.width - 130}
            onOpen={() => {
              setSideBarChildren(sidebar);
            }}
            onDelete={() => {
              setWorkspace((p) => {
                for (const cell in p) {
                  for (const node in p[cell].nodes) {
                    for (const next in p[cell].nodes[node].next) {
                      if (next.split("$")[0] == id)
                        delete p[cell].nodes[node].next[next];
                    }

                    for (const prev in p[cell].nodes[node].prev) {
                      if (prev.split("$")[0] == id)
                        delete p[cell].nodes[node].prev[prev];
                    }
                  }
                }
                delete p[id];
                return { ...p };
              });
            }}
          />
        </div>
        {children}
      </CellContainer>
    </div>
  );
}
