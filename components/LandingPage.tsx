import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '../components/auth/AuthComponents';
import SignInButton from '../components/auth/SignInButton';
import UserButton from '../components/auth/UserButton';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    navigate('/interview');
  };
  
  // Function to render the Start Interview button based on authentication status
  const renderStartInterviewButton = () => {
    return (
      <>
        <SignedIn>
          <button
            onClick={handleStartInterview}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
          >
            Start Interview Session
          </button>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
            >
              Sign In to Start
            </button>
          </SignInButton>
        </SignedOut>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center justify-between w-full">
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
              
              {/* Authentication */}
              <div className="flex items-center gap-3">
                <SignedOut>
                  <SignInButton>
                    <button
                      className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white font-medium text-sm group overflow-hidden"
                      aria-label="Sign in"
                    >
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Sign In</span>
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
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Content */}
            <div className="lg:w-1/2 space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
                  Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Interview Skills</span> with AI
                </h1>
                <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                  Practice technical interviews with our AI assistant that simulates real interview scenarios. Get instant feedback and improve your skills for your next job opportunity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {renderStartInterviewButton()}
                <button 
                  onClick={() => navigate('/system-audio-demo')} 
                  className="px-8 py-4 bg-white text-slate-700 font-medium rounded-xl shadow-md hover:shadow-lg border border-slate-200 transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 text-center"
                >
                  Try System Audio Demo
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-all duration-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Voice Interaction</h3>
                  <p className="text-slate-600">Speak naturally and get real-time responses from our AI interviewer.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-all duration-200">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Multiple Roles</h3>
                  <p className="text-slate-600">Practice for various tech roles including Java, Python, Cloud, and more.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-all duration-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">System Audio Capture</h3>
                  <p className="text-slate-600">Capture and analyze system audio for enhanced interview experiences.</p>
                </div>
              </div>
            </div>

            {/* Right: Preview Card */}
            <div className="lg:w-1/2">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 right-4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                
                {/* Card Preview */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative z-10">
                  {/* Enhanced Header */}
                  <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">Interview Preview</h2>
                          <p className="text-blue-100 text-sm font-medium">Live Interview Session</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                        <span className="text-white text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="p-8 space-y-8">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
                      <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
                        {/* Question */}
                        <div className="mb-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                              <span className="text-white text-lg font-bold">Q</span>
                            </div>
                            <div>
                              <span className="text-blue-700 font-bold text-lg">Sample Question</span>
                              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1"></div>
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                            <p className="text-gray-800 text-base leading-relaxed font-medium">
                              Can you explain your experience with React hooks?
                            </p>
                          </div>
                        </div>
                        
                        {/* AI Response */}
                        <div className="border-t border-blue-200 pt-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                              <span className="text-white text-lg font-bold">A</span>
                            </div>
                            <div>
                              <span className="text-green-700 font-bold text-lg">AI Response</span>
                              <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-1"></div>
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-green-600 font-medium text-sm">AI is typing...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Status Footer */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                        <span className="text-gray-700 text-sm font-semibold">Ready to start</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="bg-white px-3 py-1 rounded-full shadow-sm">Preview Mode</span>
                        <span>•</span>
                        <span>Real-time</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="size-6 text-indigo-600">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-slate-700 font-medium">Interview AI</span>
            </div>
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} Interview AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Animation styles */}
</div>
  );
};

export default LandingPage;