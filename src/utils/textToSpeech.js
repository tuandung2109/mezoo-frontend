// Text-to-Speech utility with multiple options

// Option 1: Web Speech API (Built-in browser, free but quality varies)
export const speakBrowser = (text, options = {}) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-Speech not supported in this browser');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  utterance.lang = options.lang || 'vi-VN';
  utterance.rate = options.rate || 1;
  utterance.pitch = options.pitch || 1;
  utterance.volume = options.volume || 1;

  const voices = window.speechSynthesis.getVoices();
  const vietnameseVoice = voices.find(voice => 
    voice.lang.includes('vi') || voice.lang.includes('VN')
  );
  
  if (vietnameseVoice) {
    utterance.voice = vietnameseVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Option 2: FPT AI Text-to-Speech (Better quality, free 1M chars/month)
// Get API key from: https://fpt.ai/vi/tts
export const speakFPT = async (text, options = {}) => {
  const API_KEY = import.meta.env.VITE_FPT_API_KEY || 'YOUR_FPT_API_KEY';
  
  if (!API_KEY || API_KEY === 'YOUR_FPT_API_KEY') {
    console.warn('FPT API key not configured, falling back to browser TTS');
    speakBrowser(text, options);
    return;
  }

  try {
    const response = await fetch('https://api.fpt.ai/hmi/tts/v5', {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
        'speed': options.speed || '0',
        'voice': options.voice || 'leminh' // leminh (nam), banmai (nữ), lannhi (nữ), linhsan (nữ)
      },
      body: text
    });

    const data = await response.json();
    
    if (data.async) {
      // Play audio from URL
      const audio = new Audio(data.async);
      audio.play();
    }
  } catch (error) {
    console.error('FPT TTS error:', error);
    // Fallback to browser TTS
    speakBrowser(text, options);
  }
};

// Main speak function - uses FPT if available, otherwise browser
export const speak = (text, options = {}) => {
  const useFPT = options.useFPT !== false; // Default to true
  
  if (useFPT) {
    speakFPT(text, options);
  } else {
    speakBrowser(text, options);
  }
};

// Welcome message for user
export const welcomeUser = (userName) => {
  const hour = new Date().getHours();
  let greeting = 'Chào mừng';
  
  if (hour < 12) {
    greeting = 'Chào buổi sáng';
  } else if (hour < 18) {
    greeting = 'Chào buổi chiều';
  } else {
    greeting = 'Chào buổi tối';
  }

  const message = `${greeting} ${userName}. Chúc bạn có những giây phút thư giãn thật thoải mái cùng bộ phim yêu thích nhé!`;
  
  // Delay a bit to ensure page is loaded
  setTimeout(() => {
    speak(message, { 
      voice: 'banmai', // Giọng nữ
      speed: '0' // Tốc độ bình thường
    });
  }, 500);
};

// Stop speaking
export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
