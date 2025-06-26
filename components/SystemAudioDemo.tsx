import React, { useState, useEffect, useRef } from 'react';
import useSystemAudioCapture from '../hooks/useSystemAudioCapture';

const SystemAudioDemo: React.FC = () => {
  const [visualizationType, setVisualizationType] = useState<'waveform' | 'bars'>('bars');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedText, setCapturedText] = useState<string>('');
  
  // Use our custom hook
  const {
    isCapturing,
    audioLevel,
    audioData,
    error,
    startCapturing,
    stopCapturing,
    browserSupportsAudioCapture
  } = useSystemAudioCapture({
    fftSize: 256, // Smaller for better performance
    smoothingTimeConstant: 0.5,
    minDecibels: -90,
    maxDecibels: -10
  });

  // Draw visualization on canvas
  useEffect(() => {
    if (!canvasRef.current || !audioData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas dimensions to match display size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Draw based on visualization type
    if (visualizationType === 'waveform') {
      drawWaveform(ctx, audioData, rect.width, rect.height);
    } else {
      drawBars(ctx, audioData, rect.width, rect.height);
    }
  }, [audioData, visualizationType]);

  // Draw frequency bars visualization
  const drawBars = (ctx: CanvasRenderingContext2D, data: Float32Array, width: number, height: number) => {
    const barWidth = width / data.length;
    const barHeightMultiplier = height / 2;
    
    ctx.fillStyle = '#4f46e5'; // Indigo color
    
    for (let i = 0; i < data.length; i++) {
      // Convert from dB scale to normalized value between 0 and 1
      const normalized = (data[i] + 90) / 80; // Assuming minDecibels=-90, maxDecibels=-10
      const barHeight = Math.max(0, Math.min(1, normalized)) * barHeightMultiplier;
      
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
  };

  // Draw waveform visualization
  const drawWaveform = (ctx: CanvasRenderingContext2D, data: Float32Array, width: number, height: number) => {
    const sliceWidth = width / data.length;
    const centerY = height / 2;
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#4f46e5'; // Indigo color
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
      // Convert from dB scale to normalized value between -1 and 1
      const normalized = ((data[i] + 90) / 80) * 2 - 1; // Assuming minDecibels=-90, maxDecibels=-10
      const y = centerY + normalized * centerY;
      
      if (i === 0) {
        ctx.moveTo(0, y);
      } else {
        ctx.lineTo(i * sliceWidth, y);
      }
    }
    
    ctx.stroke();
  };

  // Enhanced speech-to-text simulation with more realistic behavior
  const [processingAudio, setProcessingAudio] = useState(false);
  const lastCaptureTimeRef = useRef<number>(0);
  const audioDetectionThreshold = 0.15; // Slightly higher threshold for better detection
  
  useEffect(() => {
    if (!isCapturing) {
      setProcessingAudio(false);
      return;
    }
    
    // Only trigger processing if audio level is significant and we haven't processed recently
    const now = Date.now();
    const timeSinceLastCapture = now - lastCaptureTimeRef.current;
    
    if (audioLevel > audioDetectionThreshold && !processingAudio && timeSinceLastCapture > 3000) {
      setProcessingAudio(true);
      
      // Simulate processing delay (would be real processing time in actual implementation)
      const processingDelay = 1000 + Math.random() * 1000; // 1-2 second delay
      
      const simulateTextCapture = () => {
        // More varied and realistic phrases that might be detected from system audio
        const phrases = [
          "I detected audio playing from your system",
          "This sounds like speech content that could be transcribed",
          "The system is now analyzing the audio frequencies",
          "Speech patterns detected in the audio stream",
          "This demonstration shows how system audio can be processed",
          "Audio levels indicate active content is playing",
          "The frequency analysis shows typical speech patterns",
          "System audio capture is working correctly"
        ];
        
        // Select a phrase based on audio level - higher levels get more complex phrases
        const phraseIndex = Math.min(
          Math.floor(audioLevel * phrases.length),
          phrases.length - 1
        );
        
        setCapturedText(phrases[phraseIndex]);
        setProcessingAudio(false);
        lastCaptureTimeRef.current = now;
      };
      
      // Simulate processing time
      const timer = setTimeout(simulateTextCapture, processingDelay);
      return () => clearTimeout(timer);
    }
  }, [isCapturing, audioLevel, processingAudio]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">System Audio Capture Demo</h2>
      
      {!browserSupportsAudioCapture ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          Your browser doesn't support system audio capture. Try using Chrome or Edge.
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-slate-700">Audio Visualization</h3>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setVisualizationType('bars')}
                      className={`px-3 py-1 text-sm rounded-md ${visualizationType === 'bars' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}
                    >
                      Bars
                    </button>
                    <button 
                      onClick={() => setVisualizationType('waveform')}
                      className={`px-3 py-1 text-sm rounded-md ${visualizationType === 'waveform' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}
                    >
                      Waveform
                    </button>
                  </div>
                </div>
                
                <div className="relative bg-white border border-slate-200 rounded-md h-40 overflow-hidden">
                  <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 w-full h-full"
                  />
                  {!isCapturing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 bg-opacity-80">
                      <p className="text-slate-500">Start capturing to see visualization</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-slate-700 mb-2">Audio Level</h3>
                <div className="h-6 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-100"
                    style={{ width: `${audioLevel * 100}%` }}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Current level: {(audioLevel * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-slate-700">Captured Text</h3>
                  {isCapturing && (
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${audioLevel > audioDetectionThreshold ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <span className="text-xs text-slate-500">
                        {processingAudio ? 'Processing...' : audioLevel > audioDetectionThreshold ? 'Audio detected' : 'Waiting for audio'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="bg-white border border-slate-200 rounded-md p-4 h-40 overflow-auto relative">
                  {capturedText ? (
                    <p className="text-slate-700">{capturedText}</p>
                  ) : (
                    <p className="text-slate-400 italic">
                      {isCapturing 
                        ? "Listening for audio..."
                        : "Start capturing to detect speech"}
                    </p>
                  )}
                  
                  {processingAudio && (
                    <div className="absolute bottom-2 right-2 flex items-center">
                      <div className="flex space-x-1 mr-2">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-indigo-500">Processing audio</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500">
                    Note: This is a simulation. In a real application, you would integrate with a speech recognition API.
                  </p>
                  
                  {isCapturing && audioLevel > 0 && (
                    <div className="text-xs px-2 py-0.5 bg-slate-100 rounded-full">
                      Signal: {(audioLevel * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={isCapturing ? stopCapturing : startCapturing}
              className={`px-6 py-2.5 rounded-xl font-medium text-white shadow-sm hover:shadow-md transition-all ${isCapturing 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-indigo-500 hover:bg-indigo-600'}`}
            >
              {isCapturing ? 'Stop Capturing' : 'Start Capturing'}
            </button>
          </div>
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-blue-700 mb-2">How To Capture System Audio</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-2">
              <li className="text-sm">
                <span className="text-blue-600">Click "Start Capturing"</span> - This will prompt you to share your screen or a tab for audio capture
              </li>
              <li className="text-sm">
                <span className="text-blue-600">Select the tab or window</span> - Choose the source that's playing audio you want to capture
              </li>
              <li className="text-sm">
                <span className="text-blue-600 font-bold">IMPORTANT: Share with audio enabled</span> - You MUST check "Share audio" in the dialog box that appears
              </li>
              <li className="text-sm">
                <span className="text-blue-600">Play some audio</span> - The visualization will respond to the audio being played
              </li>
            </ol>
            
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-yellow-700 mb-1">Troubleshooting Tips:</h4>
              <ul className="list-disc list-inside text-yellow-700 space-y-1 text-xs">
                <li>If no audio is detected, make sure you checked "Share audio" when selecting the tab/window</li>
                <li>Try playing audio with higher volume to ensure it's being captured</li>
                <li>Some websites may block audio sharing - try with YouTube or another media site</li>
                <li>Chrome and Edge browsers provide the best support for system audio capture</li>
                <li>If using macOS, you may need to install a virtual audio driver for system-wide audio capture</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemAudioDemo;