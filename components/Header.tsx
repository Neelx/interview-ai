
import React from 'react';

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
  isFetchingAnswer: boolean; // True if fetching an answer OR if chat is initializing
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
  isFetchingAnswer
}) => {
  let statusMessage = "";
  if (!browserSupportsSpeechRecognition) {
    statusMessage = "Speech recognition not supported. Try Chrome.";
  } else if (speechError) {
    if (speechError.includes("permission")) {
      statusMessage = "Microphone permission denied. Enable in browser settings.";
    } else if (speechError.includes("no-speech")) {
        statusMessage = "No speech detected. Please speak clearly.";
    } else {
      statusMessage = `Speech Error: ${speechError}`;
    }
  } else if (isListening) {
    statusMessage = interimTranscript ? `"${interimTranscript}"` : "Listening...";
  } else if (isFetchingAnswer) {
    statusMessage = "AI assistant is busy, please wait...";
  } else {
    statusMessage = "Click 'Start Listening' and speak your question.";
  }

  return (
    <div className="py-2"> {/* Reduced overall vertical padding for header */}
      <div className="flex items-center justify-between whitespace-nowrap">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-4 text-[#101419]">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h1 className="text-[#101419] text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">Interview AI</h1>
        </div>

        {/* Center: Controls - flex-grow to push Help/Avatar to right, but keep controls somewhat centered */}
        <div className="flex-grow flex justify-center items-center gap-2 sm:gap-4 px-2 sm:px-4">
          <div className="flex-shrink-0 w-40 sm:w-48 md:w-56"> {/* Fixed width for select */}
            <label htmlFor="role-selector-header" className="sr-only">
              Select Role:
            </label>
            <select
              id="role-selector-header"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="block w-full pl-2 pr-8 py-1.5 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
              disabled={isListening || isFetchingAnswer}
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`flex-shrink-0 flex justify-center items-center py-1.5 px-2 sm:px-3 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            } ${!browserSupportsSpeechRecognition || isFetchingAnswer ? 'opacity-50 cursor-not-allowed' : ''} focus:outline-none focus:ring-2 focus:ring-offset-2`}
            disabled={!browserSupportsSpeechRecognition || isFetchingAnswer}
            aria-live="polite"
          >
            {isListening ? (
              <>
                <svg className="animate-pulse h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                  <path d="M5.5 9.5A.5.5 0 016 9h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" />
                  <path d="M9 14a1 1 0 011-1h0a1 1 0 011 1v3a1 1 0 01-1 1h0a1 1 0 01-1-1v-3z" />
                </svg>
                <span className="ml-1 sm:ml-2">Stop</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                  <path d="M5.5 9.5A.5.5 0 016 9h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" />
                  <path d="M9 14a1 1 0 011-1h0a1 1 0 011 1v3a1 1 0 01-1 1h0a1 1 0 01-1-1v-3z" />
                </svg>
                <span className="ml-1 sm:ml-2">Listen</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Help and Avatar */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-7 w-7 sm:h-8 sm:w-8 bg-[#e9edf1] text-[#101419] text-sm font-bold leading-normal tracking-[0.015em]"
            aria-label="Help"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"
              ></path>
            </svg>
          </button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-7 sm:size-8"
            style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNcLX_ensU-vuKHsWRr-jCEGzyli0hX5gy6mR_wuU_Pk_khL_AAgZgVlifRHeltIq0bP-_JM0tE3F6YUtOxA6vPjWTukg6EMuqEED6wIRmGSr6n-XKG8jVRFstDyIEMOACGhnclvHNabjzlj5ra4JcdXDmuUhoeZXy2qia17VlqUU2uXE2ZU2s_F70dbMLZGgJPzYjUIkAtxrbf5jHUdgGIwzkWKnRTEBytXTzvl8xkScsbzoGiEkwGVEl38-scjwIFe6FaL0ZNbNH")`}}
            role="img"
            aria-label="User avatar"
          ></div>
        </div>
      </div>
      {/* Status message row */}
      <div className="text-center text-xs sm:text-sm text-gray-600 pt-1 min-h-[18px] sm:min-h-[20px] truncate" aria-live="polite" title={statusMessage}>
        {statusMessage}
      </div>
    </div>
  );
};

export default Header;