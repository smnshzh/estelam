# Cloudflare D1 و KV Setup

## راه‌اندازی Cloudflare D1

### 1. ایجاد پایگاه داده D1

```bash
# نصب Wrangler CLI
npm install -g wrangler

# ورود به Cloudflare
wrangler login

# ایجاد پایگاه داده جدید
wrangler d1 create estelam-db

# اجرای اسکریپت‌های SQL
wrangler d1 execute estelam-db --file=./database/schema.sql
```

### 2. تنظیم متغیرهای محیطی

در فایل `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "estelam-db"
database_id = "your-database-id"
```

## راه‌اندازی Cloudflare KV

### 1. ایجاد KV Namespace

```bash
# ایجاد KV namespace برای production
wrangler kv:namespace create "ESTELAM_KV"

# ایجاد KV namespace برای preview
wrangler kv:namespace create "ESTELAM_KV" --preview
```

### 2. تنظیم در wrangler.toml

```toml
[[kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"
```

## استقرار روی Cloudflare Pages

### 1. تنظیمات Build

```bash
# Build command
npm run build

# Build output directory
.next
```

### 2. متغیرهای محیطی در Cloudflare Pages

```
NEXT_PUBLIC_API_DOMAIN=https://your-domain.pages.dev
NEXT_PUBLIC_WEBSITE_DOMAIN=https://your-domain.pages.dev
SUPERTOKENS_DASHBOARD_API_KEY=your-dashboard-api-key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
NEXT_PUBLIC_STREAM_API_KEY=your-stream-api-key
STREAM_API_SECRET=your-stream-api-secret
```

### 3. اتصال D1 و KV

در تنظیمات Cloudflare Pages:
- D1 Database: `estelam-db`
- KV Namespace: `ESTELAM_KV`

## استفاده از D1 در کد

```typescript
// در Cloudflare Worker
export interface Env {
  DB: D1Database;
  KV: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const db = new D1DatabaseService(env.DB);
    const kv = new KVService(env.KV);
    
    // استفاده از پایگاه داده
    const sellers = await db.getSellersByLocation(35.7219, 51.4076, 10);
    
    // استفاده از KV برای cache
    await kv.cacheLocationSellers(35.7219, 51.4076, 10, sellers);
    
    return new Response(JSON.stringify({ sellers }));
  }
};
```

## استفاده از KV در کد

```typescript
// Cache کردن داده‌ها
await kv.cacheSellerReviews(sellerId, reviews);

// دریافت از cache
const cachedReviews = await kv.getCachedSellerReviews(sellerId);

// Invalidate cache
await kv.invalidateReviewCache(sellerId);

// Analytics
await kv.incrementCounter('total_reviews');
```

## مدیریت داده‌ها

### Backup D1 Database

```bash
# Export داده‌ها
wrangler d1 export estelam-db --output=backup.sql

# Import داده‌ها
wrangler d1 execute estelam-db --file=backup.sql
```

### مدیریت KV Data

```bash
# لیست کلیدها
wrangler kv:key list --binding=KV

# حذف کلید
wrangler kv:key delete "key-name" --binding=KV

# دریافت مقدار
wrangler kv:key get "key-name" --binding=KV
```

## Monitoring و Analytics

### D1 Analytics

```sql
-- بررسی استفاده از پایگاه داده
SELECT * FROM sqlite_master WHERE type='table';

-- آمار نظرات
SELECT seller_id, COUNT(*) as review_count 
FROM reviews 
GROUP BY seller_id 
ORDER BY review_count DESC;
```

### KV Analytics

```typescript
// شمارش کلیدها
const keys = await kv.list();
console.log(`Total keys: ${keys.keys.length}`);

// بررسی cache hit rate
const cacheHits = await kv.getCounter('cache_hits');
const cacheMisses = await kv.getCounter('cache_misses');
const hitRate = cacheHits / (cacheHits + cacheMisses);
```

## بهینه‌سازی عملکرد

### D1 بهینه‌سازی

1. **Indexing**: استفاده از index برای جستجوهای مکرر
2. **Batch Operations**: استفاده از batch برای عملیات متعدد
3. **Connection Pooling**: مدیریت اتصالات

### KV بهینه‌سازی

1. **TTL مناسب**: تنظیم زمان انقضای مناسب
2. **Compression**: فشرده‌سازی داده‌های بزرگ
3. **Partitioning**: تقسیم داده‌های بزرگ

## Troubleshooting

### مشکلات رایج D1

```bash
# بررسی وضعیت پایگاه داده
wrangler d1 info estelam-db

# اجرای query برای تست
wrangler d1 execute estelam-db --command="SELECT COUNT(*) FROM users"
```

### مشکلات رایج KV

```bash
# بررسی namespace
wrangler kv:namespace list

# تست دسترسی
wrangler kv:key get "test-key" --binding=KV
```
