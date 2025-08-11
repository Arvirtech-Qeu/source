import React from 'react';

interface InputProps {
  type?: string;
  id: string;
  name: string;
  value?: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
}

const Input1 = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  className = '',
  children,
  ...props
}: InputProps) => {
  if (type === 'select') {
    return (
      <select
        id={id}
        name={name}
        onChange={onChange as any}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:border-blue-500 ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }

  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        focus:border-blue-500 ${className}`}
      {...props}
    />
  );
};

export default Input1;
