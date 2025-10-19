"use client";

import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();

  return (
    <SessionAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">دشبورد</h1>
              </div>
              <nav className="flex space-x-8 space-x-reverse">
                <Link 
                  href="/dashboard" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  دشبورد
                </Link>
                <Link 
                  href="/sellers" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  فروشندگان
                </Link>
                <Link 
                  href="/map" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  نقشه
                </Link>
                <button
                  onClick={() => {
                    // Logout logic will be implemented
                    router.push("/auth/signin");
                  }}
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  خروج
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  به دشبورد پلتفرم استعلام خوش آمدید
                </h3>
                <p className="text-gray-500 mb-6">
                  اینجا می‌توانید فروشندگان را مدیریت کنید، نظرات را بررسی کنید و با مشتریان ارتباط برقرار کنید.
                </p>
                <div className="space-x-4 space-x-reverse">
                  <Link
                    href="/sellers/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    ثبت فروشنده جدید
                  </Link>
                  <Link
                    href="/map"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    مشاهده نقشه
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SessionAuth>
  );
}
