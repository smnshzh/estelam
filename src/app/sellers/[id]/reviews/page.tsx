"use client";

import { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import Link from "next/link";

interface Review {
  id: string;
  seller_id: string;
  user_id: string;
  rating: number;
  title?: string;
  comment?: string;
  service_quality?: number;
  price_fairness?: number;
  cleanliness?: number;
  location_accessibility?: number;
  created_at: string;
  user_name?: string;
}

interface Seller {
  id: string;
  business_name: string;
  business_type: string;
  address: string;
  average_rating: number;
  total_reviews: number;
}

export default function SellerReviews({ params }: { params: { id: string } }) {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
    service_quality: 5,
    price_fairness: 5,
    cleanliness: 5,
    location_accessibility: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSellerAndReviews();
  }, [params.id]);

  const fetchSellerAndReviews = async () => {
    try {
      // Fetch seller details
      const sellerResponse = await fetch(`/api/sellers/${params.id}`);
      const sellerData = await sellerResponse.json();
      setSeller(sellerData.seller);

      // Fetch reviews
      const reviewsResponse = await fetch(`/api/reviews?sellerId=${params.id}`);
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData.reviews);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seller_id: params.id,
          user_id: "current-user-id", // This would come from session
          ...reviewForm
        }),
      });

      if (response.ok) {
        setShowReviewForm(false);
        setReviewForm({
          rating: 5,
          title: "",
          comment: "",
          service_quality: 5,
          price_fairness: 5,
          cleanliness: 5,
          location_accessibility: 5
        });
        fetchSellerAndReviews(); // Refresh data
      } else {
        alert("خطا در ثبت نظر");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("خطا در ثبت نظر");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1 space-x-reverse">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange?.(star)}
            className={`text-2xl ${
              star <= rating 
                ? "text-yellow-400" 
                : "text-gray-300"
            } ${interactive ? "hover:text-yellow-500 cursor-pointer" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
    );
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

  if (!seller) {
    return (
      <SessionAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-red-500">فروشنده یافت نشد</div>
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
                <Link href="/sellers" className="text-indigo-600 hover:text-indigo-900 mr-4">
                  ← بازگشت
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">{seller.business_name}</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{seller.business_name}</h2>
                  <p className="text-gray-600">{seller.business_type}</p>
                  <p className="text-gray-500">{seller.address}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {renderStars(Math.round(seller.average_rating))}
                    <span className="text-lg font-semibold text-gray-900">
                      {seller.average_rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{seller.total_reviews} نظر</p>
                </div>
              </div>
            </div>

            {/* Add Review Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showReviewForm ? "انصراف" : "نظر جدید"}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">نظر شما</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      امتیاز کلی
                    </label>
                    {renderStars(reviewForm.rating, true, (rating) => 
                      setReviewForm(prev => ({ ...prev, rating }))
                    )}
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      عنوان نظر
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="عنوان کوتاه برای نظر خود"
                    />
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                      نظر شما
                    </label>
                    <textarea
                      id="comment"
                      rows={3}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="نظر تفصیلی خود را بنویسید"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        کیفیت خدمات
                      </label>
                      {renderStars(reviewForm.service_quality, true, (rating) => 
                        setReviewForm(prev => ({ ...prev, service_quality: rating }))
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        قیمت مناسب
                      </label>
                      {renderStars(reviewForm.price_fairness, true, (rating) => 
                        setReviewForm(prev => ({ ...prev, price_fairness: rating }))
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نظافت
                      </label>
                      {renderStars(reviewForm.cleanliness, true, (rating) => 
                        setReviewForm(prev => ({ ...prev, cleanliness: rating }))
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        دسترسی
                      </label>
                      {renderStars(reviewForm.location_accessibility, true, (rating) => 
                        setReviewForm(prev => ({ ...prev, location_accessibility: rating }))
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isSubmitting ? "در حال ثبت..." : "ثبت نظر"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">نظرات کاربران</h3>
              {reviews.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">هنوز نظری ثبت نشده است</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.user_name || "کاربر ناشناس"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {renderStars(review.rating)}
                        <span className="text-sm font-medium text-gray-900">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    {review.title && (
                      <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                    )}

                    {review.comment && (
                      <p className="text-gray-700 mb-4">{review.comment}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {review.service_quality && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">کیفیت خدمات:</span>
                          <span className="font-medium">{review.service_quality}/5</span>
                        </div>
                      )}
                      {review.price_fairness && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">قیمت مناسب:</span>
                          <span className="font-medium">{review.price_fairness}/5</span>
                        </div>
                      )}
                      {review.cleanliness && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">نظافت:</span>
                          <span className="font-medium">{review.cleanliness}/5</span>
                        </div>
                      )}
                      {review.location_accessibility && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">دسترسی:</span>
                          <span className="font-medium">{review.location_accessibility}/5</span>
                        </div>
                      )}
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
