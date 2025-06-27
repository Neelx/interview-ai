import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authService';

interface SignOutButtonProps {
  children?: React.ReactNode;
  signOutCallback?: () => void;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ 
  children,
  signOutCallback
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      if (signOutCallback) {
        signOutCallback();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div onClick={handleSignOut} style={{ cursor: 'pointer' }}>
      {children || (
        <button
          className="relative flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-gray-700 font-medium text-sm"
          aria-label="Sign out"
        >
          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      )}
    </div>
  );
};

export default SignOutButton;