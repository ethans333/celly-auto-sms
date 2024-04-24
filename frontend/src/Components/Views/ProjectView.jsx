import { WorkspaceContext } from "../../Pages/Home";
import { useContext, useState, useEffect } from "react";
import Curves from "../Curves/Curves";
import Popup from "../Popup";
import RightClickMenu from "../RightClickMenu";
import TextingCell from "../Cell/Cells/TextingCell";
import CalendarCell from "../Cell/Cells/CalendarCell";

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
  } = useContext(WorkspaceContext);

  const [buttonDown, setButtonDown] = useState(false);

  useEffect(() => {
    console.log(dx, dy);

    const handleMouseDown = (e) => {
      if (e.button === 1 && !buttonDown) {
        console.log("Mouse Down");
        setButtonDown(true);
        setLastMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseMove = (e) => {
      if (buttonDown) {
        const theta = Math.atan2(
          e.clientY - lastMousePosition.y,
          e.clientX - lastMousePosition.x
        );

        setDX((p) => p + Math.cos(theta) * 5);
        setDY((p) => p + Math.sin(theta) * 5);
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 1 && buttonDown) {
        setButtonDown(false);
        console.log("Mouse Up");
        // setWorkspace((p) => {
        //   Object.keys(p).forEach((id) => {
        //     p[id].position.x += dx;
        //     p[id].position.y += dy;
        //   });

        //   return { ...p };
        // });
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
        <Curves /> {/* Use key to trigger rerender */}
        <RightClickMenu />
      </div>

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
