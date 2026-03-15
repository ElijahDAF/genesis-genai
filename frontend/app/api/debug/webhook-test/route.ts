import { NextRequest, NextResponse } from "next/server"

/**
 * Test endpoint to verify webhooks can reach your server.
 * Call this from the debug page to check connectivity.
 */
export async function POST(_req: NextRequest) {
  console.log("[Debug] Webhook test endpoint hit successfully")
  return NextResponse.json({ 
    received: true, 
    timestamp: new Date().toISOString(),
    message: "Your server is reachable! If VAPI webhooks aren't working, check your webhook URL in VAPI Dashboard."
  })
}

export async function GET(_req: NextRequest) {
  return NextResponse.json({ 
    status: "ok",
    message: "Debug endpoint is working. Use POST to test webhook reception."
  })
}
