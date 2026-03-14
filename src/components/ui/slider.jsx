import React from 'react';

export default function Slider({ className = '', ...props }) {
  return (
    <input
      type="range"
      className={`w-full h-2 bg-gray-200 rounded-full accent-emerald-500 ${className}`}
      {...props}
    />
  );
}

