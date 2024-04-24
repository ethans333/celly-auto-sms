import xmark from "../assets/xmark-solid.svg";
import { useRef, useEffect, useState } from "react";

export default function ({ children, onClose }) {
  const popup = useRef(null);

  const [pHeight, setPHeight] = useState(0);

  useEffect(() => {
    setPHeight(popup.current.getBoundingClientRect().height);
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div
        ref={popup}
        style={{
          transform: `translateY(-${pHeight / 3}px`,
        }}
        className="bg-white p-6 rounded-lg shadow-lg z-10 w-fit"
      >
        <img
          className="w-4 cursor-pointer ml-auto"
          src={xmark}
          onClick={onClose}
        />
        {children}
      </div>
    </div>
  );
}
