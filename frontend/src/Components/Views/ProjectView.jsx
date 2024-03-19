import { WorkspaceContext } from "../../Pages/Home";
import { useContext } from "react";
import Curves from "../Curves/Curves";
import Popup from "../Popup";
import RightClickMenu from "../RightClickMenu";
import TextingCell from "../Cell/Cells/TextingCell";
import CalendarCell from "../Cell/Cells/CalendarCell";

export default function () {
  const { workspace, popupChildren, setPopupChildren } =
    useContext(WorkspaceContext);

  return (
    <>
      {Object.keys(workspace).map((id) => buildCell(id, workspace[id]))}
      <Curves />
      {popupChildren != null && (
        <Popup onClose={() => setPopupChildren(null)}>{popupChildren}</Popup>
      )}
      <RightClickMenu />
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
