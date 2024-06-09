import { Cell } from "../../Cell";
import Sidebar from "./Sidebar";
import calendar_icon from "../../../../assets/calendar-solid.svg";

export class Calendar extends Cell {
  title = "Scheduling Cell";
  description = "Calendar for scheduling events.";
  icon = calendar_icon;
  typename = "calendar";
  state = {
    meeting_title: "",
    meeting_description: "",
    start_time: 9,
    end_time: 17,
    blackout_days: [0, 6],
  };

  sidebar() {
    return <Sidebar self={this} />;
  }

  constructor(props) {
    super(props);
    super.initState(props);
  }
}
