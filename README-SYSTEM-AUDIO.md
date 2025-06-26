# System Audio Capture for Interview AI

This document explains how to use the system audio capture functionality in the Interview AI application.

## Overview

The system audio capture feature allows the application to capture and analyze audio playing from your system (like music, videos, or other applications) rather than just microphone input. This can be useful for:

- Analyzing responses from pre-recorded interviews
- Processing audio from other applications
- Creating transcripts from system audio
- Visualizing audio patterns and frequencies
- Detecting speech from system audio for AI processing

## How It Works

The system audio capture uses the Web Audio API and the `getDisplayMedia()` API to capture audio from your screen or a specific tab. Here's how it works:

1. When you click "Start Capturing", you'll be prompted to share your screen or a specific tab
2. **IMPORTANT**: You MUST check "Share audio" in the dialog box that appears
3. The application captures the audio from the selected source using optimized audio settings
4. The audio is analyzed in real-time using both time-domain and frequency-domain analysis
5. Special focus is given to speech frequencies (300-3000 Hz) to better detect human speech
6. The audio is visualized as either frequency bars or a waveform
7. Audio levels are calculated using RMS (Root Mean Square) for more accurate volume representation
8. In a real implementation, this would be connected to a speech recognition service

### Key Technical Improvements

- **Enhanced Audio Analysis**: Combines time-domain and frequency-domain analysis for better speech detection
- **Optimized Audio Parameters**: Disables echo cancellation, noise suppression, and auto gain control for cleaner system audio
- **Speech Frequency Focus**: Prioritizes the 300-3000 Hz range where human speech is most prominent
- **Improved Level Detection**: Uses RMS calculation for more accurate audio level representation

## Implementation Details

The implementation consists of two main components:

### 1. `useSystemAudioCapture` Hook

This custom React hook handles the system audio capture functionality:

- Creates and manages the AudioContext and related nodes
- Provides methods to start and stop capturing
- Performs advanced audio analysis using both time and frequency domain data
- Calculates audio levels with special focus on speech frequencies
- Optimizes audio capture settings for clearer system audio
- Handles errors and browser compatibility
- Provides real-time audio data for visualization

The hook uses the following key components:

- **AudioContext**: Processes and manages audio data
- **AnalyserNode**: Extracts frequency and time domain data
- **getDisplayMedia API**: Captures system audio with optimized settings
- **requestAnimationFrame**: Ensures smooth, efficient audio analysis

### 2. `SystemAudioDemo` Component

This component demonstrates the use of the hook with an enhanced user interface:

- Visualizes the captured audio as interactive bars or waveform
- Shows the current audio level with a dynamic progress bar
- Provides clear controls to start and stop capturing
- Simulates realistic text capture from the audio with processing indicators
- Displays audio detection status in real-time
- Includes comprehensive troubleshooting tips
- Provides detailed instructions for users
- Shows signal strength percentage for better feedback

## Browser Compatibility

System audio capture is supported in:

- Chrome (version 74+)
- Edge (version 79+)
- Opera (version 62+)

Not supported in:

- Firefox (as of current version)
- Safari (as of current version)

## Usage in Your Application

To use the system audio capture in your own component:

```tsx
import useSystemAudioCapture from '../hooks/useSystemAudioCapture';

const YourComponent = () => {
  const {
    isCapturing,
    audioLevel,
    audioData,
    error,
    startCapturing,
    stopCapturing,
    browserSupportsAudioCapture
  } = useSystemAudioCapture();

  // Use the hook's state and methods in your component
  return (
    <div>
      {browserSupportsAudioCapture ? (
        <button onClick={isCapturing ? stopCapturing : startCapturing}>
          {isCapturing ? 'Stop Capturing' : 'Start Capturing'}
        </button>
      ) : (
        <p>Your browser doesn't support system audio capture</p>
      )}
    </div>
  );
};
```

## Integration with Speech Recognition

To integrate with speech recognition:

1. Capture the audio using the `useSystemAudioCapture` hook
2. Process the audio data (either locally or send to a server)
3. Use a speech recognition service to convert the audio to text
4. Handle the recognized text in your application

Example services you could integrate with:

- Web Speech API (for browser-based recognition)
- Google Cloud Speech-to-Text
- Amazon Transcribe
- Microsoft Azure Speech Service

## Security and Privacy Considerations

- Always inform users when you're capturing system audio
- Provide clear UI indicators when capture is active
- Stop capturing when it's no longer needed
- Be aware of potential privacy implications when capturing system audio

## Troubleshooting

- If you don't see the "Share audio" option, make sure you're using a supported browser
- If no audio is being captured, check that you selected "Share audio" in the dialog
- If you get permission errors, make sure your site is served over HTTPS
- If visualization doesn't appear, check that audio is actually playing from the shared source