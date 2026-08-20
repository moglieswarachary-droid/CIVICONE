// src/components/AiAgentFloating.jsx - Multilingual Voice-Enabled CIVIQONE AI Assistant
// Supports English, Telugu, Tamil, Kannada, and Malayalam with Interactive Tap-to-Listen Text-To-Speech Controls

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, User,
  RefreshCw, ShieldCheck, ArrowRight, Compass, Ticket, FolderClosed,
  Lock, Milestone, Globe2, Check, ExternalLink, Play, Pause, Square
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', speechCode: 'en-IN', fallbacks: ['en-IN', 'en-GB', 'en-US', 'en'] },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', speechCode: 'te-IN', fallbacks: ['te-IN', 'te'] },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', speechCode: 'ta-IN', fallbacks: ['ta-IN', 'ta'] },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', speechCode: 'kn-IN', fallbacks: ['kn-IN', 'kn'] },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', speechCode: 'ml-IN', fallbacks: ['ml-IN', 'ml'] }
];

const LOCALIZED_GREETINGS = {
  en: "Hello! I am CIVIQONE AI, your multilingual digital identity assistant. Speak or type to navigate portals, query documents, and check verifications.",
  te: "నమస్కారం! నేను CIVIQONE AI ని. మీ డిజిటల్ గుర్తింపు మరియు పత్రాల సహాయకుడిని. మాట్లాడండి లేదా టైప్ చేసి మీ పత్రాలను శోధించండి.",
  ta: "வணக்கம்! நான் CIVIQONE AI. உங்கள் டிஜிட்டல் அடையாள உதவியாளர். ஆவணங்களை பார்க்க அல்லது தேட பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்.",
  kn: "ನಮಸ್ಕಾರ! ನಾನು CIVIQONE AI. ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಗುರುತಿನ ಸಹಾಯಕ. ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಲು ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.",
  ml: "നമസ്കാരം! ഞാൻ CIVIQONE AI ആണ്. നിങ്ങളുടെ ഡിജിറ്റൽ തിരിച്ചറിയൽ രേഖാ സഹായി. പോർട്ടലുകൾ പരിശോധിക്കാനും രേഖകൾ കണ്ടെത്താനും സംസാരിക്കുകയോ ടൈപ്പ് ചെയ്യുകയോ ചെയ്യാം."
};

const QUICK_SUGGESTIONS = {
  en: [
    { text: "Open My Journey (Life Timeline)", tab: "journey" },
    { text: "Show my Digital Citizen Card", tab: "card" },
    { text: "Who has access to my data?", tab: "privacy" },
    { text: "Explore CIVIQONE World destinations", tab: "tourism" },
    { text: "When does my Driving Licence expire?", query: "driving licence expiry" }
  ],
  te: [
    { text: "నా ప్రయాణం (My Journey) చూపించు", tab: "journey" },
    { text: "నా డిజిటల్ సిటిజెన్ కార్డ్ చూడాలి", tab: "card" },
    { text: "నా డేటా ఎవరి వద్ద ఉంది?", tab: "privacy" },
    { text: "పర్యాటక ప్రదేశాలు (CIVIQONE World)", tab: "tourism" },
    { text: "నా డ్రైవింగ్ లైసెన్స్ గడువు ఎప్పుడు?", query: "driving licence expiry" }
  ],
  ta: [
    { text: "என் பயணம் (My Journey) திறக்கவும்", tab: "journey" },
    { text: "என் டிஜிட்டல் அட்டை காட்டு", tab: "card" },
    { text: "எனது தரவை யார் அணுகுகிறார்கள்?", tab: "privacy" },
    { text: "சுற்றுலா இடங்கள் (CIVIQONE World)", tab: "tourism" },
    { text: "ஓட்டுநர் உரிமம் எப்போது காலாவதியாகும்?", query: "driving licence expiry" }
  ],
  kn: [
    { text: "ನನ್ನ ಜೀವನ ಪ್ರಯಾಣ (My Journey)", tab: "journey" },
    { text: "ನನ್ನ ಡಿಜಿಟಲ್ ಕಾರ್ಡ್ ತೋರಿಸಿ", tab: "card" },
    { text: "ನನ್ನ ಡೇಟಾ ಯಾರು ನೋಡುತ್ತಿದ್ದಾರೆ?", tab: "privacy" },
    { text: "ಪ್ರವಾಸ ಸ್ಥಳಗಳು (CIVIQONE World)", tab: "tourism" },
    { text: "ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್ ಯಾವಾಗ ಮುಕ್ತಾಯ?", query: "driving licence expiry" }
  ],
  ml: [
    { text: "എന്റെ യാത്ര (My Journey) കാണിക്കുക", tab: "journey" },
    { text: "എന്റെ ഡിജിറ്റൽ സിറ്റിസൺ കാർഡ്", tab: "card" },
    { text: "ആർക്കൊക്കെ എന്റെ വിവരങ്ങൾ കാണാം?", tab: "privacy" },
    { text: "വിനോദസഞ്ചാര കേന്ദ്രങ്ങൾ (CIVIQONE World)", tab: "tourism" },
    { text: "ഡ്രൈവിംഗ് ലൈസൻസ് കാലാവധി എപ്പോൾ?", query: "driving licence expiry" }
  ]
};

