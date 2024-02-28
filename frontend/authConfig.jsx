import { LogLevel } from "@azure/msal-browser";

// Need to configure app to be multi tenant

export const msalConfig = {
  auth: {
    clientId: "d9db3528-aff5-4586-83c6-76c04fa18dc2",
    redirectUri: "http://localhost:5173",
    postLogoutRedirectUri: "/",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    temporaryCacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
    secureCookies: false,
    claimsBasedCachingEnabled: true,
  },
  system: {
    loggerOptions: {
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};
