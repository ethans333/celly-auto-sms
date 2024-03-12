import TextingCell from "../Components/Cell/Cells/TextingCell.jsx";
import CalendarCell from "../Components/Cell/Cells/CalendarCell.jsx";
import { useState, createContext, useEffect } from "react";
import data from "../assets/cells.json";
import Curves from "../Components/Curves/Curves.jsx";
import RightClickMenu from "../Components/RightClickMenu.jsx";
import LeftSideBar from "../Components/LeftSideBar.jsx";
import RegisteredNumbers from "../Components/Views/RegisteredNumbers.jsx";
import RightSideBar from "../Components/RightSideBar.jsx";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as api from "../api.jsx";

export const WorkspaceContext = createContext();

export default function () {
  const [workspace, setWorkspace] = useState(data);
  const [sideBarChildren, setSideBarChildren] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [currentView, setCurrentView] = useState("cells");

  const navigate = useNavigate();

  useEffect(() => {
    parseToken();
    validateToken();

    // api
    //   .addWorkspace(
    //     "My New Workspace",
    //     "Ea duis ipsum minim cupidatat Lorem aute magna eiusmod ea sit anim laboris. Eiusmod consequat consequat deserunt duis aute occaecat. Nulla ex dolor officia incididunt occaecat quis ullamco proident fugiat. Qui enim voluptate quis veniam reprehenderit id nostrud excepteur ex. Duis veniam aliqua non nostrud.",
    //     JSON.stringify(workspace)
    //   )
    //   .then(async (res) => {
    //     if (res.status === 200) {
    //       const json = await res.json();
    //       console.log(json);
    //     } else {
    //       console.log(res);
    //     }
    //   });

    api
      .getWorkspace("cbb8f7ca-e4a3-45ea-9a22-00e40769a609")
      .then(async (res) => {
        if (res.status === 200) {
          const json = await res.json();
          console.log(json);
        } else {
          console.log(res);
        }
      });
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        currentNode,
        currentView,
        setCurrentNode,
        setWorkspace,
        setSideBarChildren,
        setCurrentView,
      }}
    >
      <LeftSideBar />
      <RightSideBar children={sideBarChildren} />
      {renderViews(currentView)}
    </WorkspaceContext.Provider>
  );

  function renderViews(type) {
    // Different views to render, shown based on the currentView state set in the left side bar.
    switch (type) {
      case "cells":
        return (
          <>
            {Object.keys(workspace).map((id) => buildCell(id, workspace[id]))}
            <Curves />
            <RightClickMenu />
          </>
        );
      case "numbers":
        return <RegisteredNumbers />;
      case "analytics":
        return <></>;
      default:
        return <></>;
    }
  }

  function parseToken() {
    // If available, parse the token from the URL and set it as a cookie
    let url = new URL(window.location.href);
    let hash = url.hash.substring(1); // remove the #
    let params = new URLSearchParams(hash);

    if (params.size === 0) return;

    Cookies.set("access_token", params.get("access_token"), {
      expires: parseInt(params.get("expires_in")),
    });
  }

  function validateToken() {
    // Check if token is expired or does not exist
    const token = Cookies.get("access_token");

    if (!token) {
      // Token does not exist
      navigate("/login");
      return;
    } else {
      // Token is expired
      const claims = jose.decodeJwt(token);
      if (claims.exp > Date.now()) {
        Cookies.remove("access_token");
        navigate("/login");
      }
    }
  }
}

function buildCell(id, cell) {
  // function for mapping cell type to cell type's component
  switch (cell.type) {
    case "texting":
      return <TextingCell key={id} id={id} />;
    case "calendar":
      return <CalendarCell key={id} id={id} />;
    default:
      return <></>;
  }
}
