import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const activeClass = "inline-flex items-center px-1 pt-1 border-b-2 border-purple-600 text-sm font-semibold text-gray-900 dark:text-white transition-colors";
  const inactiveClass = "inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 transition-colors";

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                NCIT College Sandbox
              </NavLink>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? activeClass : inactiveClass}
                end
              >
                Students
              </NavLink>
              <NavLink 
                to="/student/create" 
                className={({ isActive }) => isActive ? activeClass : inactiveClass}
              >
                Create Student
              </NavLink>
              <NavLink 
                to="/admin/api-log" 
                className={({ isActive }) => isActive ? activeClass : inactiveClass}
              >
                API Logs
              </NavLink>
            </div>
          </div>

          {/* Simple Mobile Navigation Header link/icon */}
          <div className="flex sm:hidden items-center space-x-4">
            <NavLink to="/" className={({ isActive }) => isActive ? "text-purple-600 font-semibold text-xs" : "text-gray-500 text-xs"} end>
              Students
            </NavLink>
            <NavLink to="/student/create" className={({ isActive }) => isActive ? "text-purple-600 font-semibold text-xs" : "text-gray-500 text-xs"}>
              + Create
            </NavLink>
            <NavLink to="/admin/api-log" className={({ isActive }) => isActive ? "text-purple-600 font-semibold text-xs" : "text-gray-500 text-xs"}>
              Logs
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
