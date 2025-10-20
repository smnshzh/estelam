"use client";

import { useState, useEffect } from "react";

interface Customer {
  id: string;
  business_name: string;
  business_type: string;
  address: string;
  status: string;
}

interface Review {
  id: string;
  customer_id: string;
  rating: number;
  title: string;
  comment: string;
  payment_punctuality: number;
  business_reputation: number;
  financial_stability: number;
  communication_quality: number;
  service_quality: number;
  price_fairness: number;
  cleanliness: number;
  location_accessibility: number;
  created_at: string;
}

export default function ShareExperience() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
    payment_punctuality: 5,
    business_reputation: 5,
    financial_stability: 5,
    communication_quality: 5,
    service_quality: 5,
    price_fairness: 5,
    cleanliness: 5,
    location_accessibility: 5
  });

  useEffect(() => {
    fetchApprovedCustomers();
  }, []);

  const fetchApprovedCustomers = async () => {
    try {
      const response = await fetch('/api/customers?status=approved');
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

  const fetchReviews = async (customerId: string) => {
    try {
      const response = await fetch(`/api/reviews?customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchReviews(customer.id);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          ...reviewForm
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setError("");
        // Reset form
        setReviewForm({
          rating: 5,
          title: "",
          comment: "",
          payment_punctuality: 5,
          business_reputation: 5,
          financial_stability: 5,
          communication_quality: 5,
          service_quality: 5,
          price_fairness: 5,
          cleanliness: 5,
          location_accessibility: 5
        });
        // Refresh reviews
        fetchReviews(selectedCustomer.id);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("خطا در ثبت نظر");
    }
  };

  const handleFormChange = (field: string, value: number | string) => {
    setReviewForm({
      ...reviewForm,
      [field]: value
    });
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
            اشتراک تجربه‌ها
          </h1>
          <p className="text-gray-600">
            تجربه‌های خود را با سایر کاربران به اشتراک بگذارید
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                انتخاب مشتری
              </h2>
              
              {customers.length === 0 ? (
                <p className="text-gray-600 text-sm">
                  هیچ مشتری تایید شده‌ای وجود ندارد
                </p>
              ) : (
                <div className="space-y-3">
                  {customers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`w-full text-right p-4 rounded-lg border transition-colors ${
                        selectedCustomer?.id === customer.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {customer.business_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {customer.business_type} - {customer.address}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review Form and List */}
          <div className="lg:col-span-2">
            {selectedCustomer ? (
              <div className="space-y-6">
                {/* Review Form */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    ثبت نظر برای {selectedCustomer.business_name}
                  </h2>
                  
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    {/* Overall Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        امتیاز کلی (۱-۵)
                      </label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => handleFormChange('rating', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={1}>۱ - بسیار ضعیف</option>
                        <option value={2}>۲ - ضعیف</option>
                        <option value={3}>۳ - متوسط</option>
                        <option value={4}>۴ - خوب</option>
                        <option value={5}>۵ - عالی</option>
                      </select>
                    </div>

                    {/* Title and Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عنوان نظر
                      </label>
                      <input
                        type="text"
                        value={reviewForm.title}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="عنوان کوتاه برای نظر شما"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        توضیحات
                      </label>
                      <textarea
                        rows={4}
                        value={reviewForm.comment}
                        onChange={(e) => handleFormChange('comment', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="تجربه خود را با جزئیات شرح دهید..."
                      />
                    </div>

                    {/* Detailed Ratings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'payment_punctuality', label: 'به موقع پرداخت' },
                        { key: 'business_reputation', label: 'اعتبار کسب‌وکار' },
                        { key: 'financial_stability', label: 'ثبات مالی' },
                        { key: 'communication_quality', label: 'کیفیت ارتباط' },
                        { key: 'service_quality', label: 'کیفیت خدمات' },
                        { key: 'price_fairness', label: 'منصفانه بودن قیمت' },
                        { key: 'cleanliness', label: 'نظافت' },
                        { key: 'location_accessibility', label: 'دسترسی مکانی' }
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {label}
                          </label>
                          <select
                            value={reviewForm[key as keyof typeof reviewForm]}
                            onChange={(e) => handleFormChange(key, parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value={1}>۱</option>
                            <option value={2}>۲</option>
                            <option value={3}>۳</option>
                            <option value={4}>۴</option>
                            <option value={5}>۵</option>
                          </select>
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      ثبت نظر
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    نظرات سایر کاربران
                  </h2>
                  
                  {reviews.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">
                      هنوز نظری ثبت نشده است
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {review.title}
                            </h3>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          <div className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('fa-IR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  مشتری را انتخاب کنید
                </h3>
                <p className="text-gray-600">
                  ابتدا مشتری مورد نظر خود را از لیست انتخاب کنید تا بتوانید نظر خود را ثبت کنید
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
