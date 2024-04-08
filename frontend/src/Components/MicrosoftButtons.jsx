import windows from "../assets/windows.svg";
import { useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

export function LinkToGraph() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  return (
    <div
      onClick={login}
      className="flex space-x-3 rounded-lg shadow w-full px-5 py-3 cursor-pointer hover:opacity-50 bg-black text-white"
    >
      <img src={windows} alt="microsoft-logo" className="w-5" />
      <div className="font-[400]">Link Microsoft Calendar</div>
    </div>
  );

  async function login() {
    try {
      const loginRequest = {
        scopes: ["User.Read.All", "Calendars.ReadWrite"], // Replace with required scopes for Graph API access
      };

      if (isAuthenticated) {
        // If user is already signed in, silently acquire a token
        instance
          .acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          })
          .then((response) => {
            console.log(response);
          });
      } else {
        instance.loginPopup(loginRequest);
      }
    } catch (error) {
      console.log(error);
      // Handle login errors gracefully
    }
  }
}
