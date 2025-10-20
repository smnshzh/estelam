"use client";

import { useState, useEffect } from "react";

interface Customer {
  id: string;
  business_name: string;
  business_type: string;
  address: string;
  status: string;
  verification_votes: number;
  verification_threshold: number;
  created_at: string;
}

export default function CustomerVerification() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers?status=pending');
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.customers);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("خطا در دریافت لیست مشتریان");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (customerId: string, voteType: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/customers/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          voteType
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the list
        fetchCustomers();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("خطا در ثبت رای");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            تایید مشتریان
          </h1>
          <p className="text-gray-600">
            مشتریان در انتظار تایید را بررسی کنید و رای خود را ثبت کنید
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {customers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              هیچ مشتری در انتظار تایید نیست
            </h3>
            <p className="text-gray-600">
              تمام مشتریان تایید شده‌اند یا هنوز مشتری جدیدی ثبت نشده است
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {customer.business_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    نوع: {customer.business_type}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    آدرس: {customer.address}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">پیشرفت تایید:</span>
                    <span className="text-sm text-gray-600">
                      {customer.verification_votes}/{customer.verification_threshold}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(customer.verification_votes / customer.verification_threshold) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-3 space-x-reverse">
                  <button
                    onClick={() => handleVote(customer.id, 'approve')}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    تایید
                  </button>
                  <button
                    onClick={() => handleVote(customer.id, 'reject')}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    رد
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    ثبت شده در: {new Date(customer.created_at).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            راهنمای تایید مشتریان:
          </h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• هر مشتری نیاز به تایید ۱۰ کاربر دارد</li>
            <li>• پس از تایید، مشتری فعال شده و سایر کاربران می‌توانند تجربه‌های خود را به اشتراک بگذارند</li>
            <li>• در صورت رد شدن، مشتری از سیستم حذف می‌شود</li>
            <li>• رای شما بر اساس اطلاعات ارائه شده و آدرس کسب‌وکار است</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
