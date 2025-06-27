
import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ContentCard from './components/ContentCard';
import LandingPage from './components/LandingPage';
import SystemAudioDemo from './components/SystemAudioDemo';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import { Chat } from '@google/genai'; 
import { createNewChat, getInitialGreeting, sendMessageToChat } from './services/geminiService';
import { SignedIn, SignedOut, RedirectToSignIn } from './components/auth/AuthComponents';
import { ProtectedRoute } from './components/auth/AuthRoutes';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

interface QAEntry {
  id: string;
  question: string;
  answer: string;
}

// Interview component that contains the original App functionality
const InterviewInterface: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<string>("Java Developer");
  const [qaHistory, setQaHistory] = useState<QAEntry[]>([]);
  
  const [currentLiveQuestionFromSpeech, setCurrentLiveQuestionFromSpeech] = useState<string>("");
  const [currentSuggestedAnswerFromGemini, setCurrentSuggestedAnswerFromGemini] = useState<string>(""); 
  
  const [isFetchingAnswer, setIsFetchingAnswer] = useState<boolean>(false);
  const [isChatInitializing, setIsChatInitializing] = useState<boolean>(true); 
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);

  const availableRoles = [
    "Java Developer", "Python Developer", "Cloud Engineer", "SAP Consultant", 
    "Frontend Developer", "Backend Developer", "Data Scientist", "DevOps Engineer", 
    "Cybersecurity Analyst", "AI/ML Engineer"
  ];

  useEffect(() => {
    const initializeChat = async () => {
      setIsChatInitializing(true);
      setGeminiError(null);
      setQaHistory([]); 
      setCurrentLiveQuestionFromSpeech(""); 
      setChatInstance(null); 

      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        const errorMsg = "API Key not configured. Please set the API_KEY environment variable.";
        console.error(errorMsg);
        setGeminiError(errorMsg);
        setQaHistory([{ id: 'init-error', question: "System Error", answer: "API Key not configured. AI assistant is disabled." }]);
        setIsChatInitializing(false);
        return;
      }

      try {
        const newChat = createNewChat();
        const greeting = await getInitialGreeting(newChat, currentRole);
        setChatInstance(newChat);
        setQaHistory([{ id: 'init-greeting', question: `${currentRole} Session Started`, answer: greeting }]);
      } catch (e: any) {
        console.error("Error initializing chat with Gemini:", e);
        const errorMessage = e.message || "Failed to initialize chat. Check console.";
        setGeminiError(`Chat Initialization Error: ${errorMessage}`);
        setQaHistory([{ id: 'init-error-detail', question: "System Error", answer: `Sorry, an error occurred during initialization: ${errorMessage}` }]);
      } finally {
        setIsChatInitializing(false);
      }
    };

    initializeChat();
  }, [currentRole]);


  const sendQuestionToChat = useCallback(async (questionText: string) => {
    if (!questionText.trim()) {
      setGeminiError("Cannot process an empty question.");
      return;
    }
    if (!chatInstance) {
      setGeminiError("Chat is not initialized. Please wait or select a role.");
      return;
    }
    if (isChatInitializing) {
        setGeminiError("Chat is currently initializing with the new role. Please wait.");
        return;
    }

    setIsFetchingAnswer(true);
    setGeminiError(null);
    setCurrentLiveQuestionFromSpeech(questionText); 

    try {
      const newAnswer = await sendMessageToChat(chatInstance, questionText);
      setCurrentSuggestedAnswerFromGemini(newAnswer); 
      setQaHistory(prevHistory => [
        ...prevHistory,
        { id: Date.now().toString() + Math.random().toString(), question: questionText, answer: newAnswer }
      ]);
      setCurrentLiveQuestionFromSpeech(""); 
    } catch (e: any) {
      console.error("Error sending message to Gemini chat:", e);
      const errorMessage = e.message || "Failed to get answer from chat. Check console.";
      setGeminiError(`Gemini Chat Error: ${errorMessage}`);
      setQaHistory(prevHistory => [
        ...prevHistory,
        { id: Date.now().toString() + Math.random().toString(), question: questionText, answer: `Sorry, an error occurred: ${errorMessage}` }
      ]);
       setCurrentLiveQuestionFromSpeech(""); 
    } finally {
      setIsFetchingAnswer(false);
    }
  }, [chatInstance, isChatInitializing]);

  const handleFinalTranscript = useCallback((transcriptSegment: string) => {
    if (transcriptSegment.trim()) {
      sendQuestionToChat(transcriptSegment);
    } else {
      setGeminiError("No clear question was transcribed.");
    }
  }, [sendQuestionToChat]);

  const {
    interimTranscript,
    isListening,
    startListening,
    stopListening,
    error: speechError,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ 
    continuous: true,
    onFinalTranscript: handleFinalTranscript
  });

  const getCardStatusText = () => {
    if (isChatInitializing) return `Initializing for ${currentRole}...`;
    if (isFetchingAnswer) return `AI is responding to: "${currentLiveQuestionFromSpeech}"`;
    if (geminiError && !isFetchingAnswer) return "Error state";
    return "Ready";
  };
  

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-100 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Combined Sticky Header Area */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10 px-3 sm:px-6">
          <Header
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            roles={availableRoles}
            isListening={isListening}
            startListening={startListening}
            stopListening={stopListening}
            speechError={speechError}
            browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
            interimTranscript={interimTranscript}
            isFetchingAnswer={isFetchingAnswer || isChatInitializing} 
          />
        </div>
        
        {geminiError && !(isFetchingAnswer || isChatInitializing) && (
          <div className="px-3 sm:px-6 py-2">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{geminiError}</span>
            </div>
          </div>
        )}

        <main className="flex flex-col flex-1 px-3 sm:px-6 py-3 md:py-5 overflow-hidden">
          <ContentCard
            title="Interview Conversation"
            qaHistory={qaHistory}
            currentLiveQuestion={isFetchingAnswer ? currentLiveQuestionFromSpeech : undefined}
            isFetchingCurrentAnswer={isFetchingAnswer}
            statusText={getCardStatusText()}
            containerClassName="w-full flex-1 flex flex-col" 
            isLoading={isChatInitializing} 
          />
        </main>
      </div>
    </div>
  );
};

// We're using the ProtectedRoute from AuthRoutes.tsx instead of this one

// Main App component with routing
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/interview" element={<ProtectedRoute element={<InterviewInterface />} />} />
        <Route path="/system-audio-demo" element={<SystemAudioDemo />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;