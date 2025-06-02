import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaCog,
  FaSearch,
  FaChartBar,
  FaUsers,
  FaUserGraduate,
  FaCalendarAlt,
  FaClipboardList,
  FaBars,
  FaBell
} from 'react-icons/fa';

const InstitutionLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-[#070B39] text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="text-xl font-bold">SchoolGhor</div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <FaBars />
          </button>
        </div>
        
        <nav className="mt-8">
          <NavItem 
            to="/institution/dashboard" 
            icon={<FaHome />} 
            text="Dashboard" 
            collapsed={isSidebarCollapsed}
            active={location.pathname === '/institution/dashboard'}
          />
          <NavItem 
            to="/institution/students" 
            icon={<FaUsers />} 
            text="Students" 
            collapsed={isSidebarCollapsed}
            active={location.pathname === '/institution/students'}
          />
          <NavItem 
            to="/institution/teachers" 
            icon={<FaUserGraduate />} 
            text="Teachers" 
            collapsed={isSidebarCollapsed}
            active={location.pathname === '/institution/teachers'}
          />
          <NavItem 
            to="/institution/analytics" 
            icon={<FaChartBar />} 
            text="Analytics" 
            collapsed={isSidebarCollapsed}
            active={location.pathname === '/institution/analytics'}
          />
          <NavItem 
            to="/institution/schedule" 
            icon={<FaCalendarAlt />} 
            text="Schedule" 
            collapsed={isSidebarCollapsed}
            active={location.pathname === '/institution/schedule'}
          />
          <NavItem 
            to="/institution/reports" 
            icon={<FaClipboardList />} 
            text="Reports" 
            collapsed={isSidebarCollapsed}
            active={location.pathname === '/institution/reports'}
          />
          <NavItem 
            to="/institution/settings" 
            icon={<FaCog />} 
            text="Settings" 
            collapsed={isSidebarCollapsed}
            active={location.pathname === '/institution/settings'}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 bg-transparent outline-none w-full"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <FaBell className="text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">Admin Name</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

// Helper Components
interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  collapsed: boolean;
  active?: boolean;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, collapsed, active, to }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 ${
      active ? 'bg-indigo-700' : 'hover:bg-gray-700'
    } transition-colors duration-200`}
  >
    <span className="text-xl">{icon}</span>
    {!collapsed && <span className="ml-3">{text}</span>}
  </Link>
);

export default InstitutionLayout; 