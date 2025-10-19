"use client";

import { EmailPasswordAuth } from "supertokens-auth-react/recipe/emailpassword";
import { SessionAuth } from "supertokens-auth-react/recipe/session";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmailPasswordAuth>
      <SessionAuth>
        {children}
      </SessionAuth>
    </EmailPasswordAuth>
  );
}
