import caret from "../assets/caret-down-solid.svg";
import { useState, useEffect, useRef } from "react";

export default function ({ values, current, setCurrent, padded = false }) {
  const [showSelection, setShowSelection] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowSelection(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <div
        className={`${
          padded ? "dropdown-top-padded" : "dropdown-top"
        } flex hover:opacity-50`}
        onClick={() => setShowSelection(!showSelection)}
      >
        <div className="text-sm">{current}</div>
        <img src={caret} className="w-2 ml-2" />
      </div>
      {showSelection && (
        <div
          className={`${
            padded ? "dropdown-bottom-padded" : "dropdown-bottom"
          } absolute`}
        >
          {values.map((value, index) => (
            <div
              key={index}
              className="hover:bg-gray-200 cursor-pointer px-1.5 py-1 hover:opacity-50"
              onClick={() => {
                setCurrent(value);
                setShowSelection(false);
              }}
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
