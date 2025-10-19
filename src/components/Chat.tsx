"use client";

import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  id: string;
  channel_id: string;
  user_id: string;
  user_name: string;
  message: string;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  created_at: string;
}

interface ChatProps {
  customerId?: string;
  channelId?: string;
}

export default function ChatComponent({ customerId, channelId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWorkerUrl = process.env.NEXT_PUBLIC_CHAT_WORKER_URL || 'https://chat-worker.smnshzh.workers.dev';

  useEffect(() => {
    if (channelId) {
      loadMessages(channelId);
      // Polling برای دریافت پیام‌های جدید
      const interval = setInterval(() => {
        loadMessages(channelId);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async (channelId: string) => {
    try {
      const response = await fetch(`${chatWorkerUrl}/api/chat/messages?channel_id=${channelId}&limit=50`);
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !channelId) return;

    try {
      const response = await fetch(`${chatWorkerUrl}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel_id: channelId,
          user_id: 'current-user-id',
          message: newMessage.trim(),
          message_type: 'text',
        }),
      });

      if (response.ok) {
        setNewMessage("");
        // بارگذاری مجدد پیام‌ها
        await loadMessages(channelId);
      } else {
        setError('خطا در ارسال پیام');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('خطا در ارسال پیام');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-medium text-gray-900">کانال چت</h3>
          <p className="text-sm text-gray-500">چت زنده</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            هنوز پیامی ارسال نشده است
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.user_id === 'current-user-id' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.user_id === 'current-user-id'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {message.user_name}
                </div>
                <div className="text-sm">{message.message}</div>
                <div className={`text-xs mt-1 ${
                  message.user_id === 'current-user-id' ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString('fa-IR')}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2 space-x-reverse">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ارسال
          </button>
        </div>
      </div>
    </div>
  );
}