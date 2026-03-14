import React from 'react';

export function Select({ className = '', children, ...props }) {
  return (
    <div className={`relative w-full ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SelectTrigger({ className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-left text-sm text-gray-900 flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectContent({ className = '', children, ...props }) {
  return (
    <div
      className={`mt-2 w-full bg-white shadow-lg rounded-xl border border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({ className = '', children, ...props }) {
  return (
    <div
      className={`px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectValue({ className = '', children, ...props }) {
  return (
    <span className={`text-sm text-gray-600 ${className}`} {...props}>
      {children}
    </span>
  );
}

