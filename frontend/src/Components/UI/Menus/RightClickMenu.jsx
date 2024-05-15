import { useState, useEffect, useRef, useContext } from "react";
import { WorkspaceContext } from "../../../Contexts/Workspace";
import plus from "../../../assets/plus-solid.svg";
import floppy from "../../../assets/floppy-disk-solid.svg";
import CellSelection from "../../Cell/CellSelection";
import Settings from "../../Popups/Settings";
import sliders from "../../../assets/sliders-solid.svg";

export default function () {
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const { setPopup, saveWorkspace, setSidebar } = useContext(WorkspaceContext);

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
    <div className="text-sm">
      {showMenu && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
          }}
          className="cell-menu grid grid-cols-1 gap-y-2 z-50 animate-fadeIn text-base"
        >
          <div
            onClick={(event) => {
              setShowMenu(false);
              setSidebar(<CellSelection />);
              // onCreate(event.clientX, event.clientY);
            }}
            className="cursor-pointer hover:opacity-50 flex"
          >
            <img src={plus} alt="plus" className="w-3.5 mr-3" />
            <p>Create Cell</p>
          </div>
          <div
            onClick={() => {
              setShowMenu(false);
              saveWorkspace();
            }}
            className="cursor-pointer hover:opacity-50 flex"
          >
            <img src={floppy} alt="floppy" className="w-3.5 mr-3" />
            <p>Save</p>
          </div>
          <div
            onClick={() => {
              setShowMenu(false);
              setPopup(<Settings />);
            }}
            className="cursor-pointer hover:opacity-50 flex"
          >
            <img src={sliders} alt="gear" className="w-3.5 mr-3" />
            <p>Settings</p>
          </div>
        </div>
      )}
    </div>
  );
}
