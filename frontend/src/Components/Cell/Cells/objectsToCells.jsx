import { Calendar } from "./Calendar/Calendar";
import uuid from "react-uuid";
import { createRef } from "react";

export default function (cells) {
  return cells.map((c) => {
    switch (c.type) {
      case "Calendar":
        return <Calendar {...c} key={uuid()} ref={createRef()} />;
      default:
        console.error("Unknown Cell Type: " + c.type);
        return <></>;
    }
  });
}
