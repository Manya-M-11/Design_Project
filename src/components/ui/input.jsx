import React from 'react';

const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${className}`}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;

