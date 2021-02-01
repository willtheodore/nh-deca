import * as React from "react";
import { AuthContext } from "../../utils/auth";
import AdminNav from "./adminNav";

interface AdminLayoutProps {
  children: React.ReactChild;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const user = React.useContext(AuthContext);
  return (
    <>
      {user !== null && <AdminNav />}
      <div className="container mx-auto mt-20">{children}</div>
    </>
  );
}
