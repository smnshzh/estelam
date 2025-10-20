"use client";

import { useState } from "react";

interface TelegramAuthProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
}

export default function TelegramAuth({ onSuccess, onError }: TelegramAuthProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);

  const startTimer = (duration: number) => {
    setTimer(duration);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      onError("لطفاً شماره تلفن خود را وارد کنید");
      return;
    }

    setIsLoading(true);
    setMessage("");
    onError("");

    try {
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_code',
          phoneNumber: phoneNumber.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("کد احراز هویت به تلگرام شما ارسال شد");
        setStep('code');
        startTimer(300); // 5 minutes
      } else {
        onError(data.message || "خطا در ارسال کد");
      }
    } catch (error) {
      onError("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      onError("لطفاً کد احراز هویت را وارد کنید");
      return;
    }

    setIsLoading(true);
    setMessage("");
    onError("");

    try {
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify_code',
          code: verificationCode.trim(),
          phoneNumber: phoneNumber.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("احراز هویت موفقیت‌آمیز بود");
        onSuccess(data.user);
      } else {
        onError(data.message || "کد احراز هویت نامعتبر است");
      }
    } catch (error) {
      onError("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    setStep('phone');
    setVerificationCode("");
    setMessage("");
    setTimer(0);
  };

  return (
    <div className="space-y-6">
      {step === 'phone' && (
        <>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ورود از طریق تلگرام
            </h3>
            <p className="text-gray-600 text-sm">
              کد احراز هویت به تلگرام شما ارسال خواهد شد
            </p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              شماره تلفن تلگرام
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="09123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSendCode}
            disabled={isLoading || !phoneNumber.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                در حال ارسال...
              </div>
            ) : (
              "ارسال کد احراز هویت"
            )}
          </button>
        </>
      )}

      {step === 'code' && (
        <>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              تایید کد احراز هویت
            </h3>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              کد احراز هویت
            </label>
            <input
              type="text"
              id="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="------"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest"
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || !verificationCode.trim() || timer === 0}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  در حال تایید...
                </div>
              ) : timer > 0 ? (
                `تایید کد (${timer}s)`
              ) : (
                "تایید کد"
              )}
            </button>
            
            <button
              onClick={handleResendCode}
              disabled={isLoading}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ارسال مجدد
            </button>
          </div>
        </>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500">
          با ادامه فرآیند، شما با قوانین و مقررات موافقت می‌کنید
        </p>
      </div>
    </div>
  );
}