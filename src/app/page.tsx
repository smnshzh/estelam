"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏪</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                استعلام
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                ویژگی‌ها
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                قیمت‌گذاری
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                تماس
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              <Link 
                href="/auth/signin" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                ورود
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                شروع رایگان
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <div className="px-6 py-4 space-y-4">
              <Link href="#features" className="block text-gray-600 hover:text-gray-900 font-medium">
                ویژگی‌ها
              </Link>
              <Link href="#pricing" className="block text-gray-600 hover:text-gray-900 font-medium">
                قیمت‌گذاری
              </Link>
              <Link href="#contact" className="block text-gray-600 hover:text-gray-900 font-medium">
                تماس
              </Link>
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <Link href="/auth/signin" className="block text-gray-600 hover:text-gray-900 font-medium">
                  ورود
                </Link>
                <Link href="/auth/signup" className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-medium text-center">
                  شروع رایگان
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              🚀 جدیدترین پلتفرم مدیریت فروشندگان
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              مدیریت فروشندگان
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                هوشمند و مدرن
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              با استفاده از هوش مصنوعی و تکنولوژی‌های پیشرفته، فروشندگان خود را بهتر مدیریت کنید
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/auth/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">شروع رایگان</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                مشاهده دمو
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">۱۰۰۰+</div>
                <div className="text-gray-600">فروشنده فعال</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">۵۰,۰۰۰+</div>
                <div className="text-gray-600">نظر کاربران</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">۹۹.۹٪</div>
                <div className="text-gray-600">زمان فعالیت</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">ویژگی‌های پیشرفته</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                ابزارهای قدرتمند و هوشمند برای مدیریت بهتر فروشندگان و بهبود تجربه کاربری
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">موقعیت‌یابی هوشمند</h3>
                <p className="text-gray-600 leading-relaxed">
                  ثبت مغازه‌ها بر اساس موقعیت جغرافیایی با نقشه‌های تعاملی و جستجوی هوشمند
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-100">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">امتیازدهی هوشمند</h3>
                <p className="text-gray-600 leading-relaxed">
                  نظردهی و امتیازدهی پیشرفته با الگوریتم‌های هوشمند وزندهی و تحلیل دقیق
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-green-100">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">چت زنده پیشرفته</h3>
                <p className="text-gray-600 leading-relaxed">
                  ارتباط زنده بین کاربران با قابلیت ارسال فایل، تصویر و تاریخچه مکالمات
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-gradient-to-br from-orange-50 to-red-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">تحلیل و گزارش</h3>
                <p className="text-gray-600 leading-relaxed">
                  گزارش‌های جامع و تحلیل‌های پیشرفته برای بهبود عملکرد فروشندگان
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-gradient-to-br from-indigo-50 to-blue-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-indigo-100">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
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
              <div className="group bg-gradient-to-br from-teal-50 to-cyan-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-teal-100">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
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

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">قیمت‌گذاری شفاف</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                پلن‌های متنوع برای نیازهای مختلف شما
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Basic Plan */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">پایه</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">رایگان</div>
                  <p className="text-gray-600">برای شروع</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    تا ۱۰ فروشنده
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    نقشه پایه
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    پشتیبانی ایمیل
                  </li>
                </ul>
                <Link href="/auth/signup" className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-center block hover:bg-gray-800 transition-colors">
                  شروع کنید
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-3xl p-8 border-2 border-blue-500 hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">محبوب</span>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">حرفه‌ای</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">۹۹,۰۰۰</div>
                  <p className="text-gray-600">تومان در ماه</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    تا ۱۰۰ فروشنده
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    نقشه پیشرفته
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    چت زنده
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    پشتیبانی اولویت‌دار
                  </li>
                </ul>
                <Link href="/auth/signup" className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold text-center block hover:bg-blue-600 transition-colors">
                  انتخاب کنید
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">سازمانی</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">سفارشی</div>
                  <p className="text-gray-600">برای سازمان‌ها</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    فروشندگان نامحدود
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    API کامل
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    پشتیبانی اختصاصی
          </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    سفارشی‌سازی کامل
          </li>
                </ul>
                <Link href="#contact" className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-center block hover:bg-gray-800 transition-colors">
                  تماس بگیرید
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">آماده شروع هستید؟</h2>
            <p className="text-xl text-blue-100 mb-8">
              همین حالا به خانواده بزرگ استعلام بپیوندید و تجربه مدیریت فروشندگان را متحول کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                شروع رایگان
              </Link>
              <Link
                href="#contact"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 space-x-reverse mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🏪</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">استعلام</h3>
        </div>
                <p className="text-gray-400 mb-6">
                  پلتفرم پیشرفته مدیریت فروشندگان با قابلیت‌های مدرن و کاربردی
                </p>
                <div className="flex space-x-4 space-x-reverse">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <span className="text-white">📧</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <span className="text-white">📱</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <span className="text-white">💬</span>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">لینک‌های مفید</h4>
                <ul className="space-y-3">
                  <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">ویژگی‌ها</Link></li>
                  <li><Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">قیمت‌گذاری</Link></li>
                  <li><Link href="#contact" className="text-gray-400 hover:text-white transition-colors">تماس</Link></li>
                  <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">دشبورد</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">خدمات</h4>
                <ul className="space-y-3">
                  <li><Link href="/map" className="text-gray-400 hover:text-white transition-colors">نقشه</Link></li>
                  <li><Link href="/alerts" className="text-gray-400 hover:text-white transition-colors">هشدارها</Link></li>
                  <li><Link href="/chat" className="text-gray-400 hover:text-white transition-colors">چت</Link></li>
                  <li><Link href="/admin" className="text-gray-400 hover:text-white transition-colors">مدیریت</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">تماس</h4>
                <ul className="space-y-3 text-gray-400">
                  <li>📧 info@estelam.com</li>
                  <li>📱 ۰۲۱-۱۲۳۴۵۶۷۸</li>
                  <li>📍 تهران، ایران</li>
                  <li>🕒 ۲۴/۷ پشتیبانی</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; ۲۰۲۴ استعلام. تمام حقوق محفوظ است.</p>
            </div>
          </div>
      </footer>
      </main>
    </div>
  );
}