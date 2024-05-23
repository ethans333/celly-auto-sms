import { Cell } from "../../Cell";
import Sidebar from "./Sidebar";
import calendar_icon from "../../../../assets/calendar-solid.svg";

export class Calendar extends Cell {
  title = "Scheduling Cell";
  description = "Calendar for scheduling events.";
  icon = calendar_icon;

  toJSON() {
    return {
      ...super.toObject(),
      ...this.state,
    };
  }

  sidebar() {
    return <Sidebar self={this} />;
  }

  constructor(props) {
    super(props);

    this.state = {
      start_time: 0,
      end_time: 0,
      blackout_days: [0, 6],
    };
  }
}
