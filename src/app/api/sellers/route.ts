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
    const lat = parseFloat(url.searchParams.get('lat') || '0');
    const lng = parseFloat(url.searchParams.get('lng') || '0');
    const radius = parseFloat(url.searchParams.get('radius') || '10');
    
    const kv = getKVStore();
    const db = getD1Database();
    
    // Try to get from cache first
    let sellers = await kv.getCachedLocationSellers(lat, lng, radius);
    
    if (sellers.length === 0) {
      // Cache miss, fetch from database
      sellers = await db.getSellersByLocation(lat, lng, radius);
      
      // Cache the results
      await kv.cacheLocationSellers(lat, lng, radius, sellers);
    }
    
    return NextResponse.json({ sellers });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getD1Database();
    const kv = getKVStore();
    
    const seller = await db.createSeller({
      user_id: body.user_id,
      business_name: body.business_name,
      business_type: body.business_type,
      description: body.description,
      address: body.address,
      latitude: body.latitude,
      longitude: body.longitude,
      phone: body.phone,
      email: body.email,
      website: body.website
    });
    
    // Add to search index
    await kv.addToSearchIndex(seller.id, {
      business_name: body.business_name,
      business_type: body.business_type,
      address: body.address,
      description: body.description
    });
    
    return NextResponse.json({ seller });
  } catch (error) {
    console.error("Error creating seller:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
