# پلتفرم استعلام - مدیریت فروشندگان

پلتفرم مبتنی بر نقشه برای فروشندگان با قابلیت‌های پیشرفته نظردهی، سیستم امتیازدهی و ارتباط زنده.

## ویژگی‌های اصلی

### 🔐 سیستم احراز هویت
- استفاده از SuperTokens برای مدیریت کاربران
- پشتیبانی از ثبت‌نام با ایمیل/شماره تلفن
- مدیریت سطوح دسترسی (ادمین، فروشنده، کاربر عادی)

### 🏪 مدیریت پروفایل فروشندگان
- ثبت اطلاعات مغازه (نام، نوع کسب‌وکار، آدرس)
- اطلاعات مالک (نام، تلفن، ایمیل)
- موقعیت‌یابی بر روی نقشه

### ✅ سیستم تایید فروشندگان
- نیاز به تایید ۱۰ کاربر دیگر یا ادمین برای فعال‌سازی
- امکان رد درخواست با ذکر دلیل
- سیستم پیگیری وضعیت درخواست

### ⭐ سیستم نظردهی و امتیازدهی
- امتیازدهی بر اساس معیارهای مختلف
- ثبت نظرات کاربران
- محاسبه امتیاز کلی با الگوریتم وزندهی
- نمایش وضعیت فعال/غیرفعال

### 🔔 سیستم هشدار و اطلاع‌رسانی
- امکان ثبت هشدار توسط فروشندگان
- اطلاع‌رسانی به دنبال‌کنندگان
- طبقه‌بندی هشدارها (فروش ویژه، تعطیلی، etc.)

## ویژگی‌های Cloudflare D1 و KV

### 🗄️ Cloudflare D1 (پایگاه داده اصلی)
- **SQLite-based**: پایگاه داده SQLite در Cloudflare Edge
- **Global Distribution**: توزیع جهانی داده‌ها
- **ACID Compliance**: پشتیبانی کامل از تراکنش‌ها
- **Auto-scaling**: مقیاس‌پذیری خودکار
- **Backup & Restore**: پشتیبانی از backup و restore

### ⚡ Cloudflare KV (کش و ذخیره)
- **Edge Caching**: کش در Edge برای عملکرد بهتر
- **Session Management**: مدیریت session کاربران
- **Search Index**: ایندکس جستجو برای فروشندگان
- **Analytics**: ذخیره آمار و متریک‌ها
- **Rate Limiting**: محدودیت نرخ درخواست
- **User Preferences**: ذخیره تنظیمات کاربران

### 🔄 Cache Strategy
- **Location-based Caching**: کش بر اساس موقعیت جغرافیایی
- **Seller Data Caching**: کش اطلاعات فروشندگان
- **Review Caching**: کش نظرات و امتیازات
- **Alert Caching**: کش هشدارها و اطلاع‌رسانی‌ها
- **Auto Invalidation**: باطل‌سازی خودکار cache

## فناوری‌های مورد استفاده

- **Frontend**: Next.js با TypeScript
- **Authentication**: SuperTokens
- **Deployment**: Cloudflare Pages + Workers
- **Database**: Cloudflare D1 (SQLite) - پایگاه داده اصلی
- **Cache & Storage**: Cloudflare KV - کش و ذخیره داده‌های غیرساختاریافته
- **Maps**: Mapbox API
- **Real-time Communication**: Stream Chat
- **Styling**: Tailwind CSS
- **Infrastructure**: Cloudflare Workers برای API

## نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+
- npm یا yarn
- حساب کاربری Cloudflare
- کلید API Mapbox
- حساب کاربری Stream Chat

### مراحل نصب

1. **کلون کردن پروژه**
```bash
git clone <repository-url>
cd estelam-platform
```

2. **نصب وابستگی‌ها**
```bash
npm install
```

3. **تنظیم متغیرهای محیطی**
```bash
cp env.example .env.local
```

متغیرهای محیطی مورد نیاز:
```env
# SuperTokens Configuration
NEXT_PUBLIC_API_DOMAIN=http://localhost:3000
NEXT_PUBLIC_WEBSITE_DOMAIN=http://localhost:3000
SUPERTOKENS_DASHBOARD_API_KEY=your-dashboard-api-key

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# Stream Chat Configuration
NEXT_PUBLIC_STREAM_API_KEY=your-stream-api-key
STREAM_API_SECRET=your-stream-api-secret

# Database Configuration (Cloudflare D1)
DATABASE_URL=your-database-url

# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
```

4. **راه‌اندازی پایگاه داده Cloudflare D1**
```bash
# نصب Wrangler CLI
npm install -g wrangler

# ورود به Cloudflare
wrangler login

# ایجاد پایگاه داده D1
npm run d1:create

# اجرای اسکریپت‌های SQL
npm run d1:migrate
```

