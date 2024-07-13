import { useEffect } from "react";
import { useParams } from "react-router-dom";
import * as api from "../api";

export default function () {
  let { id, token } = useParams();

  useEffect(() => {
    api.confirmMeeting(id, token).then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <div className="bg-gradient-to-t from-[rgba(168,85,247,0.07)] flex items-center justify-center pb-[25vh] h-screen">
      <div className="border border-200 shadow-lg rounded-xl px-14 pt-32 pb-16 bg-white text-center">
        <p className="text-8xl mb-20">✅</p>
        <p className="text-xl w-96">
          Your meeting has been confirmed and your host has been notified.
        </p>

        <div className="mt-20 text-gray-400">
          <p>You may close this window.</p>
        </div>
      </div>
    </div>
  );
}
