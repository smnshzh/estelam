import { NextRequest, NextResponse } from "next/server";
import { D1DatabaseService } from "@/lib/d1-database";
import { KVService } from "@/lib/kv-service";

// Cloudflare bindings
declare global {
  var __D1_DATABASE: D1DatabaseService | undefined;
  var __KV_STORE: KVService | undefined;
}

export function getD1Database(): D1DatabaseService {
  if (!global.__D1_DATABASE) {
    throw new Error("D1 Database not initialized");
  }
  return global.__D1_DATABASE;
}

export function getKVStore(): KVService {
  if (!global.__KV_STORE) {
    throw new Error("KV Store not initialized");
  }
  return global.__KV_STORE;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sellerId = url.searchParams.get('sellerId');
    
    if (!sellerId) {
      return NextResponse.json({ error: "Seller ID is required" }, { status: 400 });
    }
    
    const kv = getKVStore();
    const db = getD1Database();
    
    // Try to get from cache first
    let reviews = await kv.getCachedSellerReviews(sellerId);
    
    if (reviews.length === 0) {
      // Cache miss, fetch from database
      reviews = await db.getReviewsBySeller(sellerId);
      
      // Cache the results
      await kv.cacheSellerReviews(sellerId, reviews);
    }
    
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getD1Database();
    const kv = getKVStore();
    
    const review = await db.createReview({
      seller_id: body.seller_id,
      user_id: body.user_id,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
      service_quality: body.service_quality,
      price_fairness: body.price_fairness,
      cleanliness: body.cleanliness,
      location_accessibility: body.location_accessibility
    });
    
    // Invalidate cache for this seller's reviews
    await kv.invalidateReviewCache(body.seller_id);
    
    // Update analytics
    await kv.incrementCounter(`reviews:${body.seller_id}`);
    await kv.incrementCounter('total_reviews');
    
    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
