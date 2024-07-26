import { Cell } from "../../Cell";
import Sidebar from "./Sidebar";
import clock_icon from "../../../../assets/clock-solid.svg";

export class WindowScheduling extends Cell {
  title = "Window Scheduling";
  description = "Schedule with time windows.";
  icon = clock_icon;
  typename = "windowscheduling";
  state = {
    meeting_title: "",
    meeting_description: "",
    start_time: 9,
    end_time: 17,
    blackout_days: [0, 6],
    contact: "",
    meeting_length: 30,
  };

  sidebar() {
    return <Sidebar self={this} />;
  }

  constructor(props) {
    super(props);
    super.initState(props);
  }
}
