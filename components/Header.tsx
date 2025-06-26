import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface HeaderProps {
  currentRole: string;
  setCurrentRole: (role: string) => void;
  roles: string[];
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  speechError: string | null;
  browserSupportsSpeechRecognition: boolean;
  interimTranscript: string;
  isFetchingAnswer: boolean;
  onNavigateHome?: () => void; // Function to navigate to main page
  user?: User | null; // Current authenticated user
  onSignIn?: () => void; // Function to handle Google sign in
  onSignOut?: () => void; // Function to handle sign out
}

const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  roles,
  isListening,
  startListening,
  stopListening,
  speechError,
  browserSupportsSpeechRecognition,
  interimTranscript,
  isFetchingAnswer,
  onNavigateHome,
  user,
  onSignIn,
  onSignOut
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Status message logic
  let statusMessage = "";
  let statusColor = "text-gray-600";

  if (!browserSupportsSpeechRecognition) {
    statusMessage = "Speech recognition not supported. Try Chrome.";
    statusColor = "text-red-500";
  } else if (speechError) {
    if (speechError.includes("permission")) {
      statusMessage = "Microphone permission denied. Enable in browser settings.";
      statusColor = "text-red-500";
    } else if (speechError.includes("no-speech")) {
      statusMessage = "No speech detected. Please speak clearly.";
      statusColor = "text-amber-500";
    } else {
      statusMessage = `Speech Error: ${speechError}`;
      statusColor = "text-red-500";
    }
  } else if (isListening) {
    statusMessage = interimTranscript ? `"${interimTranscript}"` : "Listening...";
    statusColor = "text-green-500";
  } else if (isFetchingAnswer) {
    statusMessage = "AI assistant is busy, please wait...";
    statusColor = "text-blue-500";
  } else {
    statusMessage = "Click 'Start Listening' and speak your question.";
    statusColor = "text-gray-600";
  }

  const handleRoleSelect = (role: string) => {
    setCurrentRole(role);
    setShowRoleDropdown(false);
  };

  return (
    <div className="relative">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo and Title - Static */}
            <div className="flex items-center gap-3">
              <div className="size-8 text-indigo-600">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-slate-800 text-xl font-bold leading-tight tracking-tight">
                  Interview AI
                </h1>
                <p className="text-xs text-slate-500 -mt-1">Practice & Excel</p>
              </div>
            </div>

            {/* Center: Enhanced Controls */}
            <div className="flex items-center gap-4">
              
              {/* Role Selector with Custom Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  disabled={isListening || isFetchingAnswer}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="size-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {currentRole}
                    </span>
                  </div>
                  <svg 
                    className={`size-4 text-slate-400 transition-transform duration-200 ${showRoleDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Custom Dropdown */}
                {showRoleDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="py-2">
                      {roles.map((role, index) => (
                        <button
                          key={role}
                          onClick={() => handleRoleSelect(role)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-indigo-50 flex items-center gap-3 ${
                            currentRole === role ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'
                          }`}
                        >
                          <div className={`size-2 rounded-full ${
                            currentRole === role ? 'bg-indigo-500' : 'bg-slate-300'
                          }`}></div>
                          {role}
                          {currentRole === role && (
                            <svg className="size-4 text-indigo-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Listen Button */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`relative flex items-center gap-3 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
                  isListening 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500 text-white' 
                    : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 focus:ring-indigo-500 text-white'
                } ${!browserSupportsSpeechRecognition || isFetchingAnswer ? 'grayscale' : ''}`}
                disabled={!browserSupportsSpeechRecognition || isFetchingAnswer}
                aria-live="polite"
              >
                {isListening ? (
                  <>
                    <div className="relative">
                      <svg className="size-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                        <path d="M5.5 9.5A.5.5 0 016 9h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" />
                        <path d="M9 14a1 1 0 011-1h0a1 1 0 011 1v3a1 1 0 01-1 1h0a1 1 0 01-1-1v-3z" />
                      </svg>
                      <div className="absolute inset-0 bg-white rounded-full opacity-0 animate-ping"></div>
                    </div>
                    <span>Stop Listening</span>
                  </>
                ) : (
                  <>
                    <svg className="size-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                      <path d="M5.5 9.5A.5.5 0 016 9h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" />
                      <path d="M9 14a1 1 0 011-1h0a1 1 0 011 1v3a1 1 0 01-1 1h0a1 1 0 01-1-1v-3z" />
                    </svg>
                    <span>Start Listening</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Authentication */}
            <div className="flex items-center gap-3">
              
              {/* Help Button */}
              <button
                className="flex items-center justify-center size-10 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm hover:shadow-md"
                aria-label="Help"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                </svg>
              </button>

              {/* Clerk Authentication - Replace the custom button */}
              <SignedOut>
                <SignInButton>
                  <button
                    className="relative size-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group overflow-hidden"
                    aria-label="Sign in"
                  >
                    {/* User Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    
                    {/* Animated Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-white opacity-0 group-hover:opacity-30 animate-ping"></div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-200"></div>
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "size-10 rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Status Bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-3">
            <div className="flex items-center gap-2">
              {/* Status Indicator */}
              <div className={`size-2 rounded-full ${
                isListening ? 'bg-green-500 animate-pulse' : 
                isFetchingAnswer ? 'bg-blue-500 animate-pulse' : 
                speechError ? 'bg-red-500' : 'bg-slate-300'
              }`}></div>
              
              {/* Status Message */}
              <p className={`text-sm font-medium ${statusColor} transition-colors duration-200`} aria-live="polite">
                {statusMessage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Click Outside Handlers */}
      {(showRoleDropdown || showUserMenu) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowRoleDropdown(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default Header;