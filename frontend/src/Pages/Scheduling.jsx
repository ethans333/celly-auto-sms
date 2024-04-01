import Calendar from "../Components/Scheduling/Calendar";

export default function () {
  return (
    <div className="xl:flex xl:w-[1280px] 2xl:w-[1536px] mx-auto mt-[3vw]">
      <Calendar />

      <div className="xl:w-[400px] 2xl:w-[500px] xl:mx-5 shadow-lg rounded-lg py-10 px-8">
        <div className="font-extrabold">Enter Phone or Email</div>
      </div>
    </div>
  );
}
