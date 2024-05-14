import { Calendar } from "./Cells/Calendar/Calendar";

export default function () {
  return (
    <div>
      <div className="selection-area">
        <h3 className="selection-cell-header mt-7">Cell Types</h3>
        <div className="absolute space-y-5">{new Calendar().selection()}</div>
      </div>
    </div>
  );
}
