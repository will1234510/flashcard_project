import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

// main layout component wrapping the application
// provides the header, sidebar, and main content area structure
function Layout() {
  // state to toggle sidebar visibility
  // default is false (closed)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-black flex flex-col">
      {/* header section with logo, toggle button, and navigation */}
      <header className="bg-gray-900 shadow-sm h-16 flex items-center justify-between px-4 sm:px-8 border-b border-gray-800 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          {/* hamburger button to toggle sidebar */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white p-1 rounded focus:outline-none"
            title="Toggle Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="text-white font-bold text-2xl tracking-tight">Nina's Flashcards</Link>
        </div>
        <nav className="space-x-6 hidden md:block">
          <Link to="/" className="text-gray-300 hover:text-white font-semibold border-b-2 border-white py-4 transition-colors">Flashcards</Link>
          <span className="text-gray-500 font-semibold py-4">Test (WIP)</span>
        </nav>
      </header>

      <div className="flex flex-1 max-w-full overflow-hidden relative">
        {/* left sidebar container */}
        {/* handles collapsible animation on desktop and absolute positioning on mobile */}
        <div 
          className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            ${isSidebarOpen ? 'md:w-64' : 'md:w-0 md:border-none'}
            absolute md:relative z-10 h-full 
            transition-all duration-300 ease-in-out 
            bg-black border-r border-gray-800 flex-shrink-0
            md:translate-x-0 overflow-hidden
          `}
        >
          <div className="w-64 h-full">
            <Sidebar />
          </div>
        </div>

        {/* mobile overlay to close sidebar when clicking outside */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 z-0 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* main content area for routing outlet */}
        {/* centers content and handles scrolling */}
        <main 
          className="flex-grow container mx-auto px-4 py-8 max-w-[1600px] flex flex-col items-center overflow-y-auto transition-all duration-300"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
