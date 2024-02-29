import { LogLevel } from "@azure/msal-browser";

// Need to configure app to be multi tenant

export const msalConfig = {
  auth: {
    clientId: "5fab5847-ef7f-47d1-aef3-2cc2fef5a259",
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
