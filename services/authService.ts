import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// Define authentication context interface
interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: (email: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'Demo User',
    avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff'
  },
  {
    id: '2',
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User',
    avatar: 'https://ui-avatars.com/api/?name=Test+User&background=0D8ABC&color=fff'
  }
];

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isSignedIn: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {}
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching credentials
      const matchedUser = MOCK_USERS.find(
        user => user.email === email && user.password === password
      );
      
      if (!matchedUser) {
        throw new Error('Invalid email or password');
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = matchedUser;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(user => user.email === email)) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        email,
        password,
        name,
        avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0D8ABC&color=fff`
      };
      
      // In a real app, you would save this to a database
      // For demo, we'll just pretend it worked
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear user from state and localStorage
      setUser(null);
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google function
  const signInWithGoogle = async (email: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = MOCK_USERS.find(user => user.email === email);
      
      let userToSignIn;
      
      if (existingUser) {
        // User exists, sign them in
        const { password: _, ...userWithoutPassword } = existingUser;
        userToSignIn = userWithoutPassword;
      } else {
        // Create new user for Google sign-in
        const newUser = {
          id: `${MOCK_USERS.length + 1}`,
          email,
          password: 'google-auth-user', // Not used for Google auth
          name,
          avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0D8ABC&color=fff`
        };
        
        // In a real app, you would save this to a database
        // For demo, we'll just pretend it worked
        
        // Create user object without password
        const { password: _, ...userWithoutPassword } = newUser;
        userToSignIn = userWithoutPassword;
      }
      
      // Store user in state and localStorage
      setUser(userToSignIn);
      localStorage.setItem('auth_user', JSON.stringify(userToSignIn));
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Value object that will be passed to components using this context
  const value = {
    user,
    isSignedIn: !!user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export default AuthContext;