// Alert Component
import React, { ReactNode, ReactElement } from "react";


const Alert = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'destructive' }) => {
    const baseClasses = "p-4 rounded-lg flex items-center gap-2";
    const variantClasses = {
      default: "bg-gray-800 text-gray-200",
      destructive: "bg-red-600 text-white"
    };
  
    return (
      <div className={`${baseClasses} ${variantClasses[variant]}`}>
        {children}
      </div>
    );
  };
  
  const AlertDescription = ({ children }: { children: React.ReactNode }) => (
    <div className="text-sm">{children}</div>
  );
  
  // Dialog Components
  const Dialog = ({ children, open, onOpenChange }: { 
    children: React.ReactNode; 
    open: boolean; 
    onOpenChange: (open: boolean) => void;
  }) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="fixed inset-0 bg-black/50" 
          onClick={() => onOpenChange(false)} // Close the dialog on overlay click
        />
        <div className="relative z-50 bg-gray-900 rounded-lg shadow-xl max-w-lg w-full mx-4">
          {children}
        </div>
      </div>
    );
  };
  
  const DialogContent = ({ children }: { children: React.ReactNode }) => (
    <div className="p-6">{children}</div>
  );
  
  const DialogHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-4">{children}</div>
  );
  
  const DialogTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-semibold text-white">{children}</h2>
  );
  
  const DialogTrigger = ({ 
    asChild, 
    children, 
    onClick 
  }: { 
    asChild?: boolean; 
    children: React.ReactNode;
    onClick?: () => void;
  }) => {
    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        onClick
      });
    }
    return (
      <button onClick={onClick}>
        {children}
      </button>
    );
  };
  
  // Tooltip Components

  const Tooltip = ({ children }: { children: ReactNode }) => (
    <div className="relative inline-block group">{children}</div>
  );
  
  const TooltipTrigger = ({
    asChild,
    children,
  }: {
    asChild?: boolean;
    children: ReactNode;
  }) => {
    if (asChild && React.isValidElement(children)) {
      // Safely typecast children to ReactElement
      const child = children as ReactElement;
  
      // Clone the child safely and append the className
      return React.cloneElement(child, {
        className: `${child.props.className || ""} group-hover:cursor-pointer`,
      });
    }
  
    // Fallback to wrapping children in a button if asChild is not specified
    return <button className="group-hover:cursor-pointer">{children}</button>;
  };
  
  const TooltipContent = ({ children }: { children: ReactNode }) => (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
      {children}
    </div>
  );
  
  
  // Badge Component
  const Badge = ({ 
    children, 
    className = "", 
    variant = "default" 
  }: { 
    children: React.ReactNode; 
    className?: string; 
    variant?: "default" | "secondary"; 
  }) => {
    const baseClasses = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors";
    const variantClasses = {
      default: "bg-gray-800 text-white",
      secondary: "bg-gray-700 text-gray-200"
    };
  
    return (
      <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
        {children}
      </span>
    );
  };
  
  export {
    Alert,
    AlertDescription,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    Badge
  };