import * as React from "react";
import Link from "next/link";
import classNames from "classnames";
import { signOutUser } from "../../utils/auth";

export default function AdminNav() {
  const signOut = async () => {
    await signOutUser();
  };

  return (
    <div className="flex items-center px-5 bg-decaBlue fixed top-0 inset-x-0 h-20 justify-between z-30">
      <AdminNavLink white slug="/" label="< Website home" />

      <div className="flex items-center space-x-2">
        <AdminNavLink slug="/admin/photos" label="photos" />
        <AdminNavLink slug="/admin/sections" label="sections" />
        <AdminNavLink slug="/admin/pages" label="pages" />
        <AdminNavLink slug="/admin/adminCode" label="admin Code" />
        <button
          className="px-6 py-2 mt-2 bg-gray-100 rounded-md text-decaBlue inline uppercase  tracking-wider hover:bg-blue-100 transition duration-300"
          onClick={signOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

interface AdminNavLinkProps {
  slug: string;
  white?: boolean;
  label?: string;
}

function AdminNavLink({ slug, white, label }: AdminNavLinkProps) {
  return (
    <Link href={slug}>
      <a
        className={classNames({
          "px-6 py-2 mt-2 rounded-md inline uppercase tracking-wider transition duration-300 shadow-md": true,
          "text-decaBlue bg-gray-100 hover:bg-blue-100": white,
          "text-white hover:bg-blue-500": !white,
        })}
      >
        {label ? label : slug}
      </a>
    </Link>
  );
}
