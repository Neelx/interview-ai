import { useState, useEffect, useRef, useCallback } from 'react';

// Add TypeScript declaration for webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface SystemAudioCaptureOptions {
  onAudioData?: (audioData: Float32Array) => void;
  onAudioLevel?: (level: number) => void;
  fftSize?: number;
  smoothingTimeConstant?: number;
  minDecibels?: number;
  maxDecibels?: number;
};

const useSystemAudioCapture = (options: SystemAudioCaptureOptions = {}) => {
  const {
    onAudioData,
    onAudioLevel,
    fftSize = 2048,
    smoothingTimeConstant = 0.8,
    minDecibels = -90,
    maxDecibels = -10
  } = options;

  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  
  // Refs to hold audio context and nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check if browser supports required APIs
  const browserSupportsAudioCapture = typeof window !== 'undefined' && 
    !!(window.AudioContext || window.webkitAudioContext) && 
    !!navigator.mediaDevices && 
    !!navigator.mediaDevices.getDisplayMedia;

  // Function to analyze audio data
  const analyzeAudio = useCallback(() => {
    if (!analyserNodeRef.current || !isCapturing) return;
    
    const analyser = analyserNodeRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const frequencyData = new Float32Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);
    
    // Get both frequency and time domain data for better analysis
    analyser.getFloatFrequencyData(frequencyData);
    analyser.getByteTimeDomainData(timeData);
    
    // Calculate audio level using RMS (Root Mean Square) from time domain data
    // This gives a better representation of perceived loudness
    let sumSquares = 0;
    for (let i = 0; i < timeData.length; i++) {
      // Convert from 0-255 to -1.0 to 1.0
      const amplitude = (timeData[i] / 128.0) - 1.0;
      sumSquares += amplitude * amplitude;
    }
    const rms = Math.sqrt(sumSquares / timeData.length);
    
    // Calculate frequency-based level (focusing on speech frequencies 300-3000 Hz)
    // This helps better detect human speech
    let speechSum = 0;
    let speechCount = 0;
    
    // Approximate the frequency range based on FFT size and sample rate (typically 44100 Hz)
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const frequencyBinSize = sampleRate / (analyser.fftSize * 2);
    
    for (let i = 0; i < frequencyData.length; i++) {
      const frequency = i * frequencyBinSize;
      
      // Focus on speech frequency range (300-3000 Hz)
      if (frequency >= 300 && frequency <= 3000) {
        // Convert from dB scale to normalized value between 0 and 1
        const normalized = (frequencyData[i] - minDecibels) / (maxDecibels - minDecibels);
        speechSum += Math.max(0, Math.min(1, normalized));
        speechCount++;
      }
    }
    
    // Combine RMS and frequency analysis for a more accurate level
    // Weight RMS more heavily as it better represents overall volume
    const speechLevel = speechCount > 0 ? speechSum / speechCount : 0;
    const combinedLevel = (rms * 0.7) + (speechLevel * 0.3);
    
    // Ensure the level is between 0 and 1
    const finalLevel = Math.max(0, Math.min(1, combinedLevel));
    
    // Update state and call callback
    setAudioLevel(finalLevel);
    setAudioData(frequencyData);
    
    if (onAudioLevel) onAudioLevel(finalLevel);
    if (onAudioData) onAudioData(frequencyData);
    
    // Continue analyzing in the next animation frame
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [isCapturing, minDecibels, maxDecibels, onAudioLevel, onAudioData]);

  // Start capturing system audio
  const startCapturing = useCallback(async () => {
    if (!browserSupportsAudioCapture) {
      setError("Your browser doesn't support system audio capture.");
      return;
    }

    if (isCapturing) {
      console.warn("Already capturing system audio.");
      return;
    }

    try {
      // Reset error state
      setError(null);
      
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }
      
      // Request system audio using getDisplayMedia with explicit audio constraints
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          // Ensure we're capturing system audio, not just microphone
          // This is crucial for capturing audio playing on the system
          suppressLocalAudioPlayback: false
        }
      });
      
      // Store stream reference
      mediaStreamRef.current = stream;
      
      // Create source node from the stream
      const sourceNode = audioContextRef.current.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;
      
      // Create analyzer node
      const analyserNode = audioContextRef.current.createAnalyser();
      analyserNode.fftSize = fftSize;
      analyserNode.smoothingTimeConstant = smoothingTimeConstant;
      analyserNode.minDecibels = minDecibels;
      analyserNode.maxDecibels = maxDecibels;
      analyserNodeRef.current = analyserNode;
      
      // Connect source to analyzer
      sourceNode.connect(analyserNode);
      
      // Update state
      setIsCapturing(true);
      
      // Start analyzing audio
      analyzeAudio();
      
      // Listen for when the user stops sharing
      stream.getAudioTracks()[0].addEventListener('ended', () => {
        stopCapturing();
      });
      
    } catch (e: any) {
      console.error("Error starting system audio capture:", e);
      setError(`Failed to capture system audio: ${e.message || 'Unknown error'}`); 
      stopCapturing();
    }
  }, [isCapturing, browserSupportsAudioCapture, fftSize, smoothingTimeConstant, minDecibels, maxDecibels, analyzeAudio]);

  // Stop capturing system audio
  const stopCapturing = useCallback(() => {
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Stop all tracks in the media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Disconnect audio nodes
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    
    // Update state
    setIsCapturing(false);
    setAudioLevel(0);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCapturing();
      
      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
    };
  }, [stopCapturing]);

  return {
    isCapturing,
    audioLevel,
    audioData,
    error,
    startCapturing,
    stopCapturing,
    browserSupportsAudioCapture
  };
};

export default useSystemAudioCapture;