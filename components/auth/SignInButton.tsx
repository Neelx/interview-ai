import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SignInButtonProps {
  children?: React.ReactNode;
  mode?: 'modal' | 'redirect';
  redirectUrl?: string;
}

const SignInButton: React.FC<SignInButtonProps> = ({ 
  children, 
  mode = 'redirect',
  redirectUrl = '/signin'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(redirectUrl);
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {children || (
        <button
          className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white font-medium text-sm group overflow-hidden"
          aria-label="Sign in"
        >
          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Sign In</span>
        </button>
      )}
    </div>
  );
};

export default SignInButton;