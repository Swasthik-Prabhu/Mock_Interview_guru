import React from "react";
import { Outlet } from "react-router-dom";

const StudentLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
