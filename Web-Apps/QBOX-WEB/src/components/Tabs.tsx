import React, { useState } from 'react';
const Tabs = ({
  children,
  defaultValue,
  className,
  value,
  onValueChange, // Add the onValueChange prop
}) => {
  // Use controlled or uncontrolled logic for `selectedTab`
  const [selectedTab, setSelectedTab] = useState(defaultValue || children[0]?.props?.value);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue); // Update local state
    if (onValueChange) {
      onValueChange(newValue); // Trigger callback if provided
    }
  };

  return (
    <div className={`tabs ${className}`}>
      {React.Children.map(children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, {
            selectedTab,
            onTabChange: handleTabChange, // Pass the handler to TabsList
            className
          });
        }
        if (child.type === TabsContent && child.props.value === selectedTab) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

const TabsList = ({ selectedTab, setSelectedTab, children, className }) => {
  return (
    <div className={`flex space-x-4 border-b ${className}`}> {/* Use className here */}
      {React.Children.map(children, (child) => (
        <div
          onClick={() => setSelectedTab(child.props.value)}
          className={`cursor-pointer py-2 px-4 ${child.props.value === selectedTab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          {child.props.children}
        </div>
      ))}
    </div>
  );
};

const TabsTrigger = ({ children, value, className, onClick }) => {
  return <div onClick={onClick}>{children}</div>;
};

const TabsContent = ({ value, children, className }) => {
  return value ? <div className=''>{children}</div> : null;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
