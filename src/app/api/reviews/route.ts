import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      rating,
      title,
      comment,
      payment_punctuality,
      business_reputation,
      financial_stability,
      communication_quality,
      service_quality,
      price_fairness,
      cleanliness,
      location_accessibility
    } = body;

    // Validate required fields
    if (!customerId || !rating) {
      return NextResponse.json({
        success: false,
        message: 'شناسه مشتری و امتیاز الزامی است'
      });
    }

    // Mock user ID (in real app, get from session)
    const userId = `user_${Date.now()}`;

    // Create review object
    const review = {
      id: `review_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      customer_id: customerId,
      user_id: userId,
      rating: parseInt(rating),
      title: title || null,
      comment: comment || null,
      payment_punctuality: payment_punctuality ? parseInt(payment_punctuality) : null,
      business_reputation: business_reputation ? parseInt(business_reputation) : null,
      financial_stability: financial_stability ? parseInt(financial_stability) : null,
      communication_quality: communication_quality ? parseInt(communication_quality) : null,
      service_quality: service_quality ? parseInt(service_quality) : null,
      price_fairness: price_fairness ? parseInt(price_fairness) : null,
      cleanliness: cleanliness ? parseInt(cleanliness) : null,
      location_accessibility: location_accessibility ? parseInt(location_accessibility) : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // In a real app, save to D1 database
    // await db.prepare('INSERT INTO reviews (...) VALUES (...)').bind(...).run();

    return NextResponse.json({
      success: true,
      review: review,
      message: 'نظر شما با موفقیت ثبت شد'
    });

  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطا در ثبت نظر'
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json({
        success: false,
        message: 'شناسه مشتری الزامی است'
      });
    }

    // Mock reviews data
    const mockReviews = [
      {
        id: 'review_1',
        customer_id: customerId,
        rating: 4,
        title: 'خدمات خوب',
        comment: 'خدمات مناسبی ارائه می‌دهند و قیمت‌ها منصفانه است.',
        payment_punctuality: 4,
        business_reputation: 5,
        financial_stability: 4,
        communication_quality: 4,
        service_quality: 4,
        price_fairness: 5,
        cleanliness: 4,
        location_accessibility: 3,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'review_2',
        customer_id: customerId,
        rating: 5,
        title: 'عالی',
        comment: 'تجربه بسیار خوبی داشتم. حتماً دوباره مراجعه می‌کنم.',
        payment_punctuality: 5,
        business_reputation: 5,
        financial_stability: 5,
        communication_quality: 5,
        service_quality: 5,
        price_fairness: 4,
        cleanliness: 5,
        location_accessibility: 4,
        created_at: '2024-01-02T00:00:00Z'
      }
    ];

    return NextResponse.json({
      success: true,
      reviews: mockReviews
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت نظرات'
    });
  }
}
