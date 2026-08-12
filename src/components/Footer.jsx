import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} College Integration API. All rights reserved.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 sm:mt-0 font-medium">
          Developed by <span className="text-gray-700 dark:text-gray-300 font-semibold">Sanchit</span>
        </p>
      </div>
    </footer>
  );
}
