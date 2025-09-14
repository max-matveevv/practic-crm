'use client';

import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseClasses = `
    w-full transition-colors duration-200 focus:outline-none resize-none
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
  `;

  const variantClasses = {
    default: `
      bg-white dark:bg-bg-1 border border-gray-300 dark:border-gray-600 
      focus:border-blue-500 focus:ring-1 focus:ring-blue-500
      hover:border-gray-400 dark:hover:border-gray-500
    `,
    filled: `
      bg-gray-50 dark:bg-gray-700 border border-transparent
      focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
      hover:bg-gray-100 dark:hover:bg-gray-600
    `,
    outlined: `
      bg-transparent border-2 border-gray-300 dark:border-gray-600
      focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
      hover:border-gray-400 dark:hover:border-gray-500
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-3 text-sm',
    lg: 'px-4 py-4 text-base'
  };

  const errorClasses = error 
    ? 'border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-red-500'
    : '';

  const textareaClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${errorClasses}
    ${className}
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    rounded-lg
  `.trim();

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        ref={ref}
        disabled={disabled}
        className={textareaClasses}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
