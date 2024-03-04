import microsoft from "../assets/microsoft.svg";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

export default function () {
  const handleLoginMsft = () => {
    window.location.href =
      "https://celly-microsoft-pool.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=cellymicrosoftpool&redirect_uri=http://localhost:5173&response_type=TOKEN&client_id=5dfi8s06l6ephu5e5c6vri4aqe&scope=celly-azuread-resource-server-users/User.Read email openid phone";
  };

  // const isAuthenticated = useIsAuthenticated();
  // const { instance, accounts } = useMsal();

  // const handleLogin = () => {
  //   const request = {
  //     scopes: ["User.Read.All", "Calendars.ReadWrite"],
  //   };

  //   instance
  //     .loginRedirect(request)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <div className="flex items-center justify-center mt-[23vh]">
      <div>
        <div className="text-3xl font-black mb-5">Welcome Back To Celly 👋</div>

        {/* <div className="border mb-12">
          <div>Accounts: {JSON.stringify(accounts)}</div>
          <div>Authenticated: {JSON.stringify(isAuthenticated)}</div>
          <div
            onClick={handleLogin}
            className="text-blue-700 cursor-pointer hover:opacity-50"
          >
            Login With Microsoft
          </div>
        </div> */}

        <div className="w-96 mt-16 space-y-4">
          <div
            onClick={handleLoginMsft}
            className="flex space-x-3 rounded-lg shadow w-full px-5 py-3 cursor-pointer hover:opacity-50"
          >
            <img src={microsoft} alt="microsoft-logo" className="w-5" />
            <div className="font-[400]">Login with Microsoft</div>
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
          />
          <input
            className="border px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-black rounded-lg"
            placeholder="Password"
            type="password"
          />

          <div className="flex justify-center">
            <button className="bg-black text-white w-fit px-3 rounded-lg py-1 hover:opacity-50 mt-3">
              Login
            </button>
          </div>

          <div className="text-center pt-7">
            Don't have an account?{" "}
            <a className="font-semibold cursor-pointer hover:opacity-50">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
