# 🏪 پلتفرم استعلام - مدیریت فروشندگان

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=for-the-badge&logo=typescript)
![Cloudflare](https://img.shields.io/badge/Cloudflare-D1%20%7C%20KV-orange?style=for-the-badge&logo=cloudflare)
![Mapbox](https://img.shields.io/badge/Mapbox-GL%20JS-green?style=for-the-badge&logo=mapbox)

**پلتفرم مبتنی بر نقشه برای فروشندگان با قابلیت‌های پیشرفته نظردهی، سیستم امتیازدهی و ارتباط زنده**

[🚀 دمو زنده](https://estelam.pages.dev) • [📖 مستندات](https://github.com/smnshzh/estelam/wiki) • [🐛 گزارش باگ](https://github.com/smnshzh/estelam/issues)

</div>

---

## ✨ ویژگی‌های کلیدی

<table>
<tr>
<td width="50%">

### 🔐 احراز هویت
- ✅ ثبت‌نام با ایمیل/تلفن
- ✅ مدیریت سطوح دسترسی
- ✅ امنیت پیشرفته با SuperTokens

### 🗺️ نقشه و موقعیت‌یابی
- ✅ نقشه تعاملی Mapbox
- ✅ جستجوی جغرافیایی
- ✅ انتخاب موقعیت دقیق

</td>
<td width="50%">

### ⭐ نظردهی و امتیازدهی
- ✅ امتیازدهی چندبعدی
- ✅ نظرات کاربران
- ✅ محاسبه هوشمند امتیاز

### 💬 چت زنده
- ✅ چت خصوصی و گروهی
- ✅ ارسال فایل و تصویر
- ✅ تاریخچه مکالمات

</td>
</tr>
</table>

---

## 🏗️ معماری سیستم

```mermaid
graph TB
    A[Frontend - Next.js] --> B[Cloudflare Pages]
    A --> C[Mapbox GL JS]
    A --> D[Stream Chat]
    
    B --> E[Cloudflare Workers]
    E --> F[D1 Database]
    E --> G[KV Storage]
    
    F --> H[Users]
    F --> I[Sellers]
    F --> J[Reviews]
    F --> K[Alerts]
    
    G --> L[Cache Layer]
    G --> M[Session Management]
    G --> N[Search Index]
```

---

## 🛠️ فناوری‌های استفاده شده

| دسته | فناوری | توضیحات |
|------|--------|---------|
| **Frontend** | Next.js 15 + TypeScript | فریمورک اصلی |
| **Styling** | Tailwind CSS | طراحی UI |
| **Authentication** | SuperTokens | مدیریت کاربران |
| **Database** | Cloudflare D1 | پایگاه داده SQLite |
| **Cache** | Cloudflare KV | کش و ذخیره |
| **Maps** | Mapbox GL JS | نقشه‌های تعاملی |
| **Chat** | Stream Chat | چت زنده |
| **Deployment** | Cloudflare Pages | استقرار |

---

## 🚀 راه‌اندازی سریع

### پیش‌نیازها

- Node.js 18+
- npm یا yarn
- حساب کاربری Cloudflare
- کلید API Mapbox
- حساب کاربری Stream Chat

### نصب و راه‌اندازی

```bash
# 1. کلون کردن پروژه
git clone https://github.com/smnshzh/estelam.git
cd estelam

# 2. نصب وابستگی‌ها
npm install

# 3. تنظیم متغیرهای محیطی
cp env.example .env.local

# 4. راه‌اندازی Cloudflare D1
npm run d1:create
npm run d1:migrate

# 5. راه‌اندازی Cloudflare KV
npm run kv:create
npm run kv:create-preview

# 6. اجرای پروژه
npm run dev
```

### تنظیمات محیطی

```env
# SuperTokens
NEXT_PUBLIC_API_DOMAIN=http://localhost:3000
NEXT_PUBLIC_WEBSITE_DOMAIN=http://localhost:3000
SUPERTOKENS_DASHBOARD_API_KEY=your-dashboard-api-key

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# Stream Chat
NEXT_PUBLIC_STREAM_API_KEY=your-stream-api-key
STREAM_API_SECRET=your-stream-api-secret

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
```

---

## 📁 ساختار پروژه

```
estelam/
├── 📁 src/
│   ├── 📁 app/                    # صفحات Next.js
│   │   ├── 📁 auth/              # احراز هویت
│   │   ├── 📁 dashboard/         # دشبورد
│   │   ├── 📁 map/               # نقشه
│   │   ├── 📁 sellers/           # فروشندگان
│   │   ├── 📁 chat/              # چت
│   │   ├── 📁 alerts/            # هشدارها
│   │   └── 📁 admin/             # مدیریت
│   ├── 📁 components/            # کامپوننت‌ها
│   ├── 📁 lib/                   # کتابخانه‌ها
│   │   ├── d1-database.ts        # سرویس D1
│   │   └── kv-service.ts         # سرویس KV
│   └── 📁 pages/                 # API routes
├── 📁 database/
│   └── schema.sql               # اسکریپت پایگاه داده
├── 📄 wrangler.toml             # پیکربندی Cloudflare
└── 📄 README.md                 # این فایل
```

---

## 🔌 API Endpoints

### احراز هویت
```http
POST /api/auth/signup     # ثبت‌نام
POST /api/auth/signin     # ورود
POST /api/auth/signout    # خروج
```

### فروشندگان
```http
GET  /api/sellers         # لیست فروشندگان
POST /api/sellers         # ثبت فروشنده
GET  /api/sellers/[id]    # اطلاعات فروشنده
POST /api/sellers/vote    # رای تایید
```

### نظرات
```http
GET  /api/reviews?sellerId=[id]  # نظرات فروشنده
POST /api/reviews                # ثبت نظر
```

### هشدارها
```http
GET  /api/alerts          # لیست هشدارها
POST /api/alerts          # ایجاد هشدار
```

### جستجو و Analytics
```http
GET /api/search?q=[query]  # جستجو
GET /api/analytics         # آمار کلی
```

---

## 🌐 استقرار روی Cloudflare

### 1. تنظیمات Pages

```bash
# Build command
npm run build

# Build output directory
.next
```

### 2. متغیرهای محیطی

در Cloudflare Pages Dashboard:
- `NEXT_PUBLIC_API_DOMAIN`
- `NEXT_PUBLIC_WEBSITE_DOMAIN`
- `SUPERTOKENS_DASHBOARD_API_KEY`
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- `NEXT_PUBLIC_STREAM_API_KEY`
- `STREAM_API_SECRET`

### 3. اتصال D1 و KV

- **D1 Database**: `estelam-db`
- **KV Namespace**: `ESTELAM_KV`

---

## 📊 ویژگی‌های Cloudflare

### 🗄️ D1 Database
- **SQLite-based**: پایگاه داده در Edge
- **Global Distribution**: توزیع جهانی
- **ACID Compliance**: تراکنش‌های امن
- **Auto-scaling**: مقیاس‌پذیری خودکار

### ⚡ KV Storage
- **Edge Caching**: کش در Edge
- **Session Management**: مدیریت session
- **Search Index**: ایندکس جستجو
- **Analytics**: آمار و متریک‌ها
- **Rate Limiting**: محدودیت نرخ

---

## 🎯 نحوه استفاده

### برای کاربران عادی
1. 🔐 ثبت‌نام در سیستم
2. 🗺️ جستجو روی نقشه
3. ⭐ ثبت نظر و امتیاز
4. 💬 استفاده از چت

### برای فروشندگان
1. 📝 تکمیل پروفایل
2. 📍 انتخاب موقعیت
3. 🔔 ایجاد هشدار
4. 💬 پاسخ‌گویی در چت

### برای ادمین‌ها
1. ✅ تایید فروشندگان
2. 👥 مدیریت کاربران
3. 📊 نظارت بر سیستم

---

## 🤝 مشارکت

مشارکت در این پروژه بسیار خوشایند است!

1. 🍴 Fork کنید
2. 🌿 Branch جدید بسازید (`git checkout -b feature/amazing-feature`)
3. 💾 Commit کنید (`git commit -m 'Add amazing feature'`)
4. 📤 Push کنید (`git push origin feature/amazing-feature`)
5. 🔄 Pull Request ایجاد کنید

---

## 📄 مجوز

این پروژه تحت مجوز [MIT](LICENSE) منتشر شده است.

---

## 📞 پشتیبانی

- 🐛 [گزارش باگ](https://github.com/smnshzh/estelam/issues)
- 💡 [درخواست ویژگی](https://github.com/smnshzh/estelam/issues)
- 📧 ایمیل: support@estelam.com

---

## 🗺️ نقشه راه

- [ ] 📱 اپلیکیشن موبایل
- [ ] 🌍 پشتیبانی چندزبانه
- [ ] 💳 سیستم پرداخت
- [ ] 📈 تحلیل‌های پیشرفته
- [ ] 🔌 API عمومی

---

<div align="center">

**ساخته شده با ❤️ در ایران**

[⭐ ستاره دهید](https://github.com/smnshzh/estelam) • [🍴 Fork کنید](https://github.com/smnshzh/estelam/fork) • [👀 Watch کنید](https://github.com/smnshzh/estelam)

</div>