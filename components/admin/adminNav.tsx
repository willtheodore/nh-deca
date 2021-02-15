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

      <div className="flex items-center">
        <AdminNavLink slug="/admin/news" label="News" />
        <AdminNavLink slug="/admin/calendar" label="Calendar" />
        <AdminNavLink slug="/admin/sections" label="sections" />
        <AdminNavLink slug="/admin/pages" label="pages" />
        <AdminNavLink slug="/admin/admin-code" label="admin Code" />
        <button
          className="px-6 py-2 bg-gray-100 rounded-md text-decaBlue inline uppercase  tracking-wider hover:bg-blue-100 transition duration-300"
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
          "text-xs uppercase self-center": true,
          "white-rounded": white,
          "blue-rounded": !white,
        })}
      >
        {label ? label : slug}
      </a>
    </Link>
  );
}
