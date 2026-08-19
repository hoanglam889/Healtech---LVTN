import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import apiClient from '../../services/apiClient';

export default function FloatingAIAssistant({ isChatOpen, setIsChatOpen }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_chat_history');
      return saved ? JSON.parse(saved) : [{ role: 'ai', text: 'Chào bạn! Mình là Trợ lý AI của Healtech. Bạn đang có triệu chứng gì, hãy kể cho mình nghe để mình tư vấn chuyên khoa phù hợp nhé!' }];
    } catch {
      return [{ role: 'ai', text: 'Chào bạn! Mình là Trợ lý AI của Healtech. Bạn đang có triệu chứng gì, hãy kể cho mình nghe để mình tư vấn chuyên khoa phù hợp nhé!' }];
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('ai_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const toggleChat = () => {
    const newState = !isChatOpen;
    setIsChatOpen(newState);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await apiClient.post('/ai/triage', { symptoms: userMsg }, { timeout: 30000 });
      if (res.data && res.data.suggestions) {
        setMessages(prev => [...prev, { role: 'ai', suggestions: res.data.suggestions }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Xin lỗi, mình không thể xử lý thông tin này lúc này.' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Đã có lỗi xảy ra khi kết nối với máy chủ AI. Vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ đoạn hội thoại này không?')) {
      const defaultMsg = [{ role: 'ai', text: 'Chào bạn! Mình là Trợ lý AI của Healtech. Bạn đang có triệu chứng gì, hãy kể cho mình nghe để mình tư vấn chuyên khoa phù hợp nhé!' }];
      setMessages(defaultMsg);
      localStorage.setItem('ai_chat_history', JSON.stringify(defaultMsg));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Nút bấm nổi bật */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce"
        >
          <Icons.Bot className="w-8 h-8" />
        </button>
      )}

      {/* Panel Chat */}
      <div 
        className={`fixed bottom-24 right-4 sm:right-6 h-[500px] max-h-[80vh] w-[350px] max-w-[90vw] bg-white shadow-2xl rounded-2xl z-50 transition-all duration-300 ease-in-out border border-gray-100 flex flex-col overflow-hidden origin-bottom-right ${
          isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Icons.Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">AI Triage</h3>
              <p className="text-[10px] text-blue-100">Tư vấn chọn chuyên khoa</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleClearHistory} 
              title="Xóa lịch sử trò chuyện"
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-blue-100 hover:text-white"
            >
              <Icons.Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={toggleChat} 
              title="Đóng cửa sổ"
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nội dung chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 shadow-sm rounded-bl-sm text-gray-800'}`}>
                {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                
                {/* Render danh sách gợi ý chuyên khoa từ AI */}
                {msg.suggestions && (
                  <div className="space-y-2 mt-2">
                    <p className="text-xs font-bold text-gray-800 mb-2">Gợi ý dành cho bạn:</p>
                    {msg.suggestions.map((s, i) => (
                      <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg p-2.5">
                        <div className="flex justify-between items-start mb-1.5">
                          <h4 className="font-bold text-sm text-blue-800 flex items-center gap-1">
                            {s.specialty_name}
                          </h4>
                          <span className="text-[10px] font-bold bg-white text-emerald-600 px-1.5 py-0.5 rounded shadow-sm border border-emerald-100">
                            {s.confidence}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{s.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm p-3 flex gap-1 items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Khung nhập text */}
        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1 pr-1.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập triệu chứng..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-700 transition-colors"
            >
              <Icons.Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
