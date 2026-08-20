// src/components/AiAgentFloating.jsx - Multilingual Voice-Enabled CIVIQONE AI Assistant 2.0
// Supports Voice Input & Speech Synthesis in Telugu, Hindi, Tamil, Kannada, and English with Direct Portal Navigation

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, User,
  RefreshCw, ShieldCheck, ArrowRight, Compass, Ticket, FolderClosed,
  Lock, Milestone, Globe2, Check, ExternalLink
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', speechCode: 'en-IN' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', speechCode: 'hi-IN' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', speechCode: 'kn-IN' }
];

const LOCALIZED_GREETINGS = {
  en: "Hello! I am CIVIQONES AI, your multilingual digital identity assistant. Speak or type to navigate portals, query documents, and check verifications.",
  te: "నమస్కారం! నేను CIVIQONES AI ని. మీ డిజిటల్ గుర్తింపు మరియు పత్రాల సహాయకుడిని. మాట్లాడండి లేదా టైప్ చేసి మీ పత్రాలను శోధించండి.",
  hi: "नमस्ते! मैं CIVIQONES AI हूँ। आपकी डिजिटल पहचान और दस्तावेज़ सहायक। पोर्टल नेविगेट करने या दस्तावेज़ों की जाँच के लिए बोलें या टाइप करें।",
  ta: "வணக்கம்! நான் CIVIQONES AI. உங்கள் டிஜிட்டல் அடையாள உதவியாளர். ஆவணங்களை பார்க்க அல்லது தேட பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்.",
  kn: "ನಮಸ್ಕಾರ! ನಾನು CIVIQONES AI. ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಗುರುತಿನ ಸಹಾಯಕ. ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಲು ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ."
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
  hi: [
    { text: "मेरी जीवन यात्रा (My Journey) खोलें", tab: "journey" },
    { text: "मेरा डिजिटल नागरिक कार्ड दिखाएं", tab: "card" },
    { text: "मेरा डेटा किसके पास है?", tab: "privacy" },
    { text: "सिविकवन वर्ल्ड (पर्यटन स्थल)", tab: "tourism" },
    { text: "ड्राइविंग लाइसेंस कब समाप्त होगा?", query: "driving licence expiry" }
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
  ]
};

