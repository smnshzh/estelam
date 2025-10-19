"use client";

import { SuperTokensProvider as STProvider } from "supertokens-auth-react";

const clientConfig = {
  appInfo: {
    appName: "Estelam Platform",
    apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN || "http://localhost:3000",
    websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN || "http://localhost:3000",
    apiBasePath: "/api/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    {
      id: "emailpassword",
      name: "EmailPassword"
    },
    {
      id: "session",
      name: "Session"
    }
  ]
};

export function SuperTokensProvider({ children }: { children: React.ReactNode }) {
  return (
    <STProvider config={clientConfig}>
      {children}
    </STProvider>
  );
}
