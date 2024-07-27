import xmark from "../../assets/xmark-solid-white.svg";
import danger from "../../assets/triangle-exclamation-solid-white.svg";
import { useContext } from "react";
import { SnackbarContext } from "../../Contexts/Snackbar";

export default function ({ children }) {
  const { snackbarMessage } = useContext(SnackbarContext);

  return (
    <div>
      {children}
      {snackbarMessage != null && (
        <div className="absolute w-full top-2 z-50">
          <div className="flex mx-auto w-1/2 bg-gradient-to-r from-red-500 to-rose-400 text-sm rounded-lg py-2 font-semibold px-3 text-white">
            <img src={danger} className="w-3 mr-2" />
            <p>{snackbarMessage}</p>
            <img
              src={xmark}
              className="w-3 ml-auto hover:opacity-50 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
