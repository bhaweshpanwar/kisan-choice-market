// import { ReactNode } from "react";
// import { Sidebar } from "./Sidebar";
// import { TopBar } from "./TopBar";

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
//   return (
//     <div className="flex h-screen bg-background">
//       {/* Sidebar (mobile-collapsible) */}
//       <Sidebar />

//       {/* Main content area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <TopBar />
//         <main className="flex-1 overflow-y-auto p-4 md:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// components/layout/DashboardLayout.tsx
import { useState, ReactNode } from 'react'; // Import useState
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar: Pass state and setter/toggler */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main content area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* TopBar: Pass the toggle function to the menu button */}
        <TopBar onMenuClick={toggleSidebar} />
        <main className='flex-1 overflow-y-auto p-4 md:p-6'>
          <Outlet />
        </main>
      </div>

      {/* Overlay: Shown when sidebar is open on mobile, to close it on click */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-black/50 md:hidden' // Only on mobile
          onClick={toggleSidebar}
          aria-hidden='true'
        />
      )}
    </div>
  );
};
