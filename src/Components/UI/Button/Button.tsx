"use client";

import React from 'react'; // Import React for its types

type buttonType = 'underline' | 'filled' | 'default';

interface ButtonProps {
  label: string;
  variant: buttonType;
  count?: number;
  styles?: React.CSSProperties;
  clickFn?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive?: boolean;
  icon?: React.ReactNode; // <-- 1. Add the icon prop
}

const Button: React.FC<ButtonProps> = ({ label, variant, count, styles, clickFn, isActive, icon }) => {
  // Common styles for aligning the icon and label
  const flexStyles = "flex items-center gap-2";

  return (
    <>
      {variant === 'underline' ? (
        <button onClick={clickFn} style={styles} className={`cursor-pointer underline border-none bg-transparent p-0 ${flexStyles}`}>
          {icon} {/* <-- 2. Render the icon */}
          <span>{label || 'Click me'}</span>
        </button>
      ) : variant === 'filled' ? (
        <button onClick={clickFn} style={styles} className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${flexStyles}`}>
          {icon} {/* <-- 2. Render the icon */}
          <span>{label || 'Click me'}</span>
        </button>
      ) : (
        <button
          onClick={clickFn}
          style={styles}
          className={`cursor-pointer outline-none ${isActive ? '!text-[#000] !border-b-2 !border-[#000]' : 'text-[#737373] border-none'} ${flexStyles}`}
        >
          {icon} {/* <-- 2. Render the icon */}
          <span>{label || 'Click me'}</span>
          {count && <span className="ml-1 bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{count}</span>}
        </button>
      )}
    </>
  );
};

export default Button;