export default function AiAgentFloating({ citizen = {}, documents = [], onNavigateTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

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
      const saved = localStorage.getItem('civiqones_ai_pos');
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
        localStorage.setItem('civiqones_ai_pos', JSON.stringify(position));
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
      text: LOCALIZED_GREETINGS.en,
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

  // Update greeting when language changes
  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode);
    const greeting = LOCALIZED_GREETINGS[langCode] || LOCALIZED_GREETINGS.en;
    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: `🌐 **Language switched to ${SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.native}**.\n\n${greeting}`
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

  // Text-To-Speech Output
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown asterisks for cleaner audio
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];
    utterance.lang = langObj.speechCode;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Intelligent Multilingual Query Processor & Navigation Engine
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

    // 1. Navigation Intelligence (Telugu, Hindi, Tamil, Kannada, English)
    if (lower.includes("journey") || lower.includes("ప్రయాణం") || lower.includes("यात्रा") || lower.includes("பயணம்") || lower.includes("ಜೀವನ") || lower.includes("timeline") || lower.includes("birth certificate")) {
      targetTab = "journey";
      targetTabName = "My Journey (Life Documents Timeline)";
      if (lang === 'te') {
        replyText = `ఖచ్చితంగా! మీ పుట్టిన తేదీ ధృవీకరణ పత్రం నుండి నేటి వరకు గల 15 మైలురాళ్ల **"నా ప్రయాణం"** విభాగాన్ని తెరుస్తున్నాను.`;
      } else if (lang === 'hi') {
        replyText = `बिल्कुल! आपके जन्म प्रमाण पत्र से लेकर आज तक के सभी 15 दस्तावेज़ों की **"मेरी जीवन यात्रा"** खोली जा रही है।`;
      } else if (lang === 'ta') {
        replyText = `நிச்சயமாக! உங்கள் பிறப்புச் சான்றிதழில் இருந்து அனைத்து 15 ஆவணங்களைக் கொண்ட **"என் பயணம்"** பகுதியை திறக்கிறேன்.`;
      } else {
        replyText = `Opening **My Journey**! You can inspect all 15 chronological life credentials from your Birth Certificate to Sovereign Identity.`;
      }
    } else if (lower.includes("card") || lower.includes("కార్డ్") || lower.includes("గుర్తింపు") || lower.includes("कार्ड") || lower.includes("அட்டை") || lower.includes("ಗುರುತಿನ") || lower.includes("digital id") || lower.includes("qr")) {
      targetTab = "card";
      targetTabName = "My Civic Card";
      if (lang === 'te') {
        replyText = `మీ **సివిక్ వన్ డిజిటల్ సిటిజెన్ కార్డ్** (` + civicId + `) తెరవబడింది. 3D ఫ్లిప్ చేసి వెనుక వైపు భద్రతా వివరాలు చూడవచ్చు.`;
      } else if (lang === 'hi') {
        replyText = `आपका **सिविकवन डिजिटल नागरिक कार्ड** (` + civicId + `) खोल दिया गया है। 3D फ्लिप करके सुरक्षा कोड देख सकते हैं।`;
      } else {
        replyText = `Opening your **CIVIQONE Digital Citizen Card** (${civicId}) with in-place 3D flip and scannable QR verification.`;
      }
    } else if (lower.includes("family") || lower.includes("child") || lower.includes("dependent") || lower.includes("son") || lower.includes("daughter") || lower.includes("కుటుంబం") || lower.includes("పిల్లల") || lower.includes("తండ్రి") || lower.includes("परिवार") || lower.includes("बच्चे") || lower.includes("माता-पिता")) {
      targetTab = "vault";
      targetTabName = "Family & Dependent Vault";
      replyText = lang === 'te'
        ? `మీ **కుటుంబ & ఆధారపడిన వారి వాల్ట్** తెరుస్తున్నాను. ఇక్కడ మీ పిల్లలు (ఆరవ్, అనన్య) మరియు వయోవృద్ధ తండ్రి గారి అధికారిక పత్రాలు ఉన్నాయి.`
        : `Opening your **Family & Dependent Vault**! You can manage verified credentials for your children (Aarav, Ananya) and senior parents with legal guardianship custody.`;
    } else if (lower.includes("vault") || lower.includes("పత్రాలు") || lower.includes("దస్తావేజులు") || lower.includes("दस्तावेज़") || lower.includes("ஆவணங்கள்") || lower.includes("ದಾಖಲೆಗಳು") || lower.includes("documents")) {
      targetTab = "vault";
      targetTabName = "My Vault";
      replyText = lang === 'te'
        ? `మీ **సివిక్ వాల్ట్** లోకి నావిగేట్ చేస్తున్నాను. ఇక్కడ మీ అధికారిక పత్రాలన్నీ భద్రపరచబడి ఉంటాయి.`
        : `Navigating to **My Vault**. All your verified government documents and credentials are encrypted and stored here.`;
    } else if (lower.includes("privacy") || lower.includes("consent") || lower.includes("access") || lower.includes("ఎవరి వద్ద") || lower.includes("యాక్సెస్") || lower.includes("डेटा") || lower.includes("அணுகல்")) {
      targetTab = "privacy";
      targetTabName = "My Access & Consent";
      replyText = lang === 'te'
        ? `మీ డేటాను చూసేందుకు అనుమతి పొందిన సంస్థల వివరాలను **"My Access & Consent"** లో చూడవచ్చు.`
        : `Navigating to **My Access & Consent**. You can view which organizations (e.g. State Bank of India, Apollo Hospitals) hold view-only access.`;
    } else if (lower.includes("tourism") || lower.includes("destination") || lower.includes("world") || lower.includes("పర్యాటక") || lower.includes("ప్రదేశాలు") || lower.includes("पर्यटन") || lower.includes("சுற்றுலா") || lower.includes("season") || lower.includes("విహారయాత్ర")) {
      targetTab = "tourism";
      targetTabName = "CIVIQONE World (Tourism Guide)";
      replyText = lang === 'te'
        ? `**సివిక్ వన్ వరల్డ్** పర్యాటక విభాగాన్ని తెరుస్తున్నాను. ఇక్కడ ప్రముఖ పర్యాటక ప్రదేశాలు మరియు ఉత్తమ సీజన్ల వివరాలు ఉన్నాయి.`
        : `Opening **CIVIQONE World**! Explore curated Indian and global destinations with recommended visiting seasons and climate guides.`;
    } else if (lower.includes("licence") || lower.includes("expire") || lower.includes("dl") || lower.includes("డ్రైవింగ్") || lower.includes("ड्राइविंग")) {
      replyText = `🚗 **Smart Driving Licence Record**:\n• Status: 🟢 Active & Verified\n• License No: **AP02 20180094821**\n• Valid Until: **14-10-2028**\n• Issued By: Ministry of Road Transport & Highways (MoRTH).`;
    } else if (lower.includes("aadhaar") || lower.includes("ఆధార్") || lower.includes("आधार")) {
      replyText = `🛡️ **Aadhaar Sovereign Token**:\n• Reference: **XXXX XXXX 1001**\n• Biometrics: Captured & Verified\n• Status: 100% Cryptographically Encrypted (No raw Aadhaar data exposed).`;
    } else {
      replyText = lang === 'te'
        ? `మీరు "${userQuery}" గురించి అడిగారు. మీ సివిక్ ఐడి **${civicId}** మరియు అన్ని పత్రాలు 100% ధృవీకరించబడి సురక్షితంగా ఉన్నాయి.`
        : `I have processed your query regarding "${userQuery}". Your identity credential **${civicId}** and documents are cryptographically authenticated and active.`;
    }

    setLoading(false);
    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: replyText,
        actionTab: targetTab,
        actionLabel: targetTabName
      }
    ]);

    // Speak response if voice was used
    if (isListening || selectedLang !== 'en') {
      speakText(replyText);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    processUserQuery(prompt, selectedLang);
  };

  const getChatWindowStyle = () => {
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const chatWidth = Math.min(winW * 0.92, 410);
    const chatHeight = Math.min(winH * 0.85, 560);
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
      {/* FLOATING DRAGGABLE TRIGGER BUTTON WITH PULSING VOICE RINGS */}
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
            title="CIVIQONES AI — Drag anywhere to move, tap to open"
            aria-label="Open Multilingual CIVIQONES AI Assistant"
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
          
          {/* HEADER SECTION (Deep Indigo Surface) */}
          <div style={{
            backgroundColor: '#101B3D',
            color: '#FFFFFF',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(26, 79, 156, 0.6)',
                  border: '1px solid #38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8'
                }}>
                  <Bot size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#F8F7F2', lineHeight: 1.1 }}>
                    CIVIQONES AI
                  </h3>
                  <span style={{ fontSize: '0.65rem', color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    Voice-Enabled Multilingual Assistant
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsSpeaking(prev => !prev)}
                  title={isSpeaking ? "Mute Speech" : "Speech Output Active"}
                  style={{ background: 'none', border: 'none', color: isSpeaking ? '#38BDF8' : '#94A3B8', cursor: 'pointer', padding: '4px' }}
                >
                  {isSpeaking ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking && window.speechSynthesis) window.speechSynthesis.cancel();
                    setIsOpen(false);
                  }}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                  aria-label="Close Assistant"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Indian Language Selector Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              <Globe2 size={14} style={{ color: '#93C5FD', flexShrink: 0 }} />
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    backgroundColor: selectedLang === lang.code ? '#1A4F9C' : 'rgba(255,255,255,0.08)',
                    color: selectedLang === lang.code ? '#FFFFFF' : '#CBD5E1',
                    border: selectedLang === lang.code ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.15)',
                    padding: '3px 8px',
                    borderRadius: '14px',
                    fontSize: '0.675rem',
                    fontWeight: selectedLang === lang.code ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {lang.native}
                </button>
              ))}
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
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '86%',
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

                {/* Speaker Button on AI response */}
                {msg.sender === 'ai' && (
                  <button
                    type="button"
                    onClick={() => speakText(msg.text)}
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '6px',
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: '2px',
                      opacity: 0.7
                    }}
                    title="Listen to this message"
                  >
                    <Volume2 size={13} />
                  </button>
                )}
              </div>
            ))}

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
            overflowX: 'auto'
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
              title={isListening ? "Stop Listening" : "Speak to CIVIQONES AI"}
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
