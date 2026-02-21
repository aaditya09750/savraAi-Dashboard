import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";
  
  const variants = {
    primary: "bg-[#8B5CF6] text-white hover:bg-[#7c3aed] shadow-sm hover:shadow-md",
    secondary: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    outline: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
    ghost: "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50",
    icon: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2 w-10 h-10",
  };

  return (
    <button 
      className={twMerge(
        clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full"
        ),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
