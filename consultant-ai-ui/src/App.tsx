import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  IconButton,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Fade,
  Grow,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// Material Design 3 inspired theme with light green background and accents
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#4caf50',
    },
    secondary: {
      main: '#66bb6a',
    },
    background: {
      default: '#f8fff8',
      paper: 'transparent',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'transparent',
        },
      },
    },
  },
});

interface TableData {
  headers: string[];
  rows: string[][];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  table?: TableData;
  isTyping?: boolean;
}

// API Configuration (dummy endpoints for now)
// const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome! Here is a sample data overview:',
      table: {
        headers: ['Category', 'Status', 'Priority', 'Progress'],
        rows: [
          ['Analytics', 'Active', 'High', '85%'],
          ['Reports', 'Pending', 'Medium', '60%'],
          ['Dashboard', 'Complete', 'High', '100%'],
          ['API Integration', 'In Progress', 'Low', '45%'],
        ],
      },
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Dummy API call - POST message
  const sendMessageToAPI = async (message: string): Promise<void> => {
    await sleep(500);
    console.log('POST to API:', message);
  };

  // Dummy API call - GET response (returns table data)
  const fetchResponseFromAPI = async (): Promise<{ content: string; table?: TableData }> => {
    await sleep(1500);
    
    // Default table response
    const tableResponse = {
      content: "Here's the data analysis you requested:",
      table: {
        headers: ['Metric', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Growth'],
        rows: [
          ['Revenue', '$125,000', '$142,000', '$168,000', '+34%'],
          ['Users', '12,500', '15,800', '19,200', '+54%'],
          ['Engagement', '78%', '82%', '87%', '+12%'],
          ['Satisfaction', '4.2/5', '4.5/5', '4.7/5', '+12%'],
        ],
      },
    };
    
    console.log('GET from API:', tableResponse);
    return tableResponse;
  };

  // Typing animation effect
  const addMessageWithTyping = async (content: string, table?: TableData) => {
    setIsTyping(true);
    const tempMessage: Message = { role: 'assistant', content: '', table, isTyping: true };
    setMessages((prev) => [...prev, tempMessage]);

    for (let i = 0; i <= content.length; i++) {
      await sleep(20);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: content.slice(0, i),
          table,
          isTyping: i < content.length,
        };
        return newMessages;
      });
    }
    setIsTyping(false);
  };

  const handleSend = async () => {
    const message = input.trim();
    if (!message || isLoading || isTyping) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setInput('');
    setIsLoading(true);

    try {
      // Call POST API
      await sendMessageToAPI(message);

      // Call GET API
      const response = await fetchResponseFromAPI();

      setIsLoading(false);

      // Add assistant message with typing effect
      await addMessageWithTyping(response.content, response.table);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    }

    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 3 }}>
          {/* Header with Logo */}
          <Box
            sx={{
              p: 3,
              mb: 3,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src="/image.png"
              alt="Consult AI Logo"
              style={{ maxWidth: '300px', height: 'auto' }}
            />
          </Box>

          {/* Messages Container */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message, index) => (
              <Grow key={index} in={true} timeout={400}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  {message.role === 'assistant' && (
                    <Box
                      sx={{
                        fontSize: '32px',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      😊
                    </Box>
                  )}

                  <Box sx={{ maxWidth: '75%', flex: 1 }}>
                    {message.role === 'user' ? (
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: 'transparent',
                          color: 'text.primary',
                          borderRadius: 0,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            lineHeight: 1.6,
                          }}
                        >
                          {message.content}
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            lineHeight: 1.6,
                            mb: message.table ? 2 : 0,
                          }}
                        >
                          {message.content}
                          {message.isTyping && (
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-block',
                                width: '3px',
                                height: '1em',
                                bgcolor: 'text.primary',
                                ml: 0.5,
                                animation: 'blink 1s infinite',
                                '@keyframes blink': {
                                  '0%, 49%': { opacity: 1 },
                                  '50%, 100%': { opacity: 0 },
                                },
                              }}
                            />
                          )}
                        </Typography>
                        
                        {message.table && !message.isTyping && (
                          <Fade in={true} timeout={500}>
                            <TableContainer 
                              sx={{ 
                                mt: 2,
                                bgcolor: 'transparent',
                                border: '2px transparent',
                                borderTop: '1px solid',
                                borderLeft: '1px solid',
                                borderRight: '1px solid',
                                borderBottom: '1px solid',
                                borderColor: 'primary.main',
                                borderRadius: 2,
                              }}
                            >
                              <Table>
                                <TableHead>
                                  <TableRow sx={{ bgcolor: 'transparent' }}>
                                    {message.table?.headers.map((header, idx) => (
                                      <TableCell
                                        key={idx}
                                        sx={{
                                          fontWeight: 'bold',
                                          color: 'text.primary',
                                          fontSize: '0.95rem',
                                          bgcolor: 'transparent',
                                          borderBottom: '1px solid',
                                          borderRight: idx < (message.table?.headers.length || 0) - 1 ? '1px solid' : 'none',
                                          borderColor: 'primary.main',
                                        }}
                                      >
                                        {header}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {message.table?.rows.map((row, rowIdx) => (
                                    <TableRow
                                      key={rowIdx}
                                      sx={{
                                        bgcolor: 'transparent',
                                      }}
                                    >
                                      {row.map((cell, cellIdx) => (
                                        <TableCell 
                                          key={cellIdx}
                                          sx={{
                                            bgcolor: 'transparent',
                                            borderBottom: rowIdx < (message.table?.rows.length || 0) - 1 ? '1px solid' : 'none',
                                            borderRight: cellIdx < row.length - 1 ? '1px solid' : 'none',
                                            borderColor: 'primary.main',
                                          }}
                                        >
                                          {cell}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Fade>
                        )}
                      </Box>
                    )}
                  </Box>

                  {message.role === 'user' && (
                    <Box
                      sx={{
                        fontSize: '32px',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      😄
                    </Box>
                  )}
                </Box>
              </Grow>
            ))}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input Container */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-end',
              bgcolor: 'transparent',
            }}
          >
            <TextField
              inputRef={inputRef}
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              disabled={isLoading || isTyping}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'transparent',
                  borderRadius: 2,
                  '& fieldset': {
                    border: 'primary.main',
                  },
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isTyping}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': {
                  bgcolor: 'primary.main',
                },
                '&:disabled': {
                  bgcolor: 'action.disabledBackground',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

