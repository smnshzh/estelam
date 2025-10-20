"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-white">
                🏪 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">استعلام</span>
              </h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8 space-x-reverse">
              <Link href="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                ویژگی‌ها
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                درباره ما
              </Link>
              <Link href="#contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                تماس
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Link 
              href="/auth/signin" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              ورود
            </Link>
            <Link 
              href="/auth/signup" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105"
            >
              ثبت‌نام
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black bg-opacity-50 rounded-lg mt-4">
              <Link href="#features" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                ویژگی‌ها
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                درباره ما
              </Link>
              <Link href="#contact" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                تماس
              </Link>
              <div className="border-t border-gray-700 pt-4">
                <Link href="/auth/signin" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  ورود
                </Link>
                <Link href="/auth/signup" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white block px-3 py-2 rounded-md text-base font-medium mt-2">
                  ثبت‌نام
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
              پلتفرم
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                مدیریت فروشندگان
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              سیستم جامع مدیریت فروشندگان با قابلیت‌های پیشرفته نظردهی، امتیازدهی و ارتباط زنده
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">شروع کنید</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
              >
                مشاهده دمو
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-500 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">ویژگی‌های کلیدی</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ابزارهای قدرتمند برای مدیریت بهتر فروشندگان و بهبود تجربه کاربری
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">موقعیت‌یابی جغرافیایی</h3>
              <p className="text-gray-600 leading-relaxed">
                مدیریت فروشندگان بر اساس موقعیت جغرافیایی با نقشه‌های تعاملی و جستجوی هوشمند
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">سیستم امتیازدهی</h3>
              <p className="text-gray-600 leading-relaxed">
                نظردهی و امتیازدهی پیشرفته با الگوریتم‌های هوشمند وزندهی و تحلیل دقیق
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">چت زنده</h3>
              <p className="text-gray-600 leading-relaxed">
                ارتباط زنده بین کاربران با قابلیت ارسال فایل، تصویر و تاریخچه مکالمات
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">تحلیل و گزارش</h3>
              <p className="text-gray-600 leading-relaxed">
                گزارش‌های جامع و تحلیل‌های پیشرفته برای بهبود عملکرد فروشندگان
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">تایید اعتبار</h3>
              <p className="text-gray-600 leading-relaxed">
                سیستم تایید فروشندگان با مکانیزم جمعی و اعتبارسنجی هوشمند
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">عملکرد سریع</h3>
              <p className="text-gray-600 leading-relaxed">
                استفاده از Cloudflare Edge برای دسترسی سریع و عملکرد بهینه در سراسر جهان
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">۱۰۰۰+</div>
              <div className="text-blue-200">فروشنده فعال</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">۵۰,۰۰۰+</div>
              <div className="text-blue-200">نظر کاربران</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">۹۹.۹٪</div>
              <div className="text-blue-200">زمان فعالیت</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">۲۴/۷</div>
              <div className="text-blue-200">پشتیبانی</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">آماده شروع هستید؟</h2>
          <p className="text-xl text-gray-300 mb-8">
            همین حالا به خانواده بزرگ استعلام بپیوندید و تجربه مدیریت فروشندگان را متحول کنید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              شروع رایگان
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              تماس با ما
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">🏪 استعلام</h3>
              <p className="text-gray-400">
                پلتفرم پیشرفته مدیریت فروشندگان با قابلیت‌های مدرن و کاربردی
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">لینک‌های مفید</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">ویژگی‌ها</Link></li>
                <li><Link href="#about" className="text-gray-400 hover:text-white transition-colors">درباره ما</Link></li>
                <li><Link href="#contact" className="text-gray-400 hover:text-white transition-colors">تماس</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">خدمات</h4>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">دشبورد</Link></li>
                <li><Link href="/map" className="text-gray-400 hover:text-white transition-colors">نقشه</Link></li>
                <li><Link href="/alerts" className="text-gray-400 hover:text-white transition-colors">هشدارها</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">تماس</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@estelam.com</li>
                <li>📱 ۰۲۱-۱۲۳۴۵۶۷۸</li>
                <li>📍 تهران، ایران</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; ۲۰۲۴ استعلام. تمام حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}