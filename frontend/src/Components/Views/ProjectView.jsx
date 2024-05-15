import { useContext, useState, useEffect, useRef } from "react";
import Popup from "../Popup";
import RightClickMenu from "../UI/Menus/RightClickMenu";
import { Cell } from "../Cell/Cell.jsx";
import { WorkspaceContext } from "../../Contexts/Workspace.jsx";
import uuid from "react-uuid";

export default function () {
  const {
    componentsStack,
    setComponentsStack,
    deltaX,
    deltaY,
    setDeltaX,
    setDeltaY,
    popup,
  } = useContext(WorkspaceContext);

  const [buttonDown, setButtonDown] = useState(false);

  useEffect(() => {
    // console.log(componentsStack);
    // setComponentsStack((p) => [
    //   p,
    // ]);
  }, []);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.button === 1 && !buttonDown) {
        setButtonDown(true);
      }
    };

    const handleMouseMove = (e) => {
      if (buttonDown) {
        setDeltaX((p) => p + e.movementX);
        setDeltaY((p) => p + e.movementY);
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
  }, [buttonDown]); // Add lastMousePosition and setWorkspace to dependencies

  return (
    <>
      <div style={{ transform: `translate(${deltaX}px, ${deltaY}px)` }}>
        {componentsStack}
      </div>

      <RightClickMenu />
      {popup != null && <Popup onClose={() => setPopup(null)}>{popup}</Popup>}
    </>
  );
}
