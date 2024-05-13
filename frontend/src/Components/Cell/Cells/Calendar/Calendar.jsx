import { Cell } from "../../Cell";
import calendar_icon from "../../../../assets/calendar-solid.svg";

export class Calendar extends Cell {
  title = "Scheduling Cell";
  description = "Calendar for scheduling events.";
  icon = calendar_icon;

  toJSON() {
    return {
      test: "TEST",
    };
  }

  constructor() {
    super();
  }
}
