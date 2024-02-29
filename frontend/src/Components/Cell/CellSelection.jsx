import { TextingCellSelection } from "./Cells/TextingCell";
import { CalendarCellSelection } from "./Cells/CalendarCell";

export default function () {
  return (
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
