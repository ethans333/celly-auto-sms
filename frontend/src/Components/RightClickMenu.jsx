import { useState, useEffect, useRef, useContext } from "react";
import { WorkspaceContext } from "../Pages/Home";
import plus from "../assets/plus-solid.svg";
import floppy from "../assets/floppy-disk-solid.svg";
import gear from "../assets/gear-solid.svg";
import CellSelection from "./Cell/CellSelection";
import Settings from "./Settings";

export default function () {
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const { setSideBarChildren } = useContext(WorkspaceContext);

  const menuRef = useRef();

  const handleRightClick = (event) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setShowMenu(true);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (
        !(
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        )
      ) {
        setShowMenu(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("contextmenu", handleRightClick);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, []);

  return (
    <div>
      {showMenu && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
          }}
          className="cell-menu grid grid-cols-1 gap-y-2 z-50 animate-fadeIn"
        >
          <div
            onClick={(event) => {
              setShowMenu(false);
              setSideBarChildren(<CellSelection />);
              // onCreate(event.clientX, event.clientY);
            }}
            className="cursor-pointer hover:opacity-50 flex"
          >
            <img src={plus} alt="plus" className="w-4 mr-2" />
            <p>Create Cell</p>
          </div>
          <div
            onClick={() => {
              setShowMenu(false);
            }}
            className="cursor-pointer hover:opacity-50 flex"
          >
            <img src={floppy} alt="floppy" className="w-4 mr-2" />
            <p>Save</p>
          </div>
          <div
            onClick={() => {
              setShowMenu(false);
              setSideBarChildren(<Settings />);
            }}
            className="cursor-pointer hover:opacity-50 flex"
          >
            <img src={gear} alt="gear" className="w-4 mr-2" />
            <p>Settings</p>
          </div>
        </div>
      )}
    </div>
  );
}
