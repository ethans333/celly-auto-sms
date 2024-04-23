import { WorkspaceContext } from "../../Pages/Home";
import { useContext, useState, useEffect, useRef } from "react";
import Curves from "../Curves/Curves";
import Popup from "../Popup";
import RightClickMenu from "../RightClickMenu";
import TextingCell from "../Cell/Cells/TextingCell";
import CalendarCell from "../Cell/Cells/CalendarCell";

export default function () {
  const { workspace, popupChildren, setPopupChildren } =
    useContext(WorkspaceContext);

  const [dragStart, setDragStart] = useState(null);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (e.button === 1 && dragStart == null) {
        setDragStart([e.clientX, e.clientY]);
      }
    });
    document.addEventListener("mousemove", (e) => {
      if (dragStart != null) {
        const dx = e.clientX - dragStart[0];
        const dy = e.clientY - dragStart[1];
        setTranslateX(dx);
        setTranslateY(dy);
      }
    });
    document.addEventListener("mouseup", (e) => {
      if (e.button === 1 && dragStart != null) {
        setDragStart(null);
        console.log("mouseup");
      }
    });
  }, [dragStart]);

  return (
    <>
      <div
        ref={containerRef}
        style={{ transform: `translate(${translateX}px, ${translateY}px)` }}
      >
        {Object.keys(workspace).map((id) => buildCell(id, workspace[id]))}
        <Curves />
      </div>
      {popupChildren != null && (
        <Popup onClose={() => setPopupChildren(null)}>{popupChildren}</Popup>
      )}
      <RightClickMenu />
    </>
  );
}

function buildCell(id, cell) {
  // function for mapping cell type to cell type's component
  switch (cell.type) {
    case "texting":
      return <TextingCell key={id} id={id} />;
    case "calendar":
      return <CalendarCell key={id} id={id} />;
    default:
      return <></>;
  }
}
