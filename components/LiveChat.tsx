import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles, User as UserIcon, Minimize2, Trash2, Package, ShoppingBag, Truck, RotateCcw, Mail } from 'lucide-react';
import { sendChatMessage, resetChat, ChatContext } from '../services/chatAI';
import { User, CartItem } from '../types';

// ─── Notification sound (tiny base64-encoded ding) ───
const NOTIFY_SOUND = 'data:audio/wav;base64,UklGRl4FAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToFAAB4eHh3d3d2dnZ2dnZ3d3d4eHl5enp6e3t7e3t7e3t7enp5eXh4eHd3d3Z2dnZ2d3d4eHl5enp7e3x8fHx8fHx8e3t6enl5eHh3d3d2djBwcHBwkJCgoKCglpaGhoZ2dpamoKCgoJCGdnZ2hpagkJaWloaGdnZ2doaGoKCgoJaWhoaGdnaGhqCgoKCWloaGhnZ2dnaGoKCgkJaWlpaGhnZ2hqCgoJCWlpaWhoZ2dnaGpqCgkJaWlpaWhnZ2doagkJCWlpaWloaGdnaGoKCQkJaWlpaGhnZ2hqCgkJCWlpaWhoZ2dnaGoKCQlpaWlpaGhnZ2hqCgkJCWlpaWhoaGdnaGoKCQlpaWlpaGhnZ2hqCgkJaWlpaWhoaGdnaGoKCQkJaWlpaGhoZ2doagoJCQlpaWloaGhnZ2hqCgkJCWlpaWhoaGdnaGoKCQkJaWlpaGhoZ2doagkJCQlpaWloaGhnZ2doagkJCQlpaWloaGdnZ2hqCQkJCWlpaWhoZ2dnZ2oJCQkJaWlpaGhnZ2dnagkJCQlpaWlpaGdnZ2dqCQkJCWlpaWhoaGdnZ2oJCQkJaGlpaWhoZ2dnaQkJCQloaWlpaGhnZ2dpCQkJCWlpaWloaGdnZ2kJCQkJaWlpaWhoZ2dnagkJCQlpaWlpaGdnZ2dpCQkJCWlpaWloaGdnZ2kJCQkJaWlpaWhoZ2dnaQkJCQlpaWlpaGhnZ2dpCQkJCWlpaWloaGdnZ2kJCQkJaWlpaWhoZ2dnaQoJCQlpaWlpaGhnZ2dpCQkJCWlpaWloaGdnZ2kKCQkJaWlpaWhoZ2dnaQoJCQlpaWlpaGhnZ2dpCgkJCWlpaWloaGdnZ2kKCQkJaWlpaWhoZ2dnaQoJCQlpaWlpaGhnZ2dpCgkJCWlpaWloaGdnZ2kKCQkJaWlpaWhoaGdnaQoJCQlpaWlpaGhnZ2dpCgkJCWlpaWlpaGdnZ2kKCQkJaWlpaWhoaGdnaQoJCQlpaWlpaWhnZ2dpCgkJCWlpaWlpaGhnZ2kKCQkJaWlpaWloaGdnaQoJCQlpaWlpaWhoZ2dpCgkJCWlpaWlpaGhnZ2kKCQkJaWlpaWloaGdnaQoJCQlpaWlpaWhoZ2dpCgkJCWlpaWlpaGhnZ2kKCQlpaWlpaWhoaGdnaQoJCQlpaWlpaWhoZ2dpCgkJCWlpaWlpaGhnZ2kKCQlpaWlpaWhoaGdnag==';

let audioInstance: HTMLAudioElement | null = null;
function playNotifySound() {
  try {
    if (!audioInstance) audioInstance = new Audio(NOTIFY_SOUND);
    audioInstance.currentTime = 0;
    audioInstance.volume = 0.3;
    audioInstance.play().catch(() => {});
  } catch { /* audio not supported */ }
}

// ─── Types ───
interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  time: string;
}

interface LiveChatProps {
  user?: User | null;
  cart?: CartItem[];
}

// ─── Quick action chips ───
const QUICK_ACTIONS = [
  { icon: '📦', label: 'Track Order', message: 'How can I track my order?' },
  { icon: '🛍️', label: 'Products', message: 'What products do you sell?' },
  { icon: '🚚', label: 'Shipping', message: 'What is your shipping policy?' },
  { icon: '💰', label: 'Returns', message: 'What is your return policy?' },
  { icon: '📧', label: 'Contact', message: 'How can I contact support?' },
];

// ─── Markdown-lite renderer ───
function renderBotText(text: string) {
  // Split by newlines, then handle bold **text** within each line
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={i}>
        {i > 0 && <br />}
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        })}
      </span>
    );
  });
}

