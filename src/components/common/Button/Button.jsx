"use client";
export default function Button({ onClick, children, className, color, ...props }) {
  return (
      <button 
        className={`
          ${color ? `bg-[${color}]` : 'bg-[#465C88]'}
          text-white
          px-6
          py-4
          rounded-lg
          hover:bg-black
          transition
          duration-500
          disabled:cursor-not-allowed
          disabled:bg-gray-400
          ${className ? ` ${className}` : ''}
        `}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
  );
} 