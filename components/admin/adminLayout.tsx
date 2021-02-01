import { setupMaster } from "cluster";
import * as React from "react";

interface AdminLayoutProps {
  children: React.ReactChild;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <div className="container mx-auto">{children}</div>;
}
