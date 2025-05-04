import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Fade,
  Divider,
  Tooltip,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useDispatch } from 'react-redux';
import { silentFetchLoans } from '../store/slices/loanSlice';
import { silentFetchUsers } from '../store/slices/userSlice';
import { AppDispatch } from '../store';

// Add type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

const API_URL = 'http://localhost:8000/api/v1/process';

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, open]);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setChatHistory((prev) => [...prev, { sender: 'user', text: inputText }]);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({ text: inputText }),
      });
      if (!response.ok) throw new Error('API error');
      const text = await response.text();
      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', text: text },
      ]);
      dispatch(silentFetchLoans());
      dispatch(silentFetchUsers());
    } catch (err: any) {
      setError('Failed to get response.');
      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleSend();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setError('Failed to start voice recognition. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Fade in={!open}>
        <Fab
          color="primary"
          aria-label="Open chatbot"
          onClick={handleToggle}
          sx={{ boxShadow: 6 }}
        >
          <ChatIcon />
        </Fab>
      </Fade>
      <Fade in={open}>
        <Paper
          elevation={8}
          sx={{
            width: 600,
            height: 700,
            p: 0,
            display: open ? 'flex' : 'none',
            flexDirection: 'column',
            position: 'relative',
            mt: 2,
          }}
          aria-label="Chatbot window"
        >
          <Box
            sx={{
              p: 2,
              pb: 1,
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6">Chatbot</Typography>
            <IconButton aria-label="Close chatbot" onClick={handleToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 2,
              py: 1,
              bgcolor: '#fafbfc',
            }}
            tabIndex={0}
            aria-label="Chat history"
          >
            {chatHistory.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Ask me anything about loan users or transfers! You can type or use voice input.
              </Typography>
            )}
            {chatHistory.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.200',
                    color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: '80%',
                    fontSize: 15,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    fontFamily: msg.sender === 'bot' ? 'monospace' : 'inherit',
                  }}
                >
                  {msg.sender === 'bot' ? <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</pre> : msg.text}
                </Box>
              </Box>
            ))}
            <div ref={chatEndRef} />
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, gap: 1 }}>
            <TextField
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening... Speak now" : "Type your message or use voice input..."}
              size="small"
              fullWidth
              aria-label="Type your message"
              disabled={loading}
              autoFocus={open}
              sx={{
                '& .MuiInputBase-root': {
                  transition: 'all 0.3s ease',
                  ...(isListening && {
                    backgroundColor: 'rgba(255, 0, 0, 0.05)',
                    borderColor: 'error.main',
                  }),
                },
              }}
            />
            <Tooltip title={isListening ? "Stop listening" : "Start voice input"}>
              <IconButton
                color={isListening ? 'error' : 'primary'}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                onClick={toggleListening}
                disabled={loading}
                sx={{
                  transition: 'all 0.3s ease',
                  ...(isListening && {
                    animation: 'pulse 1.5s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        transform: 'scale(1)',
                      },
                      '50%': {
                        transform: 'scale(1.1)',
                      },
                      '100%': {
                        transform: 'scale(1)',
                      },
                    },
                  }),
                }}
              >
                {isListening ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>
            <IconButton
              color="primary"
              aria-label="Send message"
              onClick={handleSend}
              disabled={loading || !inputText.trim()}
            >
              {loading ? <CircularProgress size={22} /> : <SendIcon />}
            </IconButton>
          </Box>
          {error && (
            <Typography color="error" variant="caption" sx={{ px: 2, pb: 1 }}>
              {error}
            </Typography>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};

export default ChatbotWidget; 