import Calendar from "../Components/Scheduling/Calendar";
import SchedulingMenu from "../Components/Scheduling/SchedulingMenu";

export default function () {
  return (
    <div className="xl:flex xl:w-[1280px] 2xl:w-[1536px] mx-auto mt-[3vw]">
      <Calendar />
      <SchedulingMenu />
    </div>
  );
}
