import React from 'react';

export default function Switch({ checked, onChange, className = '' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={`w-12 h-6 rounded-full px-1 flex items-center transition ${checked ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'} ${className}`}
    >
      <span className="w-4 h-4 bg-white rounded-full shadow" />
    </button>
  );
}

