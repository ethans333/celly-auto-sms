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

export const WorkspaceContext = createContext();

export default function () {
  const [workspace, setWorkspace] = useState(data);
  const [sideBarChildren, setSideBarChildren] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [currentView, setCurrentView] = useState("numbers");

  const navigate = useNavigate();

  useEffect(() => {
    parseToken();
    validateToken();
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

  // Different views to render, shown based on the currentView state set in the left side bar.
  function renderViews(type) {
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
    let url = new URL(window.location.href);
    let hash = url.hash.substring(1); // remove the #
    let params = new URLSearchParams(hash);

    document.cookie = `access_token=${params.get(
      "access_token"
    )}; expires=${params.get("expires_in")}; path=/;SameSite=Strict;HttpOnly;`;
  }

  function validateToken() {
    const token = Cookies.get("access_token");

    if (!token) {
      // Token does not exist
      navigate("/login");
      return;
    } else {
      // Token is expired
      const claims = jose.decodeJwt(token);
      if (claims.exp > Date.now()) navigate("/login");
    }
  }
}

function buildCell(id, cell) {
  switch (cell.type) {
    case "texting":
      return <TextingCell key={id} id={id} />;
    case "calendar":
      return <CalendarCell key={id} id={id} />;
    default:
      return <></>;
  }
}
