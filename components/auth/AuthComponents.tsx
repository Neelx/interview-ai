import React from 'react';
import { useAuth } from '../../services/authService';

// SignedIn component - renders children only when user is signed in
export const SignedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoading } = useAuth();
  
  if (isLoading) {
    return null; // Or a loading spinner if preferred
  }
  
  return isSignedIn ? <>{children}</> : null;
};

// SignedOut component - renders children only when user is signed out
export const SignedOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoading } = useAuth();
  
  if (isLoading) {
    return null; // Or a loading spinner if preferred
  }
  
  return !isSignedIn ? <>{children}</> : null;
};

// RedirectToSignIn component - redirects to sign in page
export const RedirectToSignIn: React.FC = () => {
  // This is a simple redirect component
  // In a real app, you might want to use React Router's Navigate component
  React.useEffect(() => {
    window.location.href = '/signin';
  }, []);
  
  return null;
};

// Export all components
export { default as UserButton } from './UserButton';
export { default as SignInButton } from './SignInButton';
export { default as SignOutButton } from './SignOutButton';