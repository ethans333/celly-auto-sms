import Popup from "../Popup";
import { TextingCellSelection } from "./Cells/TextingCell";
import { CalendarCellSelection } from "./Cells/CalendarCell";
import { useContext } from "react";
import { WorkspaceContext } from "../../App";

export default function () {
  // const { showCellSelection, setShowCellSelection } =
  //   useContext(WorkspaceContext);

  return (
    // showCellSelection && (
    //   // <Popup onClose={() => setShowCellSelection(false)}>
    //   //   <div className="px-3 pt-5 pb-8">
    //   //     <h3 className="selection-cell-header">Recently Used</h3>
    //   //     <div className="selection-row">
    //   //       <TextingCellSelection />
    //   //       <CalendarCellSelection />
    //   //       <TextingCellSelection />
    //   //       <CalendarCellSelection />
    //   //       <TextingCellSelection />
    //   //       <CalendarCellSelection />
    //   //     </div>
    //   //     <h3 className="selection-cell-header mt-7">Cell Types</h3>
    //   //     <div className="selection-row">
    //   //       <TextingCellSelection />
    //   //       <CalendarCellSelection />
    //   //       <TextingCellSelection />
    //   //       <CalendarCellSelection />
    //   //       <TextingCellSelection />
    //   //       <CalendarCellSelection />
    //   //     </div>
    //   //   </div>
    //   // </Popup>

    // )
    <div>
      <div className="selection-area">
        <h3 className="selection-cell-header mt-7">Cell Types</h3>
        <TextingCellSelection />
        <CalendarCellSelection />
        <TextingCellSelection />
        <CalendarCellSelection />
        <TextingCellSelection />
        <CalendarCellSelection />
        <TextingCellSelection />
        <CalendarCellSelection />
        <TextingCellSelection />
        <CalendarCellSelection />
        <TextingCellSelection />
        <CalendarCellSelection />
        <TextingCellSelection />
        <CalendarCellSelection />
        <TextingCellSelection />
        <CalendarCellSelection />
        <TextingCellSelection />
        <CalendarCellSelection />
      </div>
    </div>
  );
}