5. **راه‌اندازی Cloudflare KV**
```bash
# ایجاد KV namespace برای production
npm run kv:create

# ایجاد KV namespace برای preview
npm run kv:create-preview
```

6. **اجرای پروژه**
```bash
npm run dev
```

پروژه در آدرس `http://localhost:3000` در دسترس خواهد بود.

## ساختار پروژه

```
estelam-platform/
├── src/
│   ├── app/                    # صفحات Next.js App Router
│   │   ├── auth/              # صفحات احراز هویت
│   │   ├── dashboard/         # دشبورد اصلی
│   │   ├── map/               # صفحه نقشه
│   │   ├── sellers/           # مدیریت فروشندگان
│   │   ├── chat/              # چت زنده
│   │   ├── alerts/            # هشدارها
│   │   └── admin/             # پنل مدیریت
│   ├── components/            # کامپوننت‌های قابل استفاده مجدد
│   ├── lib/                   # کتابخانه‌ها و ابزارها
│   └── pages/                 # API routes
├── database/                  # اسکریپت‌های پایگاه داده
├── public/                    # فایل‌های استاتیک
└── docs/                      # مستندات
```

## API Endpoints

### احراز هویت
- `POST /api/auth/signup` - ثبت‌نام کاربر
- `POST /api/auth/signin` - ورود کاربر
- `POST /api/auth/signout` - خروج کاربر

### فروشندگان
- `GET /api/sellers` - دریافت لیست فروشندگان
- `POST /api/sellers` - ثبت فروشنده جدید
- `GET /api/sellers/[id]` - دریافت اطلاعات فروشنده
- `POST /api/sellers/vote` - رای دادن برای تایید فروشنده

### نظرات
- `GET /api/reviews?sellerId=[id]` - دریافت نظرات فروشنده
- `POST /api/reviews` - ثبت نظر جدید

### هشدارها
- `GET /api/alerts` - دریافت هشدارها
- `POST /api/alerts` - ایجاد هشدار جدید

### جستجو و Analytics
- `GET /api/search?q=[query]` - جستجو در فروشندگان
- `GET /api/analytics` - دریافت آمار کلی

### Cloudflare D1 & KV
- تمام API endpoints از D1 برای ذخیره داده‌ها استفاده می‌کنند
- KV برای کش کردن نتایج و بهبود عملکرد استفاده می‌شود
- Session management و user preferences در KV ذخیره می‌شوند

## استقرار روی Cloudflare Pages

1. **اتصال به GitHub**
   - پروژه را در GitHub منتشر کنید
   - در Cloudflare Pages، پروژه را از GitHub متصل کنید

2. **تنظیمات Build**
   - Build command: `npm run build`
   - Build output directory: `.next`

3. **تنظیم متغیرهای محیطی**
   - در Cloudflare Pages، متغیرهای محیطی را تنظیم کنید

4. **اتصال پایگاه داده D1**
   - پایگاه داده D1 را به پروژه متصل کنید

## استفاده از پروژه

### برای کاربران عادی
1. ثبت‌نام در سیستم
2. جستجو و مشاهده فروشندگان روی نقشه
3. ثبت نظر و امتیاز برای فروشندگان
4. استفاده از چت زنده

### برای فروشندگان
1. ثبت‌نام و تکمیل پروفایل
2. ثبت اطلاعات کسب‌وکار
3. انتخاب موقعیت روی نقشه
4. ایجاد هشدار و اطلاع‌رسانی
5. پاسخ‌گویی در چت

### برای ادمین‌ها
1. بررسی و تایید فروشندگان
2. مدیریت کاربران
3. نظارت بر سیستم

## مشارکت در پروژه

1. Fork کردن پروژه
2. ایجاد branch جدید (`git checkout -b feature/amazing-feature`)
3. Commit تغییرات (`git commit -m 'Add amazing feature'`)
4. Push کردن به branch (`git push origin feature/amazing-feature`)
5. ایجاد Pull Request

## مجوز

این پروژه تحت مجوز MIT منتشر شده است. برای جزئیات بیشتر، فایل `LICENSE` را مطالعه کنید.

## پشتیبانی

برای سوالات و پشتیبانی، لطفاً issue جدیدی در GitHub ایجاد کنید.

## تغییرات آینده

- [ ] پشتیبانی از چندین زبان
- [ ] اپلیکیشن موبایل
- [ ] سیستم پرداخت آنلاین
- [ ] تحلیل‌های پیشرفته
- [ ] API عمومی برای توسعه‌دهندگان#   e s t e l a m  
 