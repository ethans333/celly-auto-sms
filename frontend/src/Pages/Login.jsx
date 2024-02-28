import microsoft from "../assets/microsoft.svg";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

export default function () {
  const handleLoginMsft = () => {
    window.location.href =
      "https://celly-microsoft-pool.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=cellymicrosoftpool&redirect_uri=http://localhost:5173&response_type=TOKEN&client_id=5dfi8s06l6ephu5e5c6vri4aqe&scope=celly-azuread-resource-server-users/User.Read email openid phone";
  };

  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    instance
      .loginRedirect({
        scopes: ["User.Read"],
      })
      .then((res) => console.log(res));
  };

  return (
    <div className="flex items-center justify-center mt-[35vh]">
      <div>
        <div className="text-lg font-bold mb-5">Welcome To Celly</div>

        <div className="border mb-12">
          <div>Authenticated: {JSON.stringify(isAuthenticated)}</div>
          <div
            onClick={handleLogin}
            className="text-blue-700 cursor-pointer hover:opacity-50"
          >
            Login With Microsoft
          </div>
        </div>

        <div
          onClick={handleLoginMsft}
          className="flex space-x-3 rounded-lg shadow w-fit px-5 py-3 cursor-pointer hover:opacity-50"
        >
          <img src={microsoft} alt="microsoft-logo" className="w-5" />
          <div className="font-[450]">Login with Microsoft</div>
        </div>
      </div>
    </div>
  );
}
