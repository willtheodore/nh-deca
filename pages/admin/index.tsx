import * as React from "react";
import SignIn from "../../components/admin/signIn";
import { AuthContext } from "../../utils/auth";

export default function AdminHome() {
  const user = React.useContext(AuthContext);

  if (user === null) return <SignIn />;

  return <div></div>;
}
