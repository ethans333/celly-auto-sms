import React, { useEffect, useRef } from "react";
import clone from "../../../assets/clone-regular.svg";
import eye from "../../../assets/eye-solid.svg";
import trash from "../../../assets/trash-can-solid.svg";

export default function ({ show, setShow, onOpen, onDelete }) {
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setShow(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, setShow]);

  return (
    <>
      {show && (
        <div
          ref={menuRef}
          className="cell-menu grid grid-cols-1 gap-y-2 z-50 animate-fadeIn"
        >
          <div
            onClick={() => {
              setShow(false);
              onOpen();
            }}
            className="cursor-pointer hover:opacity-50 flex"
          >
            <img src={eye} alt="eye" className="w-4 mr-2" />
            <p>Open</p>
          </div>
          <div
            onClick={() => {
              setShow(false);
            }}
            className="cursor-pointer hover:opacity-50 flex pb-2"
          >
            <img src={clone} alt="clone" className="w-4 mr-2" />
            <p>Duplicate</p>
          </div>
          <div
            onClick={() => {
              setShow(false);
              onDelete();
            }}
            className="cursor-pointer hover:opacity-50 flex border-t pt-3"
          >
            <img src={trash} alt="trash" className="w-4 mr-2" />
            <p className="text-red-500">Delete</p>
          </div>
        </div>
      )}
    </>
  );
}
