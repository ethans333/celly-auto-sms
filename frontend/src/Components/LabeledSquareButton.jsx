import { useState, useEffect, useRef } from "react";

export default function LabeledSquareButton({
  icon,
  label,
  onClick,
  showLabel = false,
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative mt-1">
      <img
        src={icon}
        className="square-button w-8 h-7 z-50 bg-white"
        onClick={onClick}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />
      {(isHovering || showLabel) && (
        <div className="absolute top-[28px] left-4 transform -translate-x-1/2 bg-black text-white text-xs rounded p-1 px-1.5 w-fit">
          {label}
        </div>
      )}
    </div>
  );
}

export function GenericLabeledSquareButton({ label, onClick, children }) {
  const [isHovering, setIsHovering] = useState(false);
  const buttonRef = useRef(null);

  return (
    <div className="relative mt-1">
      <div
        onClick={onClick}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        ref={buttonRef}
      >
        {children}
      </div>
      {isHovering && (
        <div className="absolute top-8 left-4 transform -translate-x-1/2 bg-black text-white text-xs rounded p-1 text-center">
          {label}
        </div>
      )}
    </div>
  );
}
