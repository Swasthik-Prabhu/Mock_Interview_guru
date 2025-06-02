import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative w-16 h-16">
        {/* Outer circle */}
        <div className="absolute inset-0 bg-indigo-600 rounded-full"></div>
        {/* Inner circle with graduation cap */}
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14v7"
            />
          </svg>
        </div>
        {/* Small circle decorations */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-400 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 bg-indigo-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default Logo; 