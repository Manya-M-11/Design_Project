import React from 'react';

/* Main Card */
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

/* Card Header */
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 pt-6 ${className}`}>
      {children}
    </div>
  );
}

/* Card Content */
export function CardContent({ children, className = '' }) {
  return (
    <div className={`px-6 pb-6 ${className}`}>
      {children}
    </div>
  );
}

/* Card Title */
export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}
