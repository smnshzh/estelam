"use client";

import { useState } from "react";
import Link from "next/link";

export default function Alerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "فروش ویژه آخر هفته",
      description: "تخفیف ۲۰٪ روی تمام محصولات",
      type: "sale",
      date: "2024-01-15",
      seller: "فروشگاه نمونه"
    },
    {
      id: 2,
      title: "تعطیلی موقت",
      description: "فروشگاه تا فردا تعطیل است",
      type: "closure",
      date: "2024-01-14",
      seller: "مغازه مرکزی"
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    title: "",
    description: "",
    type: "general"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAlert.title && newAlert.description) {
      const alert = {
        id: alerts.length + 1,
        ...newAlert,
        date: new Date().toISOString().split('T')[0],
        seller: "فروشنده شما"
      };
      setAlerts([alert, ...alerts]);
      setNewAlert({ title: "", description: "", type: "general" });
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "sale":
        return (
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
          </svg>
        );
      case "closure":
        return (
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">هشدارها و اطلاع‌رسانی</h1>
            </div>
            <nav className="flex space-x-8 space-x-reverse">
              <Link 
                href="/dashboard" 
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                دشبورد
              </Link>
              <Link 
                href="/map" 
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                نقشه
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Alert Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">ایجاد هشدار جدید</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                عنوان هشدار
              </label>
              <input
                type="text"
                id="title"
                value={newAlert.title}
                onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="عنوان هشدار را وارد کنید"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                توضیحات
              </label>
              <textarea
                id="description"
                rows={3}
                value={newAlert.description}
                onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="توضیحات هشدار را وارد کنید"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                نوع هشدار
              </label>
              <select
                id="type"
                value={newAlert.type}
                onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="general">عمومی</option>
                <option value="sale">فروش ویژه</option>
                <option value="closure">تعطیلی</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ایجاد هشدار
            </button>
          </form>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">هشدارهای فعال</h2>
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{alert.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{alert.description}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-400">
                    <span>{alert.seller}</span>
                    <span className="mx-2">•</span>
                    <span>{alert.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}