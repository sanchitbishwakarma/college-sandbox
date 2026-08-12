import React from 'react';

export default function LoadingState({ message = 'Loading details...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-purple-100 dark:border-purple-950"></div>
        <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-medium text-sm animate-pulse">
        {message}
      </p>
    </div>
  );
}
