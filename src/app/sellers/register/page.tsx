"use client";

import { useState } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import Link from "next/link";
import Map from "@/components/Map";

export default function SellerRegistration() {
  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    latitude: 0,
    longitude: 0
  });
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const businessTypes = [
    "غذایی",
    "پوشاک",
    "الکترونیک",
    "کتاب و لوازم التحریر",
    "خودرو",
    "مواد غذایی",
    "کافه و رستوران",
    "آرایشی و بهداشتی",
    "ورزشی",
    "سایر"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!selectedLocation) {
      setError("لطفاً موقعیت کسب‌وکار خود را روی نقشه انتخاب کنید");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/sellers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          user_id: "current-user-id", // This would come from session
        }),
      });

      if (response.ok) {
        // Redirect to success page or dashboard
        window.location.href = "/dashboard";
      } else {
        const errorData = await response.json();
        setError(errorData.error || "خطا در ثبت اطلاعات");
      }
    } catch (err) {
      setError("خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SessionAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">ثبت فروشنده جدید</h1>
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
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Information */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">اطلاعات کسب‌وکار</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                        نام کسب‌وکار *
                      </label>
                      <input
                        type="text"
                        name="business_name"
                        id="business_name"
                        required
                        value={formData.business_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="نام کسب‌وکار خود را وارد کنید"
                      />
                    </div>

                    <div>
                      <label htmlFor="business_type" className="block text-sm font-medium text-gray-700">
                        نوع کسب‌وکار *
                      </label>
                      <select
                        name="business_type"
                        id="business_type"
                        required
                        value={formData.business_type}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">انتخاب کنید</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        توضیحات
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="توضیحات کوتاهی درباره کسب‌وکار خود بنویسید"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        آدرس *
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="آدرس کامل کسب‌وکار"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">اطلاعات تماس</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        شماره تلفن
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="شماره تلفن کسب‌وکار"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        ایمیل
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="ایمیل کسب‌وکار"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        وب‌سایت
                      </label>
                      <input
                        type="url"
                        name="website"
                        id="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="آدرس وب‌سایت (اختیاری)"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Selection */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">انتخاب موقعیت روی نقشه *</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    روی نقشه کلیک کنید تا موقعیت دقیق کسب‌وکار خود را انتخاب کنید.
                  </p>
                  <div className="h-96">
                    <Map
                      center={[51.3890, 35.6892]}
                      zoom={12}
                      onLocationSelect={handleLocationSelect}
                    />
                  </div>
                  {selectedLocation && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        موقعیت انتخاب شده: عرض جغرافیایی {selectedLocation.lat.toFixed(6)}، 
                        طول جغرافیایی {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-4 space-x-reverse">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    انصراف
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedLocation}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? "در حال ثبت..." : "ثبت فروشنده"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </SessionAuth>
  );
}
