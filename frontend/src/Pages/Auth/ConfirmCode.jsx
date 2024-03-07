import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as api from "../../api";

export default function () {
  const [code, setCode] = useState("");

  const navigate = useNavigate();

  const handleVerify = () => {
    api.confirmUser(sessionStorage.getItem("email"), code).then((res) => {
      if (res.status === 200) {
        navigate("/login");
      } else {
        alert(res);
      }
    });
  };

  return (
    <div className="flex items-center justify-center mt-[13vw]">
      <div>
        <div className="text-3xl font-black mb-5 text-center">
          Verify Email ✉️
        </div>
        <div className="w-64 mt-16 space-y-4">
          <input
            className="mb-12 text-2xl text-center border px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-black rounded-lg"
            placeholder="Code"
            type="number"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <div className="flex justify-center">
            <button
              onClick={handleVerify}
              className="bg-black text-white w-fit px-3 rounded-lg py-1 hover:opacity-50 mt-3"
            >
              Verify
            </button>
          </div>

          <div className="text-center pt-7">
            Didn't get the code?{" "}
            <a
              //   onClick={() => navigate("/register")}
              className="font-semibold cursor-pointer hover:opacity-50"
            >
              Resend it
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
