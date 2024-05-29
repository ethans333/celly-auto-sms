import { Cell } from "../../Cell";
import Sidebar from "./Sidebar";
import calendar_icon from "../../../../assets/calendar-solid.svg";

export class Calendar extends Cell {
  typename = "calendar";
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
      meeting_description: props ? props.meeting_description : "",
      start_time: 9,
      end_time: 17,
      blackout_days: [0, 6],
    };
  }
}
