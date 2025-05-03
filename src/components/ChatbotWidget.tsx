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
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch } from 'react-redux';
import { silentFetchLoans } from '../store/slices/loanSlice';
import { silentFetchUsers } from '../store/slices/userSlice';

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
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, open]);

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
          accept: 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', text: JSON.stringify(data, null, 2) },
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
                Ask me anything about loan users or transfers!
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
              placeholder="Type your message..."
              size="small"
              fullWidth
              aria-label="Type your message"
              disabled={loading}
              autoFocus={open}
            />
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