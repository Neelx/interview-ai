
import { useState, useEffect, useRef, useCallback } from 'react';

// --- START: Web Speech API Type Definitions ---
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  readonly isFinal: boolean;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: 'no-speech' | 'audio-capture' | 'not-allowed' | 'network' | 'aborted' | 'language-not-supported' | 'service-not-allowed' | 'bad-grammar';
  readonly message: string;
}

interface SpeechRecognitionEventForResults extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface ISpeechRecognition extends EventTarget {
  grammars: any; // Using 'any' if SpeechGrammarList is not deeply used, or define SpeechGrammarList
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  // serviceURI?: string;

  onaudiostart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: ISpeechRecognition, ev: SpeechRecognitionEventForResults) => any) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEventForResults) => any) | null;
  onsoundstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;

  abort(): void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionStatic {
  new(): ISpeechRecognition;
}
// --- END: Web Speech API Type Definitions ---

interface SpeechRecognitionHookOptions {
  onFinalTranscript?: (transcript: string) => void;
  onInterimTranscript?: (transcript: string) => void;
  continuous?: boolean;
  lang?: string;
}

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic | undefined;
    webkitSpeechRecognition: SpeechRecognitionStatic | undefined;
  }
}

const useSpeechRecognition = (options: SpeechRecognitionHookOptions = {}) => {
  const { 
    onFinalTranscript, 
    onInterimTranscript, 
    continuous = false, 
    lang = 'en-US' 
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState(''); // Keeps track of all final transcripts in current session
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const browserSupportsSpeechRecognition = typeof window !== 'undefined' && 
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Speech recognition not supported by this browser.");
      setError("Speech recognition not supported by this browser.");
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
        console.error("Speech recognition API not available.");
        setError("Speech recognition API not available.");
        return;
    }
    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;

    recognition.continuous = continuous;
    recognition.interimResults = true; 
    recognition.lang = lang;

    recognition.onstart = () => {
      console.log('Speech recognition started.');
      setIsListening(true);
      setError(null); // Clear previous errors on successful start
    };

    recognition.onaudiostart = () => {
      console.log('Audio capture started.');
    };
    
    recognition.onsoundstart = () => {
      console.log('Sound detected.');
    };

    recognition.onspeechstart = () => {
      console.log('Speech detected.');
    };

    recognition.onresult = (event: SpeechRecognitionEventForResults) => {
      console.log('Speech recognition result received.');
      let interim = '';
      let finalSegment = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalSegment += event.results[i].item(0).transcript;
        } else {
          interim += event.results[i].item(0).transcript;
        }
      }
      setInterimTranscript(interim);
      if (onInterimTranscript) onInterimTranscript(interim);

      if (finalSegment) {
        const trimmedFinalSegment = finalSegment.trim();
        console.log('Final transcript segment:', trimmedFinalSegment);
        setFinalTranscript(prev => prev + trimmedFinalSegment + ' '); // Append to session's full transcript
        if (onFinalTranscript) onFinalTranscript(trimmedFinalSegment);
      }
    };

    recognition.onspeechend = () => {
      console.log('Speech ended.');
    };
    
    recognition.onsoundend = () => {
      console.log('Sound ended.');
    };
    
    recognition.onaudioend = () => {
      console.log('Audio capture ended.');
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message, event);
      let userMessage = `Speech Error: ${event.error}`;
      if (event.message) {
        userMessage += ` - ${typeof event.message === 'string' ? event.message : JSON.stringify(event.message)}`;
      }
      if (event.error === 'network') {
        userMessage = 'Speech recognition network error. Please check your internet connection.';
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        userMessage = 'Microphone permission denied or speech service not allowed. Please check browser settings.';
      }
      setError(userMessage);
      setIsListening(false); 
    };

    recognition.onend = () => {
      console.log('Speech recognition ended.');
      // When recognition ends (for any reason including stop() or auto-end if not continuous, or error),
      // set isListening to false. The user will need to click "Start Listening" again if it wasn't an explicit stop.
      setIsListening(false);
    };
    
    return () => {
      if (recognitionRef.current) {
        console.log('Cleaning up speech recognition instance.');
        recognitionRef.current.abort(); // Use abort to ensure it stops immediately
        recognitionRef.current.onstart = null;
        recognitionRef.current.onaudiostart = null;
        recognitionRef.current.onsoundstart = null;
        recognitionRef.current.onspeechstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onspeechend = null;
        recognitionRef.current.onsoundend = null;
        recognitionRef.current.onaudioend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        // recognitionRef.current = null; // Avoid nulling out ref if it might be re-used by quick re-renders
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continuous, lang, onFinalTranscript, onInterimTranscript, browserSupportsSpeechRecognition]); 

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
        console.warn("Recognition instance not available to start. Try refreshing.");
        setError("Recognition not initialized. Try refreshing.");
        return;
    }
    if (isListening) {
        console.warn("Already listening.");
        return;
    }
    try {
      console.log("Attempting to start speech recognition...");
      setInterimTranscript('');
      // setFinalTranscript(''); // Reset session transcript if desired per start. Current logic appends.
      setError(null);
      setIsListening(true); // Immediate UI feedback
      recognitionRef.current.start();
    } catch (e: any) {
      console.error("Error starting speech recognition in startListening():", e);
      setError(`Start Error: ${e.message}`);
      setIsListening(false); // Revert UI feedback if start fails synchronously
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) {
        console.warn("Recognition instance not available to stop.");
        return;
    }
    if (!isListening) {
        console.warn("Not listening, cannot stop.");
        return;
    }
    console.log("Attempting to stop speech recognition...");
    setIsListening(false); // Immediate UI feedback
    recognitionRef.current.stop();
  }, [isListening]);

  return {
    isListening,
    interimTranscript,
    finalTranscript, 
    error,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
  };
};

export default useSpeechRecognition;