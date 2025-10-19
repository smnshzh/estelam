import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">پلتفرم استعلام اعتبار مشتریان</h1>
            </div>
            <nav className="flex space-x-8 space-x-reverse">
              <Link 
                href="/customers" 
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                مشتریان
              </Link>
              <Link 
                href="/chat" 
                className="text-indigo-600 hover:text-indigo-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                چت
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              خوش آمدید به پلتفرم استعلام اعتبار مشتریان
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              پلتفرم مبتنی بر نقشه برای فروشندگان و نمایندگان شرکت‌ها
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">مشتریان</h3>
                <p className="text-gray-600 mb-4">
                  مشاهده و مدیریت اطلاعات مشتریان و کسب‌وکارها
                </p>
                <Link 
                  href="/customers"
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  مشاهده مشتریان
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">چت زنده</h3>
                <p className="text-gray-600 mb-4">
                  ارتباط مستقیم با مشتریان از طریق سیستم چت
                </p>
                <Link 
                  href="/chat"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  شروع چت
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">استعلام اعتبار</h3>
                <p className="text-gray-600 mb-4">
                  ارزیابی و استعلام وضعیت اعتباری مشتریان
                </p>
                <button 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  disabled
                >
                  در حال توسعه
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">قابلیت‌های پلتفرم</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-right">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">🎯 مدیریت مشتریان</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• ثبت و مدیریت اطلاعات مشتریان</li>
                    <li>• دسته‌بندی بر اساس نوع کسب‌وکار</li>
                    <li>• ارزیابی اعتبار و ریسک</li>
                    <li>• تاریخچه تعاملات</li>
                  </ul>
                </div>
                
                <div className="text-right">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">💬 ارتباط زنده</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• چت زنده با مشتریان</li>
                    <li>• ارسال فایل و تصویر</li>
                    <li>• تاریخچه مکالمات</li>
                    <li>• اعلان‌های لحظه‌ای</li>
                  </ul>
                </div>
                
                <div className="text-right">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">📍 موقعیت‌یابی</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• نقشه تعاملی</li>
                    <li>• جستجوی جغرافیایی</li>
                    <li>• آدرس‌یابی خودکار</li>
                    <li>• مسیریابی</li>
                  </ul>
                </div>
                
                <div className="text-right">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">📊 گزارش‌گیری</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• آمار و تحلیل‌ها</li>
                    <li>• گزارش‌های اعتباری</li>
                    <li>• نمودارهای تعاملی</li>
                    <li>• خروجی Excel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>پلتفرم استعلام اعتبار مشتریان - نسخه 1.0</p>
            <p className="mt-2">Powered by Cloudflare Workers & D1 Database</p>
          </div>
        </div>
      </footer>
    </div>
  );
}