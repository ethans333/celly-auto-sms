import SchedulingMenu from "../Components/Scheduling/SchedulingMenu";
import WindowScheduling from "../Components/Scheduling/WindowScheduling";

export default function () {
  return (
    <div className="xl:flex xl:w-[1280px] 2xl:w-[1536px] mx-auto mt-[3vw]">
      <WindowScheduling />
      <SchedulingMenu />
    </div>
  );
}
