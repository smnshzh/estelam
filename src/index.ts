// Cloudflare Worker entry point
import { D1DatabaseService } from "./lib/d1-database";
import { KVService } from "./lib/kv-service";
import type { D1Database } from "./lib/d1-database";

// Minimal type aliases for Cloudflare Worker environment
type KVNamespace = any;
type ExecutionContext = unknown;

export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  NEXT_PUBLIC_API_DOMAIN: string;
  NEXT_PUBLIC_WEBSITE_DOMAIN: string;
  SUPERTOKENS_DASHBOARD_API_KEY: string;
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: string;
  NEXT_PUBLIC_STREAM_API_KEY: string;
  STREAM_API_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Initialize services
    const db = new D1DatabaseService(env.DB);
    const kv = new KVService(env.KV);
    
    // Make services available globally (non-typed)
    (globalThis as any).__D1_DATABASE = db;
    (globalThis as any).__KV_STORE = kv;
    
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env, ctx);
    }
    
    // Handle static assets and pages
    return handleStaticRequest(request, env, ctx);
  },
};

async function handleApiRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  
  try {
    // Route API requests
    if (url.pathname === '/api/sellers' && request.method === 'GET') {
      return handleGetSellers(request, env);
    }
    
    if (url.pathname === '/api/sellers' && request.method === 'POST') {
      return handleCreateSeller(request, env);
    }
    
    if (url.pathname === '/api/reviews' && request.method === 'GET') {
      return handleGetReviews(request, env);
    }
    
    if (url.pathname === '/api/reviews' && request.method === 'POST') {
      return handleCreateReview(request, env);
    }
    
    if (url.pathname === '/api/sellers/vote' && request.method === 'POST') {
      return handleSellerVote(request, env);
    }
    
    if (url.pathname === '/api/alerts' && request.method === 'GET') {
      return handleGetAlerts(request, env);
    }
    
    if (url.pathname === '/api/alerts' && request.method === 'POST') {
      return handleCreateAlert(request, env);
    }
    
    // Search endpoint
    if (url.pathname === '/api/search' && request.method === 'GET') {
      return handleSearch(request, env);
    }
    
    // Analytics endpoint
    if (url.pathname === '/api/analytics' && request.method === 'GET') {
      return handleAnalytics(request, env);
    }
    
    return new Response('Not Found', { status: 404, headers: corsHeaders });
    
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleGetSellers(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const lat = parseFloat(url.searchParams.get('lat') || '0');
  const lng = parseFloat(url.searchParams.get('lng') || '0');
  const radius = parseFloat(url.searchParams.get('radius') || '10');
  
  const kv = new KVService(env.KV);
  const db = new D1DatabaseService(env.DB);
  
  // Try cache first
  let sellers = await kv.getCachedLocationSellers(lat, lng, radius);
  
  if (sellers.length === 0) {
    sellers = await db.getSellersByLocation(lat, lng, radius);
    await kv.cacheLocationSellers(lat, lng, radius, sellers);
  }
  
  return new Response(JSON.stringify({ sellers }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateSeller(request: Request, env: Env): Promise<Response> {
  const body = await request.json();
  const db = new D1DatabaseService(env.DB);
  const kv = new KVService(env.KV);
  
  const seller = await db.createSeller(body);
  
  // Add to search index
  await kv.addToSearchIndex(seller.id, {
    business_name: body.business_name,
    business_type: body.business_type,
    address: body.address,
    description: body.description
  });
  
  return new Response(JSON.stringify({ seller }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleGetReviews(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const sellerId = url.searchParams.get('sellerId');
  
  if (!sellerId) {
    return new Response(JSON.stringify({ error: 'Seller ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const kv = new KVService(env.KV);
  const db = new D1DatabaseService(env.DB);
  
  let reviews = await kv.getCachedSellerReviews(sellerId);
  
  if (reviews.length === 0) {
    reviews = await db.getReviewsBySeller(sellerId);
    await kv.cacheSellerReviews(sellerId, reviews);
  }
  
  return new Response(JSON.stringify({ reviews }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateReview(request: Request, env: Env): Promise<Response> {
  const body = await request.json();
  const db = new D1DatabaseService(env.DB);
  const kv = new KVService(env.KV);
  
  const review = await db.createReview(body);
  
  // Invalidate cache
  await kv.invalidateReviewCache(body.seller_id);
  
  // Update analytics
  await kv.incrementCounter(`reviews:${body.seller_id}`);
  await kv.incrementCounter('total_reviews');
  
  return new Response(JSON.stringify({ review }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleSellerVote(request: Request, env: Env): Promise<Response> {
  const body = await request.json();
  const db = new D1DatabaseService(env.DB);
  
  await db.voteForSeller(body.seller_id, body.voter_id, body.vote_type, body.reason);
  
  const shouldApprove = await db.checkSellerVerification(body.seller_id);
  if (shouldApprove) {
    await db.updateSellerStatus(body.seller_id, 'approved');
  }
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleGetAlerts(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const sellerId = url.searchParams.get('sellerId');
  
  const kv = new KVService(env.KV);
  const db = new D1DatabaseService(env.DB);
  
  let alerts = [];
  
  if (sellerId) {
    alerts = await kv.getCachedActiveAlerts(sellerId);
    if (alerts.length === 0) {
      alerts = await db.getActiveAlertsBySeller(sellerId);
      await kv.cacheActiveAlerts(sellerId, alerts);
    }
  }
  
  return new Response(JSON.stringify({ alerts }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateAlert(request: Request, env: Env): Promise<Response> {
  const body = await request.json();
  const db = new D1DatabaseService(env.DB);
  const kv = new KVService(env.KV);
  
  const alert = await db.createAlert(body);
  
  // Invalidate cache
  await kv.invalidateAlertCache(body.seller_id);
  
  return new Response(JSON.stringify({ alert }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleSearch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  
  if (!query) {
    return new Response(JSON.stringify({ error: 'Query required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const kv = new KVService(env.KV);
  const sellerIds = await kv.searchSellers(query);
  
  const db = new D1DatabaseService(env.DB);
  const sellers = [];
  
  for (const id of sellerIds) {
    const seller = await db.getSellerById(id);
    if (seller) {
      sellers.push(seller);
    }
  }
  
  return new Response(JSON.stringify({ sellers }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleAnalytics(request: Request, env: Env): Promise<Response> {
  const kv = new KVService(env.KV);
  
  const totalReviews = await kv.getCounter('total_reviews');
  const totalSellers = await kv.getCounter('total_sellers');
  
  return new Response(JSON.stringify({
    total_reviews: totalReviews,
    total_sellers: totalSellers
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleStaticRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  // Worker فقط API را سرو می‌کند؛ سایر مسیرها 404 می‌شوند
  return new Response('Not Found', { status: 404 });
}
