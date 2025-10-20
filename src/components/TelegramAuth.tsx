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

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      onError("لطفاً شماره تلفن خود را وارد کنید");
      return;
    }

    setIsLoading(true);
    setMessage("");

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
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          احراز هویت از طریق تلگرام
        </h3>
        <p className="text-gray-600 text-sm">
          کد احراز هویت به تلگرام شما ارسال خواهد شد
        </p>
      </div>

      {step === 'phone' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              شماره تلفن
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="09123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSendCode}
            disabled={isLoading || !phoneNumber.trim()}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "در حال ارسال..." : "ارسال کد احراز هویت"}
          </button>
        </div>
      )}

      {step === 'code' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              کد احراز هویت
            </label>
            <input
              type="text"
              id="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || !verificationCode.trim()}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "در حال تایید..." : "تایید کد"}
            </button>
            
            <button
              onClick={handleResendCode}
              disabled={isLoading}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ارسال مجدد
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">{message}</p>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500">
          با ادامه فرآیند، شما با قوانین و مقررات موافقت می‌کنید
        </p>
      </div>
    </div>
  );
}
