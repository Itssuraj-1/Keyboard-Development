import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/**
 * Responsive dashboard layout with mobile-friendly sidebar
 */
const DashboardLayout = ({ children, onSearch }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={onSearch} onMenuToggle={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:w-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
