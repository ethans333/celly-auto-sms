import { Cell } from "../../Cell";
import calendar_icon from "../../../../assets/calendar-solid.svg";

export class Calendar extends Cell {
  title = "Scheduling Cell";
  description = "Calendar for scheduling events.";
  icon = calendar_icon;

  start_time = 0;
  end_time = 0;
  blackout_days = [];

  toJSON() {
    return super.toObject();
  }

  constructor() {
    super();
  }
}
