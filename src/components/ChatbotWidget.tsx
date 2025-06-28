import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotWidgetProps {
  className?: string;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your hackathon assistant. I can help you find hackathons, answer questions about events, and provide information about prizes and requirements. What would you like to know? **Caveat:** my metadata filtering capability is still only limited to =, please bear in mind when asking questions. Sample questions could be \n 1. Tell me hackathon from Topcoder ending 1 week from now? \n 2. What do you recommend for people like me who is skilled on Blockchain and Python? \n 3. I want to join a hackathon from DevPost with total prize 10000',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Custom components for ReactMarkdown in chat
  const markdownComponents = {
    h1: ({ children }: any) => <h1 className="text-lg font-bold text-gray-900 mb-2">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-base font-bold text-gray-900 mb-2">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-sm font-bold text-gray-900 mb-1">{children}</h3>,
    p: ({ children }: any) => <p className="text-sm mb-2 leading-relaxed">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc list-inside mb-2 space-y-1 text-sm">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside mb-2 space-y-1 text-sm">{children}</ol>,
    li: ({ children }: any) => <li className="text-sm">{children}</li>,
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
    pre: ({ children }: any) => <pre className="bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
    blockquote: ({ children }: any) => <blockquote className="border-l-2 border-purple-400 pl-2 italic text-sm mb-2">{children}</blockquote>,
    a: ({ href, children }: any) => (
      <a href={href} className="text-blue-600 hover:text-blue-700 underline text-sm" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory: messages.map(m => ({
            role: m.sender,
            content: m.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-[500px] mb-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Hackathon Assistant</h3>
                <p className="text-sm text-white/80">AI-powered help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[380px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-purple-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      {message.sender === 'bot' ? (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                          className="text-sm"
                        >
                          {message.text}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-sm">{message.text}</p>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 text-purple-100 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about hackathons..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors duration-200"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget; 