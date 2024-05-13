import { WorkspaceContext } from "../../Pages/Home";
import { useContext, useState, useEffect } from "react";
import Curves from "../Curves/Curves";
import Popup from "../Popup";
import RightClickMenu from "../RightClickMenu";
import TextingCell from "../Cell/Cells/TextingCell";
import CalendarCell from "../Cell/Cells/CalendarCell";
import { Cell } from "../Cell/Cell.jsx";
import { Calendar } from "../Cell/Cells/Calendar/Calendar.jsx";

export default function () {
  const {
    workspace,
    setWorkspace,
    popupChildren,
    setPopupChildren,
    dx,
    dy,
    setDX,
    setDY,
    setLastMousePosition,
    lastMousePosition,
    componentsStack,
  } = useContext(WorkspaceContext);

  const [buttonDown, setButtonDown] = useState(false);

  useEffect(() => {
    componentsStack.forEach((c) => {
      if (c.ref.current.constructor.prototype instanceof Cell) {
        console.log(c.ref.current.toJSON());
      }
    });
  }, [componentsStack]);

  useEffect(() => {
    console.log(dx, dy);

    const handleMouseDown = (e) => {
      if (e.button === 1 && !buttonDown) {
        setButtonDown(true);
        setLastMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseMove = (e) => {
      if (buttonDown) {
        setDX((p) => p + e.movementX);
        setDY((p) => p + e.movementY);
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 1 && buttonDown) {
        setButtonDown(false);
        document.body.style.cursor = "default";
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [buttonDown, lastMousePosition, setWorkspace]); // Add lastMousePosition and setWorkspace to dependencies

  return (
    <>
      <div style={{ transform: `translate(${dx}px, ${dy}px)` }}>
        {Object.keys(workspace).map((id) => buildCell(id, workspace[id]))}
        <Curves />
        {componentsStack}
      </div>

      <RightClickMenu />
      {popupChildren != null && (
        <Popup onClose={() => setPopupChildren(null)}>{popupChildren}</Popup>
      )}
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
