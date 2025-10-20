import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, voteType } = body;

    if (!customerId || !voteType) {
      return NextResponse.json({
        success: false,
        message: 'شناسه مشتری و نوع رای الزامی است'
      });
    }

    if (!['approve', 'reject'].includes(voteType)) {
      return NextResponse.json({
        success: false,
        message: 'نوع رای نامعتبر است'
      });
    }

    // Mock user ID (in real app, get from session)
    const voterId = `user_${Date.now()}`;

    // In a real app, you would:
    // 1. Check if user already voted for this customer
    // 2. Insert vote into customer_verification_votes table
    // 3. Update verification_votes count in customers table
    // 4. Check if threshold is reached and update status

    // Mock response
    const mockResponse = {
      success: true,
      message: voteType === 'approve' 
        ? 'رای تایید شما ثبت شد' 
        : 'رای رد شما ثبت شد',
      vote: {
        id: `vote_${Date.now()}`,
        customer_id: customerId,
        voter_id: voterId,
        vote_type: voteType,
        created_at: new Date().toISOString()
      }
    };

    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطا در ثبت رای'
    });
  }
}
