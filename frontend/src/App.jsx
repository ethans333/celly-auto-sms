import { useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import { useIsAuthenticated } from "@azure/msal-react";
import { useEffect } from "react";

export default function () {
  const isAuthenticated = useIsAuthenticated();

  const navigate = useNavigate();

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  return <Home />;
}
