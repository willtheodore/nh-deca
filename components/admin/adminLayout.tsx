import * as React from "react";
import { AuthContext } from "../../utils/auth";
import AdminNav from "./adminNav";

interface AdminLayoutProps {
  children: React.ReactChild;
  signIn?: boolean;
}

export default function AdminLayout({ children, signIn }: AdminLayoutProps) {
  const user = React.useContext(AuthContext);
  return (
    <>
      {user && <AdminNav />}
      {(signIn || user) && (
        <div className="container mx-auto mt-20">{children}</div>
      )}
    </>
  );
}
