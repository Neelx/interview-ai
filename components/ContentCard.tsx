
import React, { useEffect, useRef } from 'react';

interface QAEntry {
  id: string;
  question: string;
  answer: string;
}

interface ContentCardProps {
  title: string;
  statusText?: string;
  containerClassName?: string;
  isLoading?: boolean; // For overall card loading (e.g., chat init)
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

  useEffect(() => {
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = scrollableContentRef.current.scrollHeight;
    }
  }, [qaHistory, isFetchingCurrentAnswer, currentLiveQuestion]); // Scroll on new history item or when fetching new answer

  const commonLoadingSpinner = (text: string) => (
    <div className="flex items-center justify-center h-full p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-gray-600">{text}</p>
    </div>
  );

  return (
    <div className={`layout-content-container flex flex-col bg-white shadow-lg rounded-xl p-1 ${containerClassName || ''} border border-gray-200 overflow-hidden`}>
      <h2 className="text-[#101419] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pt-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div 
        ref={scrollableContentRef}
        className="px-4 py-3 flex-grow min-h-[150px] overflow-y-auto space-y-4" // Added space-y-4 for spacing between Q&A items
      > 
        {isLoading ? ( 
          commonLoadingSpinner("Initializing AI Assistant...")
        ) : qaHistory.length === 0 && !isFetchingCurrentAnswer ? (
          <p className="text-gray-500 text-center py-10">Your interview conversation will appear here.</p>
        ) : (
          <>
            {qaHistory.map((item) => (
              <div key={item.id} className="text-base">
                <p className="text-indigo-700 font-semibold mb-1">
                  <span className="font-bold">Q:</span> {item.question}
                </p>
                <p className="text-[#101419] font-normal leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-indigo-100">
                  <span className="font-bold text-gray-600">A:</span> {item.answer}
                </p>
              </div>
            ))}
            {isFetchingCurrentAnswer && currentLiveQuestion && (
              <div className="text-base">
                <p className="text-indigo-700 font-semibold mb-1">
                  <span className="font-bold">Q:</span> {currentLiveQuestion}
                </p>
                <div className="pl-4 border-l-2 border-indigo-100">
                    <span className="font-bold text-gray-600">A: </span>
                    <span className="italic text-gray-500">Thinking...</span>
                     {/* You can add a small spinner here if desired */}
                     {/* <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 ml-2"></div> */}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {statusText && (
        <p className="text-[#57738e] text-xs sm:text-sm font-normal leading-normal px-4 pt-2 pb-2 border-t border-gray-200 bg-gray-50 rounded-b-xl min-h-[30px] truncate" title={statusText}>
          {statusText}
        </p>
      )}
    </div>
  );
};

export default ContentCard;