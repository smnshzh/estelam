"use client";

import { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import Link from "next/link";

interface Alert {
  id: string;
  seller_id: string;
  title: string;
  message: string;
  alert_type: 'special_offer' | 'closure' | 'new_product' | 'event' | 'general';
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  seller_name?: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [alertForm, setAlertForm] = useState({
    title: "",
    message: "",
    alert_type: "general" as Alert['alert_type'],
    start_date: "",
    end_date: "",
    seller_id: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      // This would be replaced with actual API call
      const mockAlerts: Alert[] = [
        {
          id: "1",
          seller_id: "seller-1",
          title: "تخفیف ویژه ۵۰٪",
          message: "تا پایان هفته تمام محصولات با تخفیف ۵۰٪",
          alert_type: "special_offer",
          start_date: "2024-01-01",
          end_date: "2024-01-07",
          is_active: true,
          created_at: "2024-01-01T10:00:00Z",
          seller_name: "فروشگاه مواد غذایی"
        },
        {
          id: "2",
          seller_id: "seller-2",
          title: "تعطیلی موقت",
          message: "به دلیل تعمیرات، فروشگاه تا فردا تعطیل است",
          alert_type: "closure",
          start_date: "2024-01-02",
          end_date: "2024-01-03",
          is_active: true,
          created_at: "2024-01-02T08:00:00Z",
          seller_name: "کافه کتاب"
        }
      ];
      
      setAlerts(mockAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...alertForm,
          seller_id: "current-seller-id", // This would come from session
        }),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setAlertForm({
          title: "",
          message: "",
          alert_type: "general",
          start_date: "",
          end_date: "",
          seller_id: ""
        });
        fetchAlerts(); // Refresh alerts
      } else {
        alert("خطا در ایجاد هشدار");
      }
    } catch (error) {
      console.error("Error creating alert:", error);
      alert("خطا در ایجاد هشدار");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAlertTypeColor = (type: Alert['alert_type']) => {
    switch (type) {
      case 'special_offer':
        return 'bg-red-100 text-red-800';
      case 'closure':
        return 'bg-gray-100 text-gray-800';
      case 'new_product':
        return 'bg-green-100 text-green-800';
      case 'event':
        return 'bg-blue-100 text-blue-800';
      case 'general':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertTypeLabel = (type: Alert['alert_type']) => {
    switch (type) {
      case 'special_offer':
        return 'تخفیف ویژه';
      case 'closure':
        return 'تعطیلی';
      case 'new_product':
        return 'محصول جدید';
      case 'event':
        return 'رویداد';
      case 'general':
        return 'عمومی';
      default:
        return 'عمومی';
    }
  };

  if (loading) {
    return (
      <SessionAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">در حال بارگذاری...</div>
        </div>
      </SessionAuth>
    );
  }

  return (
    <SessionAuth>
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
                <Link 
                  href="/chat" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
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
            {/* Create Alert Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showCreateForm ? "انصراف" : "ایجاد هشدار جدید"}
              </button>
            </div>

            {/* Create Alert Form */}
            {showCreateForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">ایجاد هشدار جدید</h3>
                <form onSubmit={handleCreateAlert} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      عنوان هشدار *
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      value={alertForm.title}
                      onChange={(e) => setAlertForm(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="عنوان هشدار"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      متن هشدار *
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      required
                      value={alertForm.message}
                      onChange={(e) => setAlertForm(prev => ({ ...prev, message: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="متن کامل هشدار"
                    />
                  </div>

                  <div>
                    <label htmlFor="alert_type" className="block text-sm font-medium text-gray-700">
                      نوع هشدار *
                    </label>
                    <select
                      id="alert_type"
                      required
                      value={alertForm.alert_type}
                      onChange={(e) => setAlertForm(prev => ({ ...prev, alert_type: e.target.value as Alert['alert_type'] }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="general">عمومی</option>
                      <option value="special_offer">تخفیف ویژه</option>
                      <option value="closure">تعطیلی</option>
                      <option value="new_product">محصول جدید</option>
                      <option value="event">رویداد</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                        تاریخ شروع
                      </label>
                      <input
                        type="datetime-local"
                        id="start_date"
                        value={alertForm.start_date}
                        onChange={(e) => setAlertForm(prev => ({ ...prev, start_date: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                        تاریخ پایان
                      </label>
                      <input
                        type="datetime-local"
                        id="end_date"
                        value={alertForm.end_date}
                        onChange={(e) => setAlertForm(prev => ({ ...prev, end_date: e.target.value }))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isSubmitting ? "در حال ایجاد..." : "ایجاد هشدار"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Alerts List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">هشدارهای فعال</h3>
              {alerts.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">هیچ هشدار فعالی وجود ندارد</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{alert.title}</h4>
                        <p className="text-sm text-gray-600">{alert.seller_name}</p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAlertTypeColor(alert.alert_type)}`}>
                          {getAlertTypeLabel(alert.alert_type)}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          alert.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.is_active ? 'فعال' : 'غیرفعال'}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{alert.message}</p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div>
                        {alert.start_date && (
                          <span>شروع: {new Date(alert.start_date).toLocaleDateString("fa-IR")}</span>
                        )}
                        {alert.end_date && (
                          <span className="mr-4">پایان: {new Date(alert.end_date).toLocaleDateString("fa-IR")}</span>
                        )}
                      </div>
                      <span>ایجاد شده: {new Date(alert.created_at).toLocaleDateString("fa-IR")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </SessionAuth>
  );
}
