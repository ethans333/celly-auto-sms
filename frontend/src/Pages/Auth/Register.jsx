import microsoft from "../../assets/microsoft.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as api from "../../api";

export default function () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLoginMsft = () => {
    window.location.href =
      "https://celly-microsoft-pool.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=cellymicrosoftpool&redirect_uri=http://localhost:5173&response_type=TOKEN&client_id=5dfi8s06l6ephu5e5c6vri4aqe&scope=celly-azuread-resource-server-users/User.Read email openid phone";
  };

  const handleLogin = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    api.createUser(email, password).then((res) => {
      if (res.status === 200) {
        sessionStorage.setItem("email", email);
        navigate("/confirm-code");
      } else {
        alert(res);
      }
    });
  };

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center mt-[10vw]">
      <div>
        <div className="text-3xl font-black mb-5 text-center">
          Welcome To Celly 🤙
        </div>

        <div className="w-96 mt-16 space-y-4">
          <div
            onClick={handleLoginMsft}
            className="flex space-x-3 rounded-lg shadow w-full px-5 py-3 cursor-pointer hover:opacity-50"
          >
            <img src={microsoft} alt="microsoft-logo" className="w-5" />
            <div className="font-[400]">Sign up with Microsoft</div>
          </div>

          <div className="flex items-center py-3">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-400">Or with email</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <input
            className="border px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-black rounded-lg"
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="w-full flex space-x-3">
            <input
              className="border px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-black rounded-lg"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="border px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-black rounded-lg"
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              className="bg-black text-white w-fit px-3 rounded-lg py-1 hover:opacity-50 mt-3"
            >
              Login
            </button>
          </div>

          <div className="text-center pt-7">
            Already have an account?{" "}
            <a
              className="font-semibold cursor-pointer hover:opacity-50"
              onClick={() => navigate("/login")}
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
