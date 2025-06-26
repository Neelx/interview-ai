import React, { useEffect, useRef } from 'react';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';

interface QAEntry {
  id: string;
  question: string;
  answer: string;
}

interface ContentCardProps {
  title: string;
  statusText?: string;
  containerClassName?: string;
  isLoading?: boolean;
  qaHistory?: QAEntry[];
  currentLiveQuestion?: string;
  isFetchingCurrentAnswer?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  title, 
  statusText, 
  containerClassName, 
  isLoading,
  qaHistory = [],
  currentLiveQuestion,
  isFetchingCurrentAnswer
}) => {
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  const { isSignedIn } = useAuth();

  // Reverse the qaHistory to show latest first
  const reversedQaHistory = [...qaHistory].reverse();

  useEffect(() => {
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [qaHistory, isFetchingCurrentAnswer, currentLiveQuestion]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  const TypingDots = () => (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-green-600 font-medium text-sm">AI is typing...</span>
    </div>
  );

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${containerClassName || ''}`}>
      
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
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <p className="text-blue-100 text-sm font-medium">Live Interview Session</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-white text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Active</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div 
        ref={scrollableContentRef}
        className="p-8 max-h-[700px] overflow-y-auto space-y-8"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#3b82f6 #f1f5f9'
        }}
      > 
        {isLoading ? ( 
          <div className="flex flex-col items-center justify-center h-64 space-y-6">
            <LoadingSpinner />
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-700 mb-3">
                Initializing Interview Session
              </h3>
              <p className="text-gray-500 text-lg">Setting up AI assistant...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Current Live Question */}
            {isFetchingCurrentAnswer && currentLiveQuestion && (
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
                        <span className="text-blue-700 font-bold text-lg">Current Question</span>
                        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1"></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                      <p className="text-gray-800 text-base leading-relaxed font-medium">
                        {currentLiveQuestion}
                      </p>
                    </div>
                  </div>
                  
                  {/* AI Response Loading */}
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
                      <TypingDots />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Q&A History - Latest First */}
            {reversedQaHistory.map((item, index) => (
              <div 
                key={item.id}
                className="group relative"
              >
                {/* Subtle glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                  
                  {/* Question Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                          <span className="text-white text-lg font-bold">Q</span>
                        </div>
                        <div>
                          <span className="text-blue-700 font-bold text-lg">Question #{qaHistory.length - index}</span>
                          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1"></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 font-mono bg-gray-100 px-3 py-1 rounded-full">
                        Latest
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 ml-13">
                      <p className="text-gray-800 text-base leading-relaxed font-medium">
                        {item.question}
                      </p>
                    </div>
                  </div>

                  {/* Answer Section */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white text-lg font-bold">A</span>
                      </div>
                      <div>
                        <span className="text-green-700 font-bold text-lg">AI Response</span>
                        <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-1"></div>
                      </div>
                    </div>
                    <div className="ml-13">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-green-100">
                        <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Enhanced Status Footer */}
      {statusText && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-gray-700 text-sm font-semibold">{statusText}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="bg-white px-3 py-1 rounded-full shadow-sm">Interview Active</span>
              <span>•</span>
              <span>Real-time</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCard;