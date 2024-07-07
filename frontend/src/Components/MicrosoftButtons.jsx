import windows from "../assets/windows.svg";
import { useState } from "react";
import load from "../assets/circle-notch-solid.svg";
import * as api from "../api";

export function LinkToGraph() {
  return (
    <div
      onClick={login}
      className="flex space-x-3 rounded-lg shadow w-full px-5 py-3 cursor-pointer hover:opacity-50 bg-black text-white"
    >
      <img src={windows} alt="microsoft-logo" className="w-5" />
      <div className="font-[400]">Link Microsoft Account</div>
    </div>
  );

  function login() {
    api.initializeMicrosoftESL().then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          localStorage.setItem("microsoft-flow", JSON.stringify(data.flow));
          window.location.href = data.url;
        });
      }
    });
  }
}

export function AlreadyLinked() {
  return (
    <div className="flex space-x-3 rounded-lg shadow w-full px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
      <img src={windows} alt="microsoft-logo" className="w-5" />
      <div className="font-[500]">Microsoft Linked</div>
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex space-x-3 rounded-lg shadow w-full px-5 py-3 bg-white">
      <img src={load} alt="loading" className="w-5 animate-spin" />
      <div className="font-[400]">Fetching...</div>
    </div>
  );
}
