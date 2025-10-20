"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authMethod, setAuthMethod] = useState<'email' | 'telegram'>('email');
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("رمز عبور و تکرار آن مطابقت ندارند");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      setIsLoading(false);
      return;
    }

    try {
      // Simple mock registration
      if (formData.email && formData.password && formData.name && formData.phone) {
        // Simulate successful registration
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setError("لطفاً تمام فیلدها را پر کنید");
      }
    } catch (err) {
      setError("خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🏪</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ایجاد حساب کاربری
          </h2>
          <p className="text-gray-600">
            یا{" "}
            <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              وارد حساب کاربری خود شوید
            </Link>
          </p>
        </div>

        {/* Auth Method Selector */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              authMethod === 'email'
                ? 'bg-white text-gray-900 shadow-sm transform scale-105'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ایمیل
          </button>
          <button
            onClick={() => setAuthMethod('telegram')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              authMethod === 'telegram'
                ? 'bg-white text-gray-900 shadow-sm transform scale-105'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            تلگرام
          </button>
        </div>

        {/* Email Registration Form */}
        {authMethod === 'email' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  نام و نام خانوادگی *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="نام کامل خود را وارد کنید"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  شماره تلفن *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="09123456789"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  آدرس ایمیل *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  رمز عبور *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="حداقل ۶ کاراکتر"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  تکرار رمز عبور *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="رمز عبور را دوباره وارد کنید"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    در حال ثبت‌نام...
                  </div>
                ) : (
                  "ایجاد حساب کاربری"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Telegram Registration */}
        {authMethod === 'telegram' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ثبت‌نام از طریق تلگرام
              </h3>
              <p className="text-gray-600 text-sm">
                کد احراز هویت به تلگرام شما ارسال خواهد شد
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="telegramPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  شماره تلفن تلگرام
                </label>
                <input
                  type="tel"
                  id="telegramPhone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="09123456789"
                />
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                ارسال کد احراز هویت
              </button>
            </div>
          </div>
        )}

        {/* Terms and Privacy */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            با ایجاد حساب کاربری، شما با{" "}
            <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
              شرایط استفاده
            </Link>{" "}
            و{" "}
            <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
              حریم خصوصی
            </Link>{" "}
            موافقت می‌کنید
          </p>
        </div>
      </div>
    </div>
  );
}