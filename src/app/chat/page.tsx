"use client";

import { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { StreamChat } from "stream-chat";
import { Chat, Channel, ChannelList, MessageList, MessageInput, ChannelHeader } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

export default function ChatPage() {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initChat = async () => {
      try {
        const client = StreamChat.getInstance(
          process.env.NEXT_PUBLIC_STREAM_API_KEY || "your-api-key",
          {
            enableInsights: true,
            enableWSFallback: true,
          }
        );

        // In a real app, you would get the user token from your backend
        const userToken = "your-user-token"; // This should come from your auth system
        const userId = "current-user-id"; // This should come from your auth system

        await client.connectUser(
          {
            id: userId,
            name: "کاربر",
            image: "https://via.placeholder.com/150",
          },
          userToken
        );

        setChatClient(client);
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
          setIsLoading(false);
      }
    };

    initChat();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <SessionAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">در حال بارگذاری چت...</div>
        </div>
      </SessionAuth>
    );
  }

  if (!chatClient) {
    return (
      <SessionAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-red-500">خطا در بارگذاری چت</div>
        </div>
      </SessionAuth>
    );
  }

  return (
    <SessionAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">چت زنده</h1>
              </div>
              <nav className="flex space-x-8 space-x-reverse">
                <a 
                  href="/dashboard" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  دشبورد
                </a>
                <a 
                  href="/sellers" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  فروشندگان
                </a>
                <a 
                  href="/map" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  نقشه
                </a>
                <a 
                  href="/chat" 
                  className="text-indigo-600 hover:text-indigo-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  چت
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Chat Interface */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow h-[600px]">
              <Chat client={chatClient} theme="str-chat__theme-light">
                <div className="flex h-full">
                  {/* Channel List */}
                  <div className="w-1/3 border-l border-gray-200">
                    <ChannelList
                      filters={{
                        type: "messaging",
                        members: { $in: [chatClient.userID || ""] }
                      }}
                      sort={{ last_message_at: -1 }}
                      showChannelSearch
                      additionalChannelSearchProps={{
                        searchForChannels: true,
                        searchQueryParams: {
                          channelFilters: {
                            filters: { members: { $in: [chatClient.userID || ""] } },
                            sort: { last_message_at: -1 }
                          }
                        }
                      }}
                    />
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 flex flex-col">
                    <Channel>
                      <ChannelHeader />
                      <MessageList />
                      <MessageInput />
                    </Channel>
                  </div>
                </div>
              </Chat>
            </div>

            {/* Chat Instructions */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                راهنمای استفاده از چت
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• برای شروع گفتگو، روی یکی از کانال‌ها کلیک کنید</li>
                <li>• می‌توانید فایل و تصویر ارسال کنید</li>
                <li>• برای ایجاد کانال جدید، روی دکمه + کلیک کنید</li>
                <li>• تمام مکالمات ذخیره می‌شوند و قابل جستجو هستند</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </SessionAuth>
  );
}
