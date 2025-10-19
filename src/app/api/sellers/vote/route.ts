import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock response for now
    console.log("Vote received:", body);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error voting for seller:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