export default function AiAgentFloating({ citizen = {}, documents = [], onNavigateTab }) {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize and persist language across session
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      const saved = localStorage.getItem('civiqone_ai_lang');
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch (e) {}
    return 'en';
  });

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Per-message Text-to-Speech (TTS) state: { msgIndex: number | null, status: 'idle' | 'playing' | 'paused' }
  const [ttsState, setTtsState] = useState({ msgIndex: null, status: 'idle' });
  const voicesRef = useRef([]);

  // Load available speech synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        voicesRef.current = window.speechSynthesis.getVoices() || [];
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // DRAGGABLE POSITION STATE & BOUNDARY CONSTRAINTS
  const clampCoordinates = (x, y) => {
    const btnSize = 64;
    const margin = 12;
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const minX = margin;
    const maxX = Math.max(margin, winW - btnSize - margin);
    const minY = margin;
    const maxY = Math.max(margin, winH - btnSize - margin);

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY)
    };
  };

  const getInitialPosition = () => {
    try {
      const saved = localStorage.getItem('civiqone_ai_pos') || localStorage.getItem('civiqones_ai_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return clampCoordinates(parsed.x, parsed.y);
        }
      }
    } catch (e) {}

    const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const defaultX = Math.max(16, winW - 88);
    const defaultY = Math.max(16, winH - (winW <= 768 ? 96 : 88));
    return clampCoordinates(defaultX, defaultY);
  };

  const [position, setPosition] = useState(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(null);
  const hasDraggedRef = useRef(false);

  // Viewport resize and orientation listener to keep bot clamped inside screen
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        if (!prev) return getInitialPosition();
        return clampCoordinates(prev.x, prev.y);
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Pointer Drag Handlers (Unified Touch & Mouse Dragging)
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
    
    hasDraggedRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !dragStartRef.current) return;
    
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasDraggedRef.current = true;
    }

    const nextX = dragStartRef.current.initialX + deltaX;
    const nextY = dragStartRef.current.initialY + deltaY;
    setPosition(clampCoordinates(nextX, nextY));
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}

    if (!hasDraggedRef.current) {
      // User tapped or clicked without dragging -> Toggle Open Chat
      setIsOpen(prev => !prev);
    } else {
      // User dragged -> Persist position
      try {
        localStorage.setItem('civiqone_ai_pos', JSON.stringify(position));
      } catch (err) {}
    }
    dragStartRef.current = null;
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const citizenName = citizen?.fullName || citizen?.name || 'Citizen';
  const civicId = citizen?.citizenId || 'CIV-AP-710646-823';

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: LOCALIZED_GREETINGS[selectedLang] || LOCALIZED_GREETINGS.en,
      lang: selectedLang,
      actionTab: null
    }
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
        // Automatically submit voice query
        processUserQuery(transcript, selectedLang);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [selectedLang]);

  // Update greeting when language changes and persist in session
  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode);
    try {
      localStorage.setItem('civiqone_ai_lang', langCode);
    } catch (e) {}

    // Stop any ongoing speech when switching languages
    handleStopAudio();

    const greeting = LOCALIZED_GREETINGS[langCode] || LOCALIZED_GREETINGS.en;
    const langNative = SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.native || 'English';
    
    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: `🌐 **Language switched to ${langNative}**.\n\n${greeting}`,
        lang: langCode
      }
    ]);
  };

  // Toggle Microphone Voice Input
  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Speech recognition is not natively available in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const langObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];
        recognitionRef.current.lang = langObj.speechCode;
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Mic start error:", err);
      }
    }
  };

  // ==========================================
  // TEXT-TO-SPEECH (TTS) / LISTEN ENGINE
  // ==========================================

  // Play audio for a specific AI response
  const handlePlayAudio = (text, langCode, msgIndex) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    // If currently paused on this exact message, resume it
    if (ttsState.msgIndex === msgIndex && ttsState.status === 'paused') {
      window.speechSynthesis.resume();
      setTtsState({ msgIndex, status: 'playing' });
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text for smooth, pleasant speech synthesis
    const cleanText = text
      .replace(/[*_#`~>]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[•🟢🛡️🚗🗳️🌐]/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = langCode || selectedLang || 'en';
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

    const availableVoices = voicesRef.current.length > 0
      ? voicesRef.current
      : (window.speechSynthesis.getVoices() || []);

    let selectedVoice = null;
    if (availableVoices.length > 0) {
      // 1. Check exact fallback list
      for (const code of (langObj.fallbacks || [langObj.speechCode])) {
        selectedVoice = availableVoices.find(v =>
          v.lang.toLowerCase() === code.toLowerCase() ||
          v.lang.toLowerCase().replace('_', '-').startsWith(code.toLowerCase())
        );
        if (selectedVoice) break;
      }

      // 2. Check language prefix (e.g., 'te', 'ta', 'kn', 'ml', 'en')
      if (!selectedVoice) {
        selectedVoice = availableVoices.find(v =>
          v.lang.toLowerCase().startsWith(langObj.code)
        );
      }

      // 3. Gracefully fallback to Indian accent voice or default voice without breaking
      if (!selectedVoice) {
        selectedVoice = availableVoices.find(v => v.lang.toLowerCase().includes('in'))
          || availableVoices.find(v => v.default)
          || availableVoices[0];
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = langObj.speechCode;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setTtsState({ msgIndex, status: 'playing' });
    };

    utterance.onend = () => {
      setTtsState({ msgIndex: null, status: 'idle' });
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn("TTS Playback issue:", e);
      }
      setTtsState({ msgIndex: null, status: 'idle' });
    };

    utterance.onpause = () => {
      setTtsState({ msgIndex, status: 'paused' });
    };

    utterance.onresume = () => {
      setTtsState({ msgIndex, status: 'playing' });
    };

    window.speechSynthesis.speak(utterance);
    setTtsState({ msgIndex, status: 'playing' });
  };

  // Pause audio
  const handlePauseAudio = (msgIndex) => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setTtsState({ msgIndex, status: 'paused' });
    }
  };

  // Resume audio
  const handleResumeAudio = (msgIndex) => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setTtsState({ msgIndex, status: 'playing' });
    }
  };

  // Stop audio
  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setTtsState({ msgIndex: null, status: 'idle' });
  };

  // Stop speech when closing chatbot
  useEffect(() => {
    if (!isOpen) {
      handleStopAudio();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // =========================================================================
  // INTELLIGENT MULTILINGUAL QUERY PROCESSOR (5 LANGUAGES: EN, TE, TA, KN, ML)
  // =========================================================================
  const processUserQuery = async (queryText, lang) => {
    if (!queryText.trim()) return;

    const userQuery = queryText.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setPrompt('');
    setLoading(true);

    const lower = userQuery.toLowerCase();
    let replyText = "";
    let targetTab = null;
    let targetTabName = "";

    // 1. My Journey / Life Timeline / Birth Certificate
    if (
      lower.includes("journey") || lower.includes("timeline") || lower.includes("birth") ||
      lower.includes("ప్రయాణం") || lower.includes("కాలక్రమం") || lower.includes("జనన") ||
      lower.includes("பயணம்") || lower.includes("காலவரிசை") || lower.includes("பிறப்பு") ||
      lower.includes("ಜೀವನ") || lower.includes("ಪ್ರಯಾಣ") || lower.includes("ಜನನ") ||
      lower.includes("യാത്ര") || lower.includes("ജനന") || lower.includes("നാഴികക്കല്ലുകൾ")
    ) {
      targetTab = "journey";
      targetTabName = "My Journey (Life Documents Timeline)";
      if (lang === 'te') {
        replyText = `ఖచ్చితంగా! మీ పుట్టిన తేదీ ధృవీకరణ పత్రం నుండి నేటి వరకు గల 15 మైలురాళ్ల **"నా ప్రయాణం"** విభాగాన్ని తెరుస్తున్నాను.`;
      } else if (lang === 'ta') {
        replyText = `நிச்சயமாக! உங்கள் பிறப்புச் சான்றிதழில் இருந்து அனைத்து 15 ஆவணங்களைக் கொண்ட **"என் பயணம்"** பகுதியை திறக்கிறேன்.`;
      } else if (lang === 'kn') {
        replyText = `ಖಂಡಿತವಾಗಿಯೂ! ನಿಮ್ಮ ಜನನ ಪ್ರಮಾಣಪತ್ರದಿಂದ ಇಂದಿನವರೆಗೆ 15 ಮೈಲಿಗಲ್ಲುಗಳನ್ನು ಹೊಂದಿರುವ **"ನನ್ನ ಪ್ರಯಾಣ"** ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.`;
      } else if (lang === 'ml') {
        replyText = `തീർച്ചയായും! നിങ്ങളുടെ ജനന സർട്ടിഫിക്കറ്റ് മുതൽ ഇന്നുവരെയുള്ള 15 ജീവിത നാഴികക്കല്ലുകൾ അടങ്ങിയ **"എന്റെ യാത്ര"** തുറക്കുന്നു.`;
      } else {
        replyText = `Opening **My Journey**! You can inspect all 15 chronological life credentials from your Birth Certificate to Sovereign Identity.`;
      }
    }
    // 2. Digital Citizen Card / QR Code / Identity Card
    else if (
      lower.includes("card") || lower.includes("digital id") || lower.includes("qr") || lower.includes("identity") ||
      lower.includes("కార్డ్") || lower.includes("గుర్తింపు") || lower.includes("కార్డు") ||
      lower.includes("அட்டை") || lower.includes("அடையாள") ||
      lower.includes("ಕಾರ್ಡ್") || lower.includes("ಗುರುತಿನ") ||
      lower.includes("കാർഡ്") || lower.includes("തിരിച്ചറിയൽ") || lower.includes("ഐഡി")
    ) {
      targetTab = "card";
      targetTabName = "My Civic Card";
      if (lang === 'te') {
        replyText = `మీ **CIVIQONE డిజిటల్ సిటిజెన్ కార్డ్** (${civicId}) తెరవబడింది. 3D ఫ్లిప్ చేసి వెనుక వైపు భద్రతా వివరాలు చూడవచ్చు.`;
      } else if (lang === 'ta') {
        replyText = `உங்கள் **CIVIQONE டிஜிட்டல் குடிமக்கள் அட்டை** (${civicId}) திறக்கப்படுகிறது. 3D சுழற்சி மூலம் பாதுகாப்பு விவரங்களை சரிபார்க்கலாம்.`;
      } else if (lang === 'kn') {
        replyText = `ನಿಮ್ಮ **CIVIQONE ಡಿಜಿಟಲ್ ಸಿಟಿಜನ್ ಕಾರ್ಡ್** (${civicId}) ತೆರೆಯಲಾಗಿದೆ. 3D ಫ್ಲಿಪ್ ಮಾಡಿ ಭದ್ರತಾ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಬಹುದು.`;
      } else if (lang === 'ml') {
        replyText = `നിങ്ങളുടെ **CIVIQONE ഡിജിറ്റൽ സിറ്റിസൺ കാർഡ്** (${civicId}) തുറക്കുന്നു. 3D ഫ്ലിപ്പ് വഴി സുരക്ഷാ വിവരങ്ങൾ പരിശോധിക്കാം.`;
      } else {
        replyText = `Opening your **CIVIQONE Digital Citizen Card** (${civicId}) with in-place 3D flip and scannable QR verification.`;
      }
    }
    // 3. Family & Dependent Vault / Children / Father / Senior Parents
    else if (
      lower.includes("family") || lower.includes("child") || lower.includes("dependent") || lower.includes("son") || lower.includes("daughter") || lower.includes("parent") ||
      lower.includes("కుటుంబం") || lower.includes("పిల్లల") || lower.includes("తండ్రి") ||
      lower.includes("குடும்பம்") || lower.includes("குழந்தைகள்") || lower.includes("பெற்றோர்") ||
      lower.includes("ಕುಟುಂಬ") || lower.includes("ಮಕ್ಕಳು") || lower.includes("ತಂದೆ") ||
      lower.includes("കുടുംബം") || lower.includes("കുട്ടികൾ") || lower.includes("മാതാപിതാക്കൾ")
    ) {
      targetTab = "vault";
      targetTabName = "Family & Dependent Vault";
      if (lang === 'te') {
        replyText = `మీ **కుటుంబ & ఆధారపడిన వారి వాల్ట్** తెరుస్తున్నాను. ఇక్కడ మీ పిల్లలు మరియు వయోవృద్ధ తల్లిదండ్రుల అధికారిక పత్రాలు ఉన్నాయి.`;
      } else if (lang === 'ta') {
        replyText = `உங்கள் **குடும்பம் மற்றும் சார்ந்திருப்போர் வால்ட்** திறக்கப்படுகிறது. உங்கள் குழந்தைகள் மற்றும் பெற்றோரின் சரிபார்க்கப்பட்ட ஆவணங்களை இங்கே நிர்வகிக்கலாம்.`;
      } else if (lang === 'kn') {
        replyText = `ನಿಮ್ಮ **ಕುಟುಂಬ ಮತ್ತು ಅವಲಂಬಿತರ ವಾಲ್ಟ್** ತೆರೆಯಲಾಗುತ್ತಿದೆ. ನಿಮ್ಮ ಮಕ್ಕಳು ಮತ್ತು ಪೋಷಕರ ಅಧಿಕೃತ ದಾಖಲೆಗಳನ್ನು ಇಲ್ಲಿ ನಿರ್ವಹಿಸಬಹುದು.`;
      } else if (lang === 'ml') {
        replyText = `നിങ്ങളുടെ **കുടുംബ & ആശ്രിത വോൾട്ട്** തുറക്കുന്നു. കുട്ടികളുടെയും മാതാപിതാക്കളുടെയും സാക്ഷ്യപ്പെടുത്തിയ രേഖകൾ ഇവിടെ കൈകാര്യം ചെയ്യാം.`;
      } else {
        replyText = `Opening your **Family & Dependent Vault**! You can manage verified credentials for your children and senior parents with legal guardianship custody.`;
      }
    }
    // 4. Civic Vault / Documents / Credentials / Certificates
    else if (
      lower.includes("vault") || lower.includes("document") || lower.includes("certificate") ||
      lower.includes("పత్రాలు") || lower.includes("దస్తావేజులు") || lower.includes("వాల్ట్") ||
      lower.includes("ஆவணங்கள்") || lower.includes("வால்ட்") || lower.includes("சான்றிதழ்") ||
      lower.includes("ದಾಖಲೆಗಳು") || lower.includes("ವಾಲ್ಟ್") || lower.includes("ಪತ್ರಗಳು") ||
      lower.includes("വോൾട്ട്") || lower.includes("രേഖകൾ") || lower.includes("പ്രമാണങ്ങൾ")
    ) {
      targetTab = "vault";
      targetTabName = "My Civic Vault";
      if (lang === 'te') {
        replyText = `మీ **సివిక్ వాల్ట్** లోకి నావిగేట్ చేస్తున్నాను. ఇక్కడ మీ అధికారిక పత్రాలన్నీ సురక్షితంగా భద్రపరచబడి ఉంటాయి.`;
      } else if (lang === 'ta') {
        replyText = `உங்கள் **CIVIQONE வால்ட்** பகுதிக்கு செல்கிறோம். உங்கள் அனைத்து அரசு ஆவணங்களும் இங்கு பாதுகாப்பாக சேமிக்கப்பட்டுள்ளன.`;
      } else if (lang === 'kn') {
        replyText = `ನಿಮ್ಮ **ಸಿವಿಕ್ ವಾಲ್ಟ್** ಗೆ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಲಾಗುತ್ತಿದೆ. ನಿಮ್ಮ ಎಲ್ಲಾ ಅಧಿಕೃತ ದಾಖಲೆಗಳು ಇಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿವೆ.`;
      } else if (lang === 'ml') {
        replyText = `നിങ്ങളുടെ **സിവിക് വോൾട്ടിലേക്ക്** പോകുന്നു. നിങ്ങളുടെ എല്ലാ ഔദ്യോഗിക രേഖകളും ഇവിടെ സുരക്ഷിതമായി സൂക്ഷിച്ചിരിക്കുന്നു.`;
      } else {
        replyText = `Navigating to **My Vault**. All your verified government documents and credentials are encrypted and stored here.`;
      }
    }
    // 5. Privacy / Access & Consent / Data Sharing
    else if (
      lower.includes("privacy") || lower.includes("consent") || lower.includes("access") || lower.includes("data") ||
      lower.includes("ఎవరి వద్ద") || lower.includes("యాక్సెస్") || lower.includes("గోప్యత") ||
      lower.includes("அணுகல்") || lower.includes("தனியுரிமை") || lower.includes("அனுமதி") ||
      lower.includes("ಯಾರು ನೋಡುತ್ತಿದ್ದಾರೆ") || lower.includes("ಗೌಪ್ಯತೆ") || lower.includes("ಅನುಮತಿ") ||
      lower.includes("ആർക്കൊക്കെ") || lower.includes("സ്വകാര്യത") || lower.includes("അനുമതി")
    ) {
      targetTab = "privacy";
      targetTabName = "My Access & Consent";
      if (lang === 'te') {
        replyText = `మీ డేటాను చూసేందుకు అనుమతి పొందిన సంస్థల వివరాలను **"My Access & Consent"** లో చూడవచ్చు.`;
      } else if (lang === 'ta') {
        replyText = `உங்கள் தகவல்களை அணுக அனுமதி பெற்ற நிறுவனங்களின் விவரங்களை **"My Access & Consent"** பகுதியில் பார்க்கலாம்.`;
      } else if (lang === 'kn') {
        replyText = `ನಿಮ್ಮ ಡೇಟಾವನ್ನು ವೀಕ್ಷಿಸಲು ಅನುಮತಿ ಪಡೆದ ಸಂಸ್ಥೆಗಳ ವಿವರಗಳನ್ನು **"My Access & Consent"** ನಲ್ಲಿ ನೋಡಬಹುದು.`;
      } else if (lang === 'ml') {
        replyText = `നിങ്ങളുടെ രേഖകൾ കാണാൻ അനുമതി ലഭിച്ച സ്ഥാപനങ്ങളുടെ വിവരങ്ങൾ **"My Access & Consent"** ൽ കാണാം.`;
      } else {
        replyText = `Navigating to **My Access & Consent**. You can view which organizations (e.g. State Bank of India, Apollo Hospitals) hold view-only access.`;
      }
    }
    // 6. Tourism Guide / Destinations / CIVIQONE World
    else if (
      lower.includes("tourism") || lower.includes("destination") || lower.includes("world") || lower.includes("travel") || lower.includes("tour") ||
      lower.includes("పర్యాటక") || lower.includes("ప్రదేశాలు") || lower.includes("విహారయాత్ర") ||
      lower.includes("சுற்றுலா") || lower.includes("இடங்கள்") || lower.includes("பயணங்கள்") ||
      lower.includes("ಪ್ರವಾಸ") || lower.includes("ಸ್ಥಳಗಳು") || lower.includes("ಪ್ರವಾಸೋದ್ಯಮ") ||
      lower.includes("വിനോദസഞ്ചാരം") || lower.includes("സ്ഥലങ്ങൾ") || lower.includes("ടൂറിസം")
    ) {
      targetTab = "tourism";
      targetTabName = "CIVIQONE World (Tourism Guide)";
      if (lang === 'te') {
        replyText = `**CIVIQONE వరల్డ్** పర్యాటక విభాగాన్ని తెరుస్తున్నాను. ఇక్కడ ప్రముఖ పర్యాటక ప్రదేశాలు మరియు ఉత్తమ సీజన్ల వివరాలు ఉన్నాయి.`;
      } else if (lang === 'ta') {
        replyText = `**CIVIQONE World** சுற்றுலா பகுதியை திறக்கிறேன். சிறந்த சுற்றுலா தலங்கள் மற்றும் பயண வழிகாட்டிகளை இங்கே காணலாம்.`;
      } else if (lang === 'kn') {
        replyText = `**CIVIQONE World** ಪ್ರವಾಸ ವಿಭಾಗವನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ. ಪ್ರಮುಖ ಪ್ರವಾಸಿ ತಾಣಗಳು ಮತ್ತು ಹವಾಮಾನ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಅನ್ವೇಷಿಸಿ.`;
      } else if (lang === 'ml') {
        replyText = `**CIVIQONE World** ടൂറിസം വിഭാഗം തുറക്കുന്നു. പ്രമുഖ വിനോദസഞ്ചാര കേന്ദ്രങ്ങളും കാലാവസ്ഥാ വിവരങ്ങളും ഇവിടെ കാണാം.`;
      } else {
        replyText = `Opening **CIVIQONE World**! Explore curated Indian and global destinations with recommended visiting seasons and climate guides.`;
      }
    }
    // 7. Driving Licence & Expiry Status
    else if (
      lower.includes("licence") || lower.includes("license") || lower.includes("dl") || lower.includes("expire") || lower.includes("expiry") ||
      lower.includes("డ్రైవింగ్") || lower.includes("లైసెన్స్") ||
      lower.includes("ஓட்டுநர்") || lower.includes("உரிமம்") ||
      lower.includes("ಚಾಲನಾ") || lower.includes("ಪರವಾನಗಿ") ||
      lower.includes("ഡ്രൈവിംഗ്") || lower.includes("ലൈസൻസ്")
    ) {
      if (lang === 'te') {
        replyText = `🚗 **స్మార్ట్ డ్రైవింగ్ లైసెన్స్ వివరాలు**:\n• స్థితి: 🟢 యాక్టివ్ & ధృవీకరించబడింది\n• లైసెన్స్ నం: **AP02 20180094821**\n• చెల్లుబాటు గడువు: **14-10-2028**\n• జారీ చేసిన వారు: రవాణా మరియు రహదారుల మంత్రిత్వ శాఖ (MoRTH).`;
      } else if (lang === 'ta') {
        replyText = `🚗 **ஸ்மார்ட் ஓட்டுநர் உரிம விவரம்**:\n• நிலை: 🟢 செயலில் & சரிபார்க்கப்பட்டது\n• உரிம எண்: **AP02 20180094821**\n• செல்லுபடியாகும் தேதி: **14-10-2028**\n• வழங்கிய அமைப்பு: சாலைப் போக்குவரத்து அமைச்சகம் (MoRTH).`;
      } else if (lang === 'kn') {
        replyText = `🚗 **ಸ್ಮಾರ್ಟ್ ಚಾಲನಾ ಪರವಾನಗಿ ವಿವರ**:\n• ಸ್ಥಿತಿ: 🟢 ಸಕ್ರಿಯ ಮತ್ತು ಪರಿಶೀಲಿಸಲಾಗಿದೆ\n• ಪರವಾನಗಿ ಸಂಖ್ಯೆ: **AP02 20180094821**\n• ಮಾನ್ಯತೆಯ ದಿನಾಂಕ: **14-10-2028**\n• ನೀಡಿದವರು: ರಸ್ತೆ ಸಾರಿಗೆ ಮತ್ತು ಹೆದ್ದಾರಿ ಸಚಿವಾಲಯ (MoRTH).`;
      } else if (lang === 'ml') {
        replyText = `🚗 **സ്മാർട്ട് ഡ്രൈവിംഗ് ലൈസൻസ് വിവരങ്ങൾ**:\n• നില: 🟢 സജീവം & സാക്ഷ്യപ്പെടുത്തിയത്\n• ലൈസൻസ് നമ്പർ: **AP02 20180094821**\n• കാലാവധി: **14-10-2028**\n• നൽകിയത്: റോഡ് ഗതാഗത മന്ത്രാലയം (MoRTH).`;
      } else {
        replyText = `🚗 **Smart Driving Licence Record**:\n• Status: 🟢 Active & Verified\n• License No: **AP02 20180094821**\n• Valid Until: **14-10-2028**\n• Issued By: Ministry of Road Transport & Highways (MoRTH).`;
      }
    }
    // 8. Aadhaar Sovereign Token
    else if (
      lower.includes("aadhaar") || lower.includes("ఆధార్") || lower.includes("ஆதார்") ||
      lower.includes("ಆಧಾರ್") || lower.includes("ആധാർ")
    ) {
      if (lang === 'te') {
        replyText = `🛡️ **ఆధార్ సార్వభౌమ టోకెన్**:\n• సూచన సంఖ్య: **XXXX XXXX 1001**\n• బయోమెట్రిక్స్: ధృవీకరించబడింది\n• స్థితి: 100% క్రిప్టోగ్రాఫికల్లీ సురక్షితం (రహస్య డేటా ఎక్కడా బయటకు వెల్లడికాదు).`;
      } else if (lang === 'ta') {
        replyText = `🛡️ **ஆதார் டோக்கன்**:\n• குறிப்பு எண்: **XXXX XXXX 1001**\n• பயோமெட்ரிக்ஸ்: சரிபார்க்கப்பட்டது\n• நிலை: 100% குறியாக்க முறையில் பாதுகாக்கப்பட்டது.`;
      } else if (lang === 'kn') {
        replyText = `🛡️ **ಆಧಾರ್ ಟೋಕನ್**:\n• ಉಲ್ಲೇಖ: **XXXX XXXX 1001**\n• ಬಯೋಮೆಟ್ರಿಕ್ಸ್: ಪರಿಶೀಲಿಸಲಾಗಿದೆ\n• ಸ್ಥಿತಿ: 100% ಗೂಢಲಿಪೀಕರಿಸಿದ ಸುರಕ್ಷಿತ ದಾಖಲೆ.`;
      } else if (lang === 'ml') {
        replyText = `🛡️ **ആധാർ ടോക്കൺ**:\n• റഫറൻസ്: **XXXX XXXX 1001**\n• ബയോമെട്രിക്സ്: പരിശോധിച്ചുറപ്പിച്ചു\n• നില: 100% ക്രിപ്റ്റോഗ്രാഫിക്കലായി സുരക്ഷിതം.`;
      } else {
        replyText = `🛡️ **Aadhaar Sovereign Token**:\n• Reference: **XXXX XXXX 1001**\n• Biometrics: Captured & Verified\n• Status: 100% Cryptographically Encrypted (No raw Aadhaar data exposed).`;
      }
    }
    // 9. Voter ID / Electoral Record
    else if (
      lower.includes("voter") || lower.includes("epic") || lower.includes("election") ||
      lower.includes("ఓటరు") || lower.includes("வாக்காளர்") || lower.includes("ಮತದಾರರ") || lower.includes("വോട്ടർ")
    ) {
      if (lang === 'te') {
        replyText = `🗳️ **ఓటరు గుర్తింపు పత్రం**:\n• EPIC సంఖ్య: **CIV-VTR-99482**\n• నియోజకవర్గం: AP-102 (సెంట్రల్)\n• పోలింగ్ కేంద్రం: ప్రభుత్వ ఉన్నత పాఠశాల, బూత్ #4\n• స్థితి: 🟢 ఎన్నికల జాబితాలో యాక్టివ్.`;
      } else if (lang === 'ta') {
        replyText = `🗳️ **வாக்காளர் அடையாள பதிவு**:\n• EPIC எண்: **CIV-VTR-99482**\n• தொகுதி: AP-102 (மத்திய)\n• வாக்குச்சாவடி: அரசு உயர்நிலைப்பள்ளி, சாவடி #4\n• நிலை: 🟢 வாக்காளர் பட்டியலில் செயலில் உள்ளது.`;
      } else if (lang === 'kn') {
        replyText = `🗳️ **ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ**:\n• EPIC ಸಂಖ್ಯೆ: **CIV-VTR-99482**\n• ಕ್ಷೇತ್ರ: AP-102 (ಸೆಂಟ್ರಲ್)\n• ಮತಗಟ್ಟೆ: ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ, ಬೂತ್ #4\n• ಸ್ಥಿತಿ: 🟢 ಮತದಾರರ ಪಟ್ಟಿಯಲ್ಲಿ ಸಕ್ರಿಯವಾಗಿದೆ.`;
      } else if (lang === 'ml') {
        replyText = `🗳️ **വോട്ടർ തിരിച്ചറിയൽ രേഖ**:\n• EPIC നമ്പർ: **CIV-VTR-99482**\n• മണ്ഡലം: AP-102 (സെൻട്രൽ)\n• പോളിംഗ് സ്റ്റേഷൻ: ഗവ. ഹൈസ്കൂൾ, ബൂത്ത് #4\n• നില: 🟢 വോട്ടർ പട്ടികയിൽ സജീവം.`;
      } else {
        replyText = `🗳️ **Voter Identification Record**:\n• EPIC No: **CIV-VTR-99482**\n• Constituency: AP-102 (Central)\n• Polling Station: Govt High School, Booth #4\n• Status: 🟢 Active on Sovereign Electoral Roll.`;
      }
    }
    // 10. Default / Contextual Fallback Response
    else {
      if (lang === 'te') {
        replyText = `మీరు "${userQuery}" గురించి అడిగారు. మీ సివిక్ ఐడి **${civicId}** మరియు అన్ని పత్రాలు 100% ధృవీకరించబడి సురక్షితంగా ఉన్నాయి.`;
      } else if (lang === 'ta') {
        replyText = `நீங்கள் "${userQuery}" பற்றி கேட்டீர்கள். உங்கள் CIVIQONE ஐடி **${civicId}** மற்றும் அனைத்து ஆவணங்களும் பாதுகாப்பாக சரிபார்க்கப்பட்டுள்ளன.`;
      } else if (lang === 'kn') {
        replyText = `ನೀವು "${userQuery}" ಕುರಿತು ಕೇಳಿದ್ದೀರಿ. ನಿಮ್ಮ ಸಿವಿಕ್ ಐಡಿ **${civicId}** ಮತ್ತು ದಾಖಲೆಗಳು ಸುರಕ್ಷಿತವಾಗಿವೆ.`;
      } else if (lang === 'ml') {
        replyText = `നിങ്ങൾ "${userQuery}" സംബന്ധിച്ച് അന്വേഷിച്ചു. നിങ്ങളുടെ സിവിക് ഐഡി **${civicId}** ഉം രേഖകളും പൂർണ്ണമായും സുരക്ഷിതമാണ്.`;
      } else {
        replyText = `I have processed your query regarding "${userQuery}". Your identity credential **${civicId}** and documents are cryptographically authenticated and active in CIVIQONE.`;
      }
    }

    setLoading(false);
    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: replyText,
        lang: lang,
        actionTab: targetTab,
        actionLabel: targetTabName
      }
    ]);

    // NOTE: Strict requirement: Do NOT automatically play audio. Audio plays only when user taps Listen.
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    processUserQuery(prompt, selectedLang);
  };

  const getChatWindowStyle = () => {
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const chatWidth = Math.min(winW * 0.92, 420);
    const chatHeight = Math.min(winH * 0.85, 580);
    const margin = 12;

    // Open above the bot if there's enough space, otherwise below or centered
    let top = position.y - chatHeight - 12;
    if (top < margin) {
      top = position.y + 72;
      if (top + chatHeight > winH - margin) {
        top = Math.max(margin, (winH - chatHeight) / 2);
      }
    }

    // Horizontal placement relative to bot
    let left = position.x - chatWidth + 64;
    if (left < margin) {
      left = position.x;
      if (left + chatWidth > winW - margin) {
        left = Math.max(margin, (winW - chatWidth) / 2);
      }
    }

    left = Math.min(Math.max(left, margin), Math.max(margin, winW - chatWidth - margin));
    top = Math.min(Math.max(top, margin), Math.max(margin, winH - chatHeight - margin));

    return {
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      width: `${chatWidth}px`,
      height: `${chatHeight}px`,
      borderRadius: '24px',
      boxShadow: '0 25px 60px rgba(16, 27, 61, 0.35)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      border: '1.5px solid #CBD5E1',
      zIndex: 100
    };
  };

  return (
    <>
      {/* FLOATING DRAGGABLE TRIGGER BUTTON */}
      {!isOpen && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 99,
            touchAction: 'none',
            userSelect: 'none',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <button
            type="button"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#101B3D',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isDragging
                ? '0 18px 38px rgba(16, 27, 61, 0.6), 0 0 0 4px rgba(56, 189, 248, 0.6)'
                : '0 10px 28px rgba(16, 27, 61, 0.45), 0 0 0 3px rgba(26, 79, 156, 0.3)',
              cursor: isDragging ? 'grabbing' : 'grab',
              border: '2px solid #38BDF8',
              transform: isDragging ? 'scale(1.08)' : 'scale(1)',
              transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s'
            }}
            className="pulse-glow"
            title="CIVIQONE AI — Drag anywhere to move, tap to open"
            aria-label="Open Multilingual CIVIQONE AI Assistant"
          >
            <div style={{ position: 'relative', pointerEvents: 'none' }}>
              <Bot size={30} style={{ color: '#38BDF8' }} />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                border: '2px solid #101B3D'
              }} />
            </div>
          </button>
        </div>
      )}

      {/* CHATBOT MAIN WINDOW PANEL */}
      {isOpen && (
        <div style={getChatWindowStyle()}>
          
          {/* HEADER SECTION */}
          <div style={{
            backgroundColor: '#101B3D',
            color: '#FFFFFF',
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(26, 79, 156, 0.6)',
                  border: '1px solid #38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                  flexShrink: 0
                }}>
                  <Bot size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#F8F7F2', lineHeight: 1.1, margin: 0 }}>
                    CIVIQONE AI
                  </h3>
                  <span style={{ fontSize: '0.65rem', color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    Multilingual Voice Assistant
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    handleStopAudio();
                    setIsOpen(false);
                  }}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Close CIVIQONE AI"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* 5-Language Selector inside Chatbot */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              padding: '4px 0 2px 0',
              scrollbarWidth: 'none'
            }}>
              <span style={{ fontSize: '0.68rem', color: '#93C5FD', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Globe2 size={13} /> Lang:
              </span>
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    style={{
                      backgroundColor: isSelected ? '#1D4ED8' : 'rgba(255,255,255,0.08)',
                      color: isSelected ? '#FFFFFF' : '#CBD5E1',
                      border: isSelected ? '1.5px solid #38BDF8' : '1px solid rgba(255,255,255,0.18)',
                      padding: '3px 9px',
                      borderRadius: '14px',
                      fontSize: '0.7rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: isSelected ? '0 0 8px rgba(56, 189, 248, 0.35)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                    title={`Switch to ${lang.label} (${lang.native})`}
                    aria-label={`Select ${lang.label}`}
                  >
                    {isSelected && <Check size={11} style={{ color: '#38BDF8', strokeWidth: 3 }} />}
                    <span>{lang.native}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MESSAGES CONVERSATION AREA */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#F8FAFC'
          }}>
            {messages.map((msg, idx) => {
              const isAi = msg.sender === 'ai';
              const isTtsActive = ttsState.msgIndex === idx;

              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '88%',
                    backgroundColor: msg.sender === 'user' ? '#101B3D' : '#FFFFFF',
                    color: msg.sender === 'user' ? '#F8F7F2' : '#172033',
                    padding: '12px 14px',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    boxShadow: '0 2px 8px rgba(16, 27, 61, 0.06)',
                    fontSize: '0.85rem',
                    lineHeight: 1.45,
                    border: msg.sender === 'user' ? '1px solid #1E2F6B' : '1.5px solid #E2E8F0',
                    position: 'relative'
                  }}
                >
                  <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

                  {/* Direct Action Navigation Button if AI suggested a section */}
                  {msg.actionTab && onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => {
                        handleStopAudio();
                        onNavigateTab(msg.actionTab);
                        setIsOpen(false);
                      }}
                      style={{
                        marginTop: '10px',
                        backgroundColor: '#EFF6FF',
                        color: '#1A4F9C',
                        border: '1.5px solid #BFDBFE',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.775rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                      }}
                    >
                      <span>Go to {msg.actionLabel || msg.actionTab}</span>
                      <ArrowRight size={14} />
                    </button>
                  )}

                  {/* INTERACTIVE TAP-TO-LISTEN TEXT-TO-SPEECH CONTROLS ON AI RESPONSES */}
                  {isAi && (
                    <div style={{
                      marginTop: '10px',
                      paddingTop: '8px',
                      borderTop: '1px solid #F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {(!isTtsActive || ttsState.status === 'idle') ? (
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(msg.text, msg.lang || selectedLang, idx)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: '#F1F5F9',
                              color: '#0F172A',
                              border: '1px solid #CBD5E1',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                            title="Listen to this response aloud"
                            aria-label="Listen to response"
                          >
                            <Volume2 size={14} style={{ color: '#0284C7' }} />
                            <span>Listen</span>
                          </button>
                        ) : ttsState.status === 'playing' ? (
                          <>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#E0F2FE',
                              color: '#0369A1',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 800
                            }}>
                              <Volume2 size={12} className="animate-pulse" />
                              <span>Speaking...</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handlePauseAudio(idx)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: '#FEF3C7',
                                color: '#92400E',
                                border: '1px solid #FDE68A',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="Pause voice"
                            >
                              <Pause size={12} />
                              <span>Pause</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleStopAudio}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: '#FEE2E2',
                                color: '#B91C1C',
                                border: '1px solid #FECACA',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="Stop voice"
                            >
                              <Square size={11} />
                              <span>Stop</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#FEF3C7',
                              color: '#92400E',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 800
                            }}>
                              <Pause size={12} />
                              <span>Paused</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleResumeAudio(idx)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: '#DCFCE7',
                                color: '#166534',
                                border: '1px solid #BBF7D0',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="Resume voice"
                            >
                              <Play size={12} />
                              <span>Resume</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleStopAudio}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: '#FEE2E2',
                                color: '#B91C1C',
                                border: '1px solid #FECACA',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="Stop voice"
                            >
                              <Square size={11} />
                              <span>Stop</span>
                            </button>
                          </>
                        )}
                      </div>

                      <span style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: 600 }}>
                        {SUPPORTED_LANGUAGES.find(l => l.code === (msg.lang || selectedLang))?.native}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: '#FFFFFF',
                padding: '10px 16px',
                borderRadius: '14px',
                fontSize: '0.8rem',
                color: '#1A4F9C',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                <RefreshCw size={14} className="animate-spin" /> Thinking in {SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.native}...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ACTIVE VOICE LISTENING ANIMATION BANNER */}
          {isListening && (
            <div style={{
              backgroundColor: '#EFF6FF',
              borderTop: '1px solid #BFDBFE',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#1A4F9C',
              fontSize: '0.775rem',
              fontWeight: 800
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#DC2626',
                  animation: 'pulseGlow 1s infinite'
                }} />
                <span>Listening in {SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.native}... Speak now</span>
              </div>
              <button
                type="button"
                onClick={toggleVoiceInput}
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 800 }}
              >
                Stop
              </button>
            </div>
          )}

          {/* QUICK PROMPT SUGGESTION CHIPS */}
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {(QUICK_SUGGESTIONS[selectedLang] || QUICK_SUGGESTIONS.en).map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (item.tab && onNavigateTab) {
                    processUserQuery(item.text, selectedLang);
                  } else {
                    setPrompt(item.text);
                    processUserQuery(item.text, selectedLang);
                  }
                }}
                style={{
                  backgroundColor: '#F8FAFC',
                  color: '#101B3D',
                  border: '1px solid #CBD5E1',
                  padding: '5px 10px',
                  borderRadius: '12px',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                className="hover-card"
              >
                {item.text}
              </button>
            ))}
          </div>

          {/* VOICE & TEXT INPUT FORM */}
          <form
            onSubmit={handleFormSubmit}
            style={{
              padding: '12px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? "Stop Listening" : "Speak to CIVIQONE AI"}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: isListening ? '#DC2626' : '#EFF6FF',
                color: isListening ? '#FFFFFF' : '#1A4F9C',
                border: isListening ? 'none' : '1.5px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
              aria-label="Voice input"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Query Input Box */}
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Ask or speak in ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.native}...`}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none',
                color: '#172033'
              }}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: !prompt.trim() || loading ? '#CBD5E1' : '#101B3D',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !prompt.trim() || loading ? 'not-allowed' : 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
              aria-label="Send query"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}

    </>
  );
}
