import * as React from "react";
import AdminLayout from "../../components/admin/adminLayout";
import SignIn from "../../components/admin/signIn";
import { AuthContext } from "../../utils/auth";

export default function AdminHome() {
  const user = React.useContext(AuthContext);

  if (user === null) return <SignIn />;

  return (
    <AdminLayout>
      <div className="flex items-center h-screen">
        <h1 className="text-white text-7xl transform -translate-y-1/2 font-semibold">
          Welcome to the NH DECA admin center. <br /> Click a link at the top to
          begin.
        </h1>
      </div>
    </AdminLayout>
  );
}
