import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      businessName,
      businessType,
      description,
      address,
      phone,
      email,
      website,
      creditLimit,
      paymentTerms
    } = body;

    // Validate required fields
    if (!businessName || !businessType || !address) {
      return NextResponse.json({
        success: false,
        message: 'نام کسب‌وکار، نوع کسب‌وکار و آدرس الزامی است'
      });
    }

    // Generate unique ID
    const customerId = `customer_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Mock user ID (in real app, get from session)
    const userId = `user_${Date.now()}`;

    // Create customer object
    const customer = {
      id: customerId,
      user_id: userId,
      business_name: businessName,
      business_type: businessType,
      description: description || null,
      address: address,
      latitude: 35.6892, // Mock coordinates (Tehran)
      longitude: 51.3890,
      phone: phone || null,
      email: email || null,
      website: website || null,
      credit_limit: creditLimit ? parseFloat(creditLimit) : 0,
      payment_terms: paymentTerms || null,
      credit_score: 0,
      risk_level: 'unknown',
      status: 'pending',
      verification_votes: 0,
      verification_threshold: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // In a real app, save to D1 database
    // await db.prepare('INSERT INTO customers (...) VALUES (...)').bind(...).run();

    return NextResponse.json({
      success: true,
      customer: customer,
      message: 'مشتری با موفقیت ثبت شد. منتظر تایید ۱۰ کاربر باشید.'
    });

  } catch (error) {
    console.error('Customer registration error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطا در ثبت مشتری'
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'all';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    // Mock customers data
    const mockCustomers = [
      {
        id: 'customer_1',
        business_name: 'رستوران سنتی',
        business_type: 'restaurant',
        address: 'تهران، خیابان ولیعصر',
        status: 'pending',
        verification_votes: 3,
        verification_threshold: 10,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'customer_2',
        business_name: 'فروشگاه پوشاک',
        business_type: 'retail',
        address: 'تهران، بازار بزرگ',
        status: 'approved',
        verification_votes: 12,
        verification_threshold: 10,
        created_at: '2024-01-02T00:00:00Z'
      }
    ];

    // Filter by status
    const filteredCustomers = status === 'all' 
      ? mockCustomers 
      : mockCustomers.filter(c => c.status === status);

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      customers: paginatedCustomers,
      pagination: {
        page,
        limit,
        total: filteredCustomers.length,
        totalPages: Math.ceil(filteredCustomers.length / limit)
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت لیست مشتریان'
    });
  }
}
