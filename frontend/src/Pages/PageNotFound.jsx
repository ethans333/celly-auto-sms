import sadface from "../assets/face-frown-open-solid.svg";

export default function () {
  return (
    <div className="bg-gradient-to-t from-[rgba(168,85,247,0.07)] flex items-center justify-center pb-[25vh] h-screen">
      <div className="border border-200 shadow-lg rounded-xl px-14 pt-32 pb-16 bg-white text-center">
        <img src={sadface} className="w-32 mb-20 mx-auto" alt="sadface" />
        <p className="text-xl w-96">Page Not Found.</p>

        <div className="mt-20 text-gray-400">
          <p>The page you are looking for does not exist.</p>
        </div>
      </div>
    </div>
  );
}
