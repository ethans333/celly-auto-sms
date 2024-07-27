import { useState, createContext } from "react";
import Snackbar from "../Components/UI/Snackbar";
export const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  return (
    <SnackbarContext.Provider
      value={{
        snackbarMessage,
        setSnackbarMessage,
      }}
    >
      <Snackbar>{children}</Snackbar>
    </SnackbarContext.Provider>
  );
}