// ─── Storage helpers ───
const MESSAGES_KEY = 'os_livechat';
const welcomeMessage: Message = {
  id: '1',
  text: "Hi there! 👋 I'm your AI shopping assistant powered by Gemini. Ask me anything about our products, orders, shipping, or policies!",
  sender: 'bot',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

function loadMessages(): Message[] {
  try {
    const saved = localStorage.getItem(MESSAGES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return [welcomeMessage];
}

function saveMessages(messages: Message[]) {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch { /* ignore */ }
}

// ─── Component ───
const LiveChat: React.FC<LiveChatProps> = ({ user, cart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [showSuggestions, setShowSuggestions] = useState(() => {
    const saved = loadMessages();
    // Show suggestions only if there's just the welcome message
    return saved.length <= 1;
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpenRef = useRef(isOpen);

  // Keep ref in sync
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Persist messages on change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping, scrollToBottom]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Build context from props
  const chatContext = useMemo<ChatContext | undefined>(() => {
    if (!user && (!cart || cart.length === 0)) return undefined;
    return {
      userName: user?.name,
      isLoggedIn: !!user,
      cartItems: cart?.length ?? 0,
      cartTotal: cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0,
      cartProductNames: cart?.map(item => item.name) ?? [],
    };
  }, [user, cart]);

  const addBotMessage = useCallback((text: string) => {
    const botReply: Message = {
      id: (Date.now() + 1).toString(),
      text,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, botReply]);
    playNotifySound();
    if (!isOpenRef.current) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const handleSend = useCallback(async (overrideText?: string) => {
    const text = (overrideText || input).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowSuggestions(false);
    setIsTyping(true);

    try {
      const aiReply = await sendChatMessage(text, chatContext);
      addBotMessage(aiReply);
    } catch {
      addBotMessage('Sorry, I encountered an error. Please try again or email us at onlinestore7188@gmail.com for help!');
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, chatContext, addBotMessage]);

  const handleClearChat = useCallback(() => {
    resetChat();
    setMessages([{ ...welcomeMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setShowSuggestions(true);
    setUnreadCount(0);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  }, [handleSend]);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-slate-900/95 backdrop-blur-xl w-[calc(100vw-2rem)] sm:w-[380px] h-[calc(100vh-6rem)] sm:h-[520px] rounded-2xl shadow-2xl shadow-black/30 flex flex-col overflow-hidden mb-3 border border-slate-700/50 max-w-[380px]"
          >
            {/* ─── Header ─── */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-3.5 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 border-2 border-purple-600"></span>
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">AI Assistant</h3>
                  <p className="text-[10px] text-purple-200 uppercase tracking-wider font-medium">Powered by Gemini</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={handleClearChat} title="Clear chat" className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
                <button onClick={() => setIsOpen(false)} title="Minimize" className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                  <Minimize2 size={14} />
                </button>
              </div>
            </div>

            {/* ─── Chat Body ─── */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Bot avatar */}
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-purple-500/20">
                      <Sparkles size={13} className="text-white" />
                    </div>
                  )}
                  <div className={`flex flex-col max-w-[78%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-sm shadow-lg shadow-indigo-600/20'
                          : 'bg-slate-800 text-slate-200 rounded-bl-sm shadow-lg shadow-black/10 border border-slate-700/50'
                      }`}
                    >
                      {msg.sender === 'bot' ? renderBotText(msg.text) : <p>{msg.text}</p>}
                    </div>
                    <span className="text-[9px] uppercase font-medium text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                  {/* User avatar */}
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-indigo-600/20">
                      <UserIcon size={13} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Quick action chips */}
              {showSuggestions && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-1.5 pt-1"
                >
                  {QUICK_ACTIONS.map((action) => (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSend(action.message)}
                      className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 rounded-full px-3 py-1.5 text-[11px] font-medium hover:bg-indigo-500/25 hover:border-indigo-400/40 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 justify-start"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={13} className="text-white animate-pulse" />
                  </div>
                  <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex space-x-1.5 items-center">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ─── Input Area ─── */}
            <div className="p-3 bg-slate-900 border-t border-slate-700/50 shrink-0">
              <div className="flex items-center bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500/50 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={isTyping ? 'AI is thinking...' : 'Ask me anything...'}
                  className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className={`ml-2 p-2 rounded-lg flex items-center justify-center transition-all ${
                    input.trim() && !isTyping
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 active:scale-95'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-[9px] text-slate-600 mt-1.5 text-center font-medium">AI can make mistakes. Verify important info.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Toggle Button ─── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-4 rounded-2xl shadow-xl shadow-indigo-600/40 flex items-center justify-center transition-all"
          >
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/50 ring-2 ring-slate-900"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
            <MessageCircle size={26} />
            {unreadCount > 0 && (
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-2xl border-2 border-indigo-400/50"
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveChat;