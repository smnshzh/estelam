import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';

const bot = new Telegraf('8134674723:AAGSJ-g3oECAfykzvXiqpZQCDs5BdIMLF5Q');

// Store pending authentications
const pendingAuths = new Map<string, { userId: number, username?: string, firstName?: string, lastName?: string, phoneNumber?: string }>();

export async function POST(request: NextRequest) {
  try {
    const { action, phoneNumber, userId } = await request.json();

    if (action === 'send_code') {
      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store pending authentication
      pendingAuths.set(verificationCode, { 
        userId: userId || Date.now(), 
        phoneNumber,
        timestamp: Date.now()
      });
      
      try {
        // Send verification code via Telegram bot
        await bot.telegram.sendMessage(
          phoneNumber, // This should be the Telegram user ID or chat ID
          `🔐 کد احراز هویت شما:\n\n${verificationCode}\n\nاین کد تا ۵ دقیقه معتبر است.\n\nپلتفرم استعلام`
        );
        
        return NextResponse.json({ 
          success: true, 
          message: 'کد احراز هویت به تلگرام شما ارسال شد',
          expiresIn: 300 // 5 minutes
        });
      } catch (telegramError) {
        console.error('Telegram send error:', telegramError);
        return NextResponse.json({ 
          success: false, 
          message: 'خطا در ارسال کد به تلگرام. لطفاً شماره تلگرام خود را بررسی کنید.' 
        });
      }
    }

    if (action === 'verify_code') {
      const { code, phoneNumber } = await request.json();
      
      if (pendingAuths.has(code)) {
        const authData = pendingAuths.get(code);
        
        // Check if code is not expired (5 minutes)
        if (Date.now() - authData.timestamp > 300000) {
          pendingAuths.delete(code);
          return NextResponse.json({ 
            success: false, 
            message: 'کد احراز هویت منقضی شده است' 
          });
        }
        
        // Verify phone number matches
        if (authData.phoneNumber === phoneNumber) {
          pendingAuths.delete(code);
          
          return NextResponse.json({ 
            success: true, 
            user: {
              id: authData.userId,
              phoneNumber: authData.phoneNumber,
              verified: true
            },
            message: 'احراز هویت موفقیت‌آمیز بود' 
          });
        }
      }
      
      return NextResponse.json({ 
        success: false, 
        message: 'کد احراز هویت نامعتبر است' 
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'عملیات نامعتبر' 
    });

  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'خطا در احراز هویت تلگرام' 
    });
  }
}

// Bot webhook handler for receiving messages
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle incoming Telegram messages
    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      const text = message.text;
      
      // If user sends a verification code
      if (text && /^\d{6}$/.test(text)) {
        // This would be handled by the verification process
        return NextResponse.json({ success: true });
      }
      
      // Send welcome message
      await bot.telegram.sendMessage(
        chatId,
        `👋 سلام!\n\nبه ربات احراز هویت پلتفرم استعلام خوش آمدید.\n\nبرای دریافت کد احراز هویت، لطفاً در وب‌سایت اقدام کنید.`
      );
    }
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'خطا در پردازش پیام تلگرام' 
    });
  }
}
