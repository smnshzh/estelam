export default function ChatPage() {
  return (
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
                href="/" 
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                خانه
              </a>
              <a 
                href="/customers" 
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                مشتریان
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">سیستم چت</h2>
            <p className="text-gray-600 mb-6">
              سیستم چت زنده با استفاده از Cloudflare Workers
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                Worker چت در آدرس زیر در دسترس است:
              </p>
              <p className="text-blue-600 font-mono mt-2">
                https://chat-worker.smnshzh.workers.dev
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}