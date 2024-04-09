import { LogLevel } from "@azure/msal-browser";

// Need to configure app to be multi tenant

export const msalConfig = {
  auth: {
    clientId: "746d9d45-cad6-43ee-8677-a3942d0e3573",
    redirectUri: "http://localhost:5173",
    authority: "https://login.microsoftonline.com/common",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
  // system: {
  //   loggerOptions: {
  //     // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  //     loggerCallback: (level, message, containsPii) => {
  //       if (containsPii) {
  //         return;
  //       }
  //       switch (level) {
  //         case LogLevel.Error:
  //           console.error(message);
  //           return;
  //         case LogLevel.Info:
  //           console.info(message);
  //           return;
  //         case LogLevel.Verbose:
  //           console.debug(message);
  //           return;
  //         case LogLevel.Warning:
  //           console.warn(message);
  //           return;
  //       }
  //     },
  //   },
  // },
};
