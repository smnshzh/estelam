"use client";

import { SuperTokensProvider as STProvider } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

const clientConfig = {
  appInfo: {
    appName: "Estelam Platform",
    apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN || "http://localhost:3000",
    websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN || "http://localhost:3000",
    apiBasePath: "/api/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    EmailPassword.init(),
    Session.init()
  ]
};

export function SuperTokensProvider({ children }: { children: React.ReactNode }) {
  return (
    <STProvider config={clientConfig}>
      {children}
    </STProvider>
  );
}
