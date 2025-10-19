"use client";

import { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import Link from "next/link";

interface Seller {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verification_votes: number;
  verification_threshold: number;
  created_at: string;
  user_name?: string;
}

export default function SellerVerification() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [voteReason, setVoteReason] = useState("");
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const fetchPendingSellers = async () => {
    try {
      // This would be replaced with actual API call
      const mockSellers: Seller[] = [
        {
          id: "1",
          user_id: "user-1",
          business_name: "فروشگاه مواد غذایی تازه",
          business_type: "غذایی",
          description: "فروش انواع مواد غذایی تازه و کنسروی",
          address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
          latitude: 35.7219,
          longitude: 51.4076,
          phone: "021-12345678",
          email: "info@freshfood.com",
          website: "https://freshfood.com",
          status: "pending",
          verification_votes: 3,
          verification_threshold: 10,
          created_at: "2024-01-01T10:00:00Z",
          user_name: "احمد محمدی"
        },
        {
          id: "2",
          user_id: "user-2",
          business_name: "کافه کتاب آرام",
          business_type: "کافه",
          description: "کافه‌ای با محیط آرام برای مطالعه و کار",
          address: "تهران، پارک وی، خیابان فرشته",
          latitude: 35.7448,
          longitude: 51.4145,
          phone: "021-87654321",
          email: "info@quietcafe.com",
          status: "pending",
          verification_votes: 7,
          verification_threshold: 10,
          created_at: "2024-01-02T14:00:00Z",
          user_name: "فاطمه احمدی"
        }
      ];
      
      setSellers(mockSellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (sellerId: string, voteType: 'approve' | 'reject') => {
    setIsVoting(true);

    try {
      const response = await fetch("/api/sellers/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seller_id: sellerId,
          voter_id: "current-user-id", // This would come from session
          vote_type: voteType,
          reason: voteReason
        }),
      });

      if (response.ok) {
        setVoteReason("");
        setSelectedSeller(null);
        fetchPendingSellers(); // Refresh the list
      } else {
        alert("خطا در ثبت رای");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("خطا در ثبت رای");
    } finally {
      setIsVoting(false);
    }
  };

  const getStatusColor = (status: Seller['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Seller['status']) => {
    switch (status) {
      case 'approved':
        return 'تایید شده';
      case 'rejected':
        return 'رد شده';
      case 'suspended':
        return 'معلق';
      case 'pending':
        return 'در انتظار تایید';
      default:
        return 'نامشخص';
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
                <h1 className="text-2xl font-bold text-gray-900">تایید فروشندگان</h1>
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
            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                راهنمای تایید فروشندگان
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• برای تایید فروشنده، حداقل ۱۰ رای مثبت یا تایید ادمین لازم است</li>
                <li>• قبل از رای دادن، اطلاعات فروشنده را به دقت بررسی کنید</li>
                <li>• در صورت رد، دلیل مشخصی ارائه دهید</li>
                <li>• فروشندگان تایید شده در نقشه نمایش داده می‌شوند</li>
              </ul>
            </div>

            {/* Sellers List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">فروشندگان در انتظار تایید</h3>
              {sellers.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">هیچ فروشنده‌ای در انتظار تایید نیست</p>
                </div>
              ) : (
                sellers.map((seller) => (
                  <div key={seller.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">{seller.business_name}</h4>
                        <p className="text-gray-600">{seller.business_type}</p>
                        <p className="text-sm text-gray-500">ثبت شده توسط: {seller.user_name}</p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(seller.status)}`}>
                          {getStatusLabel(seller.status)}
                        </span>
                        <div className="text-sm text-gray-600">
                          {seller.verification_votes}/{seller.verification_threshold} رای
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">اطلاعات کسب‌وکار</h5>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">آدرس:</span> {seller.address}
                        </p>
                        {seller.description && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">توضیحات:</span> {seller.description}
                          </p>
                        )}
                        {seller.phone && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">تلفن:</span> {seller.phone}
                          </p>
                        )}
                        {seller.email && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">ایمیل:</span> {seller.email}
                          </p>
                        )}
                        {seller.website && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">وب‌سایت:</span> {seller.website}
                          </p>
                        )}
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">موقعیت جغرافیایی</h5>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">عرض جغرافیایی:</span> {seller.latitude.toFixed(6)}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">طول جغرافیایی:</span> {seller.longitude.toFixed(6)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ثبت شده: {new Date(seller.created_at).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 space-x-reverse">
                      <button
                        onClick={() => setSelectedSeller(seller)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        بررسی و رای دادن
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Vote Modal */}
        {selectedSeller && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  رای دادن برای {selectedSeller.business_name}
                </h3>
                
                <div className="mb-4">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                    دلیل رای (اختیاری)
                  </label>
                  <textarea
                    id="reason"
                    rows={3}
                    value={voteReason}
                    onChange={(e) => setVoteReason(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="دلیل رای خود را بنویسید..."
                  />
                </div>

                <div className="flex justify-end space-x-4 space-x-reverse">
                  <button
                    onClick={() => setSelectedSeller(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={() => handleVote(selectedSeller.id, 'reject')}
                    disabled={isVoting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    رد
                  </button>
                  <button
                    onClick={() => handleVote(selectedSeller.id, 'approve')}
                    disabled={isVoting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    تایید
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SessionAuth>
  );
}
