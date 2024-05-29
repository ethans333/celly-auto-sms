import { useContext, useState, useEffect } from "react";
import { WorkspaceContext } from "../../../Contexts/Workspace";

export default function () {
  const { setDeltaX, setDeltaY, setScale } = useContext(WorkspaceContext);
  const [buttonDown, setButtonDown] = useState(false);

  // View Controller
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

    // Zoom In
    const handleWheel = (e) => {
      // if (e.ctrlKey) {
      //   // If control key is pressed
      //   e.preventDefault(); // Prevent default zoom behavior
      //   const deltaScale = e.deltaY > 0 ? -0.1 : 0.1; // Increase or decrease scale
      //   setScale((prevScale) => prevScale + deltaScale);
      // }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [buttonDown]); // Add lastMousePosition and setWorkspace to dependencies

  return <></>;
}
