import microsoft from "../../assets/microsoft.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as api from "../../api";
import blob from "../../assets/blobs/blob.svg";
import blob1 from "../../assets/blobs/blob1.svg";

export default function () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLoginMsft = () => {
    window.location.href =
      "https://celly-microsoft-pool.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=cellymicrosoftpool&redirect_uri=http://localhost:5173&response_type=TOKEN&client_id=5dfi8s06l6ephu5e5c6vri4aqe&scope=celly-azuread-resource-server-users/User.Read email openid phone";
  };

  const handleLogin = () => {
    api.loginUser(email, password).then((res) => {
      if (res.status === 200) {
        navigate("/");
      } else {
        alert(res);
      }
    });
  };

  return (
    <div className="bg-gradient-to-t from-[rgba(168,85,247,0.07)] flex items-center justify-center pb-[25vh] h-screen">
      <div className="border border-200 shadow-lg rounded-xl px-20 pt-32 pb-28 bg-white">
        <div className="text-3xl font-black mb-5">
          Welcome Back To{" "}
          <a className="bg-gradient-to-r from-violet-600 to-indigo-600 inline-block text-transparent bg-clip-text">
            Intwine
          </a>{" "}
          👋
        </div>
        <div className="w-96 mt-20 space-y-4">
          {/* <div
            // onClick={handleLoginMsft}
            className="flex space-x-3 rounded-lg shadow w-full px-5 py-3 cursor-pointer hover:opacity-50"
          >
            <img src={microsoft} alt="microsoft-logo" className="w-5" />
            <div className="font-[400]">Login with Microsoft</div>
          </div>

          <div className="flex items-center py-3">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-400">Or with email</span>
            <hr className="flex-grow border-gray-300" />
          </div> */}

          <div className="px-5 space-y-3 mb-12">
            <input
              className="border px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-black rounded-lg"
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-black rounded-lg"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              className="bg-black text-white w-fit px-3 rounded-lg py-1 hover:opacity-50 mt-3 mb-10"
            >
              Login
            </button>
          </div>

          <div className="text-center pt-7">
            Don't have an account?{" "}
            <a
              onClick={() => navigate("/register")}
              className="text-indigo-600 font-semibold cursor-pointer hover:opacity-50"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
