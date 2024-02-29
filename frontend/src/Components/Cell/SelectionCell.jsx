import { useContext, useRef, useState } from "react";
import { WorkspaceContext } from "../../Pages/Home";

import cell_defaults from "../../assets/cell_defaults";
import cellDefaultSchema from "./cellDefaultSchema";

export default function ({ emoji, title, description, type }) {
  const { setWorkspace, setShowCellSelection } = useContext(WorkspaceContext);
  const cardRef = useRef();
  const [dragImage, setDragImage] = useState(null);

  const handleDragStart = (event) => {
    const clone = cardRef.current.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.top = "-1000px";
    clone.style.opacity = "0.5";

    document.body.appendChild(clone);
    setDragImage(clone);

    var img = new Image();
    event.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDrag = (event) => {
    if (dragImage) {
      const r = cardRef.current.getBoundingClientRect();
      dragImage.style.left = event.pageX - r.width / 2 + "px";
      dragImage.style.top = event.pageY - r.height / 2 + "px";
    }
  };

  const handleDragEnd = (event) => {
    if (dragImage) {
      const r = cardRef.current.getBoundingClientRect();

      setWorkspace((p) => {
        const [id, def] = cellDefaultSchema(
          event.pageX - r.width / 2,
          event.pageY - r.height / 2
        );
        return {
          ...p,
          [id]: {
            type: type,
            ...def,
            ...cell_defaults[type],
          },
        };
      });

      document.body.removeChild(dragImage);
      setDragImage(null);
    }
  };

  return (
    <div
      draggable
      className="selection-card"
      ref={cardRef}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className="selection-cell-header flex">
        <span className="card-emoji mr-1.5">{emoji}</span>
        <h3>{title}</h3>
      </div>
      <div className="selection-cell-description">{description}</div>
    </div>
  );
}
