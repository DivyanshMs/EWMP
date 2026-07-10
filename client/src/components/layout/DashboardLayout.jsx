import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * DashboardLayout.jsx
 * Phase C3.1 — Stitch UI Implementation (Global Layout)
 * 
 * Main authenticated enterprise layout: Sidebar + Topbar + Content Canvas.
 * Uses Precision Enterprise Design System colors (#faf8ff light surface, #0a0a0a dark surface).
 * Responsive across 1920 down to 390 viewports with zero viewport overflow.
 */
const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#faf8ff] dark:bg-[#0a0a0a] text-[#191b23] dark:text-white font-sans overflow-hidden antialiased select-none">
      {/* Fixed-width collapsible Sidebar (hidden on mobile, visible md+) */}
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Right Column: Sticky Topbar + Scrollable Main Content Canvas */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMobileMenuClick={() => setMobileMenuOpen(true)} />

        {/* Main Content Area — scrolls independently of sidebar */}
        <main 
          id="main-content"
          role="main" 
          className="flex-1 overflow-y-auto bg-[#faf8ff] dark:bg-[#0a0a0a] scrollbar-thin"
        >
          <div className="p-4 sm:p-6 md:p-8 max-w-[1920px] mx-auto min-h-full transition-all duration-200">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
