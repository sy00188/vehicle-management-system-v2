import React, { useState, createContext, useContext } from 'react';

interface AlertDialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

interface AlertDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  children,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

interface AlertDialogTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

const AlertDialogTrigger: React.FC<AlertDialogTriggerProps> = ({ children }) => {
  const context = useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogTrigger must be used within AlertDialog');
  
  const { setOpen } = context;
  
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      const childProps = children.props as any;
      if (childProps?.onClick) {
        childProps.onClick(e);
      }
      setOpen(true);
    },
  } as any);
};

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({
  children,
  className = '',
}) => {
  const context = useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogContent must be used within AlertDialog');
  
  const { open, setOpen } = context;
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => setOpen(false)}
      />
      <div 
        className={`
          relative z-50 w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
};

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left p-6 pb-2 ${className}`}>
      {children}
    </div>
  );
};

interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({
  children,
  className = '',
}) => {
  return (
    <h2 className={`text-lg font-semibold ${className}`}>
      {children}
    </h2>
  );
};

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({
  children,
  className = '',
}) => {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
};

interface AlertDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-2 ${className}`}>
      {children}
    </div>
  );
};

interface AlertDialogActionProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const context = useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogAction must be used within AlertDialog');
  
  const { setOpen } = context;
  
  const handleClick = () => {
    if (onClick) onClick();
    setOpen(false);
  };
  
  return (
    <button
      className={`
        inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white
        hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

interface AlertDialogCancelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const context = useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogCancel must be used within AlertDialog');
  
  const { setOpen } = context;
  
  const handleClick = () => {
    if (onClick) onClick();
    setOpen(false);
  };
  
  return (
    <button
      className={`
        mt-3 inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0
        ${className}
      `}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};

export type {
  AlertDialogProps,
  AlertDialogTriggerProps,
  AlertDialogContentProps,
  AlertDialogHeaderProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
};