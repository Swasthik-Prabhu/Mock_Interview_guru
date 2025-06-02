import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex">
      <aside className="w-64 bg-red-200 h-screen p-4">
        <h2 className="text-lg font-bold">Admin Panel</h2>
      </aside>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
