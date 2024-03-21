import * as api from "../../api";

export default function () {
  return (
    <>
      <div className="text-center pt-[15vh]">
        <button
          onClick={() => {
            api
              .addWorkspace("Test Workspace", "Test Description", {}, "🔎")
              .then((res) => {
                console.log(res);
              });
          }}
          className="font-black text-xl hover:text-purple-500"
        >
          Click Me
        </button>
      </div>
    </>
  );
}
