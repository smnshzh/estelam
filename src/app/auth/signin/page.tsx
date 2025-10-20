"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TelegramAuth from "@/components/TelegramAuth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authMethod, setAuthMethod] = useState<'email' | 'telegram'>('email');
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simple mock authentication
      if (email === "admin@test.com" && password === "123456") {
        router.push("/dashboard");
      } else {
        setError("ایمیل یا رمز عبور اشتباه است");
      }
    } catch (err) {
      setError("خطا در ورود. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramSuccess = (user: any) => {
    // Store user data and redirect
    localStorage.setItem('user', JSON.stringify(user));
    router.push("/dashboard");
  };

  const handleTelegramError = (error: string) => {
    setError(error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ورود به پلتفرم استعلام
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            یا{" "}
            <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              حساب کاربری جدید ایجاد کنید
            </Link>
          </p>
        </div>

        {/* Auth Method Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMethod === 'email'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ایمیل
          </button>
          <button
            onClick={() => setAuthMethod('telegram')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMethod === 'telegram'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            تلگرام
          </button>
        </div>

        {/* Email Authentication */}
        {authMethod === 'email' && (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  آدرس ایمیل
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="آدرس ایمیل"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  رمز عبور
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="رمز عبور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? "در حال ورود..." : "ورود"}
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>برای تست: admin@test.com / 123456</p>
            </div>
          </form>
        )}

        {/* Telegram Authentication */}
        {authMethod === 'telegram' && (
          <div className="mt-8">
            <TelegramAuth 
              onSuccess={handleTelegramSuccess}
              onError={handleTelegramError}
            />
            
            {error && (
              <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
