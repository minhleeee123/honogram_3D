import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
}

const AIChat: React.FC<AIChatProps> = ({ messages, onSendMessage, isProcessing }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 flex flex-col items-end pointer-events-none`}>
        
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-14 h-14 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-colors border-2 border-white/20"
      >
        <Cpu className="text-black w-8 h-8" />
      </button>

      {/* Chat Container */}
      <div className={`pointer-events-auto mt-4 w-80 md:w-96 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/50 rounded-lg overflow-hidden flex flex-col shadow-2xl transition-all duration-300 origin-bottom-right
        ${isOpen ? 'opacity-100 scale-100 translate-y-0 h-[500px]' : 'opacity-0 scale-90 translate-y-10 h-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="p-3 bg-slate-800/80 border-b border-cyan-900 flex justify-between items-center">
            <span className="font-mono text-cyan-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                AI ASSISTANT
            </span>
            <span className="text-[10px] text-slate-500">GEMINI POWERED</span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-500 text-sm mt-10">
              <p>Hệ thống sẵn sàng.</p>
              <p className="text-xs mt-2">Thử nói: "Đổi màu sang đỏ" hoặc "Quay nhanh hơn"</p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm border ${
                  msg.role === 'user'
                    ? 'bg-cyan-900/40 border-cyan-700 text-cyan-100'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
           {isProcessing && (
            <div className="flex justify-start">
               <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2">
                 <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
               </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập lệnh..."
            className="flex-1 bg-slate-800 border-none rounded text-white text-sm px-3 py-2 focus:ring-1 focus:ring-cyan-500 outline-none"
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2 rounded transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
