# Cloudflare Pages Configuration

## Build Settings
- **Build Command**: `npm run build`
- **Build Output Directory**: `.next`
- **Root Directory**: `/`

## Environment Variables
Set these in Cloudflare Pages dashboard:

### SuperTokens
- `NEXT_PUBLIC_API_DOMAIN`: Your production domain
- `NEXT_PUBLIC_WEBSITE_DOMAIN`: Your production domain
- `SUPERTOKENS_DASHBOARD_API_KEY`: Your SuperTokens dashboard API key

### Mapbox
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: Your Mapbox access token

### Stream Chat
- `NEXT_PUBLIC_STREAM_API_KEY`: Your Stream API key
- `STREAM_API_SECRET`: Your Stream API secret

### Database
- `DATABASE_URL`: Your Cloudflare D1 database URL

### Cloudflare
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token

## D1 Database Setup
1. Create a new D1 database in Cloudflare dashboard
2. Run the schema.sql file to create tables
3. Connect the database to your Pages project

## Custom Headers
Add these headers for security:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## Redirects
Add these redirects for better UX:
```
/auth/signin -> /auth/signin 200
/auth/signup -> /auth/signup 200
```

## Functions
The project uses Cloudflare Functions for API routes. Make sure to:
1. Enable Functions in Pages settings
2. Set up proper routing for API endpoints
3. Configure CORS if needed
