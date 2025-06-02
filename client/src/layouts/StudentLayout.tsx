import React from "react";
import { Outlet } from "react-router-dom";

const StudentLayout: React.FC = () => {
  return (
    <div className="flex">
      <aside className="w-64 bg-blue-200 h-screen p-4">
        <h2 className="text-lg font-bold">Student Panel</h2>
      </aside>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
