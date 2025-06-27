import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { NavigateFunction } from 'react-router-dom';
import { useAuth } from '../../services/authService';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  navigate: NavigateFunction;
  signIn: (email: string, password: string) => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  navigate,
  signIn,
  setIsLoading,
  setError
}) => {
  const { signInWithGoogle } = useAuth();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Fetch user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`
          }
        });
        
        const userInfo = await userInfoResponse.json();
        
        // Use the email and name from Google to sign in to your system
        // In a real implementation, you would create or retrieve the user
        // based on their Google account information
        const name = userInfo.name || `${userInfo.given_name} ${userInfo.family_name}`;
        await signInWithGoogle(userInfo.email, name);
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/interview');
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
        setError('Failed to sign in with Google. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google sign-in error:', errorResponse);
      setError('Failed to sign in with Google. Please try again.');
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;