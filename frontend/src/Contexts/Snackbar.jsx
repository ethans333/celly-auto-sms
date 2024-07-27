import { useState, createContext, useEffect } from "react";
import Snackbar from "../Components/UI/Snackbar";
export const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  useEffect(() => {
    if (snackbarMessage) {
      setTimeout(() => {
        setSnackbarMessage(null);
      }, 3000);
    }
  }, [snackbarMessage]);

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
