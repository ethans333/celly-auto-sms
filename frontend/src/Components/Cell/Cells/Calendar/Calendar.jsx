import { Cell } from "../../Cell";
import Sidebar from "./Sidebar";
import calendar_icon from "../../../../assets/calendar-solid.svg";

export class Calendar extends Cell {
  title = "Scheduling Cell";
  description = "Calendar for scheduling events.";
  icon = calendar_icon;

  start_time = 0;
  end_time = 0;
  blackout_days = [];

  toJSON() {
    return {
      ...super.toObject(),
      start_time: this.start_time,
      end_time: this.end_time,
      blackout_days: this.blackout_days,
    };
  }

  sidebar() {
    return <Sidebar />;
  }

  constructor(props) {
    super(props);
  }
}
