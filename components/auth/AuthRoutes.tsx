import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useAuth } from '../../services/authService';

// Protected route component that redirects to sign in if not authenticated
export const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isSignedIn, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect to sign in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/signin" replace />;
  }
  
  // Render the protected component if authenticated
  return element;
};

// Auth routes component that renders sign in and sign up pages
const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default AuthRoutes;