import { NextRequest, NextResponse } from "next/server"
import { updateCallLog, createMemory, getCallLogByVapiCallId, createCallLog } from "@/app/lib/supabase"
import { getCallDetails } from "@/app/lib/vapi"

// TODO: add real signature verification if you configure a webhook secret
function verifyWebhook(_req: NextRequest): boolean {
  return true
}

/** VAPI structured output shape from your assistant (mood, mood_notes, meds_taken, has_story, chapter_title, chapter_content) */
type EverlyStructuredResult = {
  mood?: string
  mood_notes?: string
  meds_taken?: boolean
  has_story?: boolean
  chapter_title?: string
  chapter_content?: string
}

export async function POST(req: NextRequest) {
  try {
    if (!verifyWebhook(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await req.json()
    const { message } = payload

    // Log full payload for debugging (all data coming back from VAPI)
    console.log("[VAPI Webhook] ===== WEBHOOK RECEIVED =====")
    console.log("[VAPI Webhook] Message type:", message?.type)
    console.log("[VAPI Webhook] Call ID:", message?.call?.id)
    console.log("[VAPI Webhook] Full payload:", JSON.stringify(payload, null, 2))
    
    if (!message) {
      console.log("[VAPI Webhook] No message in payload, returning")
      return NextResponse.json({ received: true })
    }

    switch (message.type) {
      case "call-ended":
      case "end-of-call-report":
        console.log("[VAPI Webhook] Handling call-ended/end-of-call-report")
        await handleCallEnded(message)
        break
      case "call-started":
        console.log("[VAPI Webhook] Handling call-started")
        await handleCallStarted(message)
        break
      case "transcript":
        console.log("[VAPI Webhook] Transcript received (not storing)")
        break
      default:
        console.log("[VAPI Webhook] Unhandled webhook type:", message.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    console.error("[VAPI Webhook] ===== ERROR =====")
    console.error("Webhook processing error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook error" },
      { status: 500 }
    )
  }
}

async function handleCallStarted(message: { call?: { id?: string; customer?: { number?: string; name?: string } } }) {
  const callId = message.call?.id
  console.log("[VAPI Webhook] Call started:", callId)
  
  // Check if we already have this call registered
  if (callId) {
    const existing = await getCallLogByVapiCallId(callId)
    if (!existing) {
      console.log("[VAPI Webhook] Call not registered yet, will wait for register call or create placeholder")
      // Optionally create a placeholder here if you want to track all calls
    }
  }
}

async function handleCallEnded(message: {
  call?: {
    id?: string
    durationSeconds?: number
    transcript?: string
    summary?: string
    artifact?: { structuredOutputs?: Record<string, { name?: string; result?: unknown }> }
    analysis?: { moodScore?: number; memories?: unknown[]; summary?: string }
    customer?: { number?: string; name?: string }
  }
}) {
  const call = message.call
  if (!call?.id) {
    console.warn("[VAPI Webhook] handleCallEnded: missing call.id")
    return
  }

  const vapiCallId = call.id
  console.log("[VAPI Webhook] Processing call end:", vapiCallId)

  // We only update if we have a call_log (created when call was started via our API or after frontend registers)
  let existingLog = await getCallLogByVapiCallId(vapiCallId)
  
  if (!existingLog) {
    console.log("[VAPI Webhook] No call_log for vapi_call_id:", vapiCallId)
    console.log("[VAPI Webhook] Creating placeholder call_log for unregistered call")
    
    // Create a placeholder so we don't lose the data
    // The elder_id will be null until we can match it somehow
    try {
      await createCallLog({
        elder_id: null as any, // We'll need to handle this case
        vapi_call_id: vapiCallId,
        started_at: new Date(Date.now() - (call.durationSeconds || 0) * 1000).toISOString(),
      })
      existingLog = await getCallLogByVapiCallId(vapiCallId)
    } catch (e) {
      console.error("[VAPI Webhook] Failed to create placeholder call_log:", e)
      return
    }
  }

  if (!existingLog) {
    console.error("[VAPI Webhook] Could not create or find call_log, skipping")
    return
  }
  
  const elderId = existingLog.elder_id
  console.log("[VAPI Webhook] Elder ID:", elderId)

  // 1) Try structured outputs from webhook payload (artifact may be present on end-of-call-report)
  let structured: EverlyStructuredResult | null = extractStructuredFromPayload(call)
  console.log("[VAPI Webhook] Structured from payload:", structured)

  // 2) If not in payload, fetch call from VAPI API (structured outputs are ready a few seconds after call ends)
  if (!structured) {
    console.log("[VAPI Webhook] No structured data in payload, waiting 5s then fetching from API...")
    await new Promise((r) => setTimeout(r, 5000))
    try {
      const fullCall = await getCallDetails(vapiCallId)
      console.log("[VAPI Webhook] Full call from API:", JSON.stringify(fullCall, null, 2))
      structured = extractStructuredFromPayload(fullCall)
      console.log("[VAPI Webhook] Structured from API fetch:", structured)
    } catch (e) {
      console.warn("[VAPI Webhook] Failed to fetch VAPI call for structured outputs:", e)
    }
  }

  const moodScore = moodWordToScore(structured?.mood)
  const medicationConfirmed = structured?.meds_taken ?? fallbackMedicationConfirmed(call)
  const summary =
    (structured?.mood_notes ? `Mood: ${structured.mood_notes}. ` : "") +
    (call.summary || call.analysis?.summary || "")
  const concernFlags = buildConcernFlags(call, structured?.mood)

  const updates: Record<string, unknown> = {
    ended_at: new Date().toISOString(),
    duration_seconds: call.durationSeconds ?? 0,
    transcript: call.transcript ?? "",
    summary: summary.trim() || (call.summary ?? ""),
    mood_score: moodScore,
    medication_confirmed: medicationConfirmed,
    concern_flags: concernFlags,
    memories_extracted: structured?.has_story && structured?.chapter_content
      ? [{ title: structured.chapter_title, text: structured.chapter_content }]
      : fallbackMemoriesExtracted(call),
  }

  console.log("[VAPI Webhook] Updates to call_log:", JSON.stringify(updates, null, 2))

  await updateCallLog(vapiCallId, updates as Parameters<typeof updateCallLog>[1])

  // 3) If structured output says there was a story, create a memory row
  if (structured?.has_story && structured?.chapter_content && elderId) {
    console.log("[VAPI Webhook] Creating memory:", { chapter_title: structured.chapter_title, has_content: !!structured.chapter_content })
    await createMemory({
      elder_id: elderId,
      call_id: vapiCallId,
      memory_text: structured.chapter_content,
      category: structured.chapter_title || "Story",
      date_mentioned: new Date().toISOString().slice(0, 10),
      sentiment: structured.mood ?? "neutral",
    })
  }

  console.log("[VAPI Webhook] Call ended and processed successfully:", vapiCallId)
}

/** Read Everly structured result from VAPI call.artifact.structuredOutputs (any output that has mood / meds_taken) */
function extractStructuredFromPayload(call: any): EverlyStructuredResult | null {
  const outputs = call?.artifact?.structuredOutputs ?? call?.structuredOutputs
  if (!outputs || typeof outputs !== "object") return null

  for (const entry of Object.values(outputs) as { name?: string; result?: unknown }[]) {
    const r = entry?.result
    if (r && typeof r === "object" && ("mood" in r || "meds_taken" in r)) {
      return r as EverlyStructuredResult
    }
  }
  return null
}

function moodWordToScore(mood?: string): number {
  if (!mood) return 3
  const m = mood.toLowerCase()
  if (["happy", "content", "cheerful"].some((w) => m.includes(w))) return 5
  if (["sad", "lonely", "anxious", "frustrated", "confused"].some((w) => m.includes(w))) return 1
  if (["tired", "nostalgic"].some((w) => m.includes(w))) return 3
  return 3
}

function fallbackMedicationConfirmed(call: any): boolean {
  const t = (call?.transcript ?? "").toLowerCase()
  return t.includes("taken") || t.includes("yes")
}

function buildConcernFlags(call: any, mood?: string): string[] {
  const flags: string[] = []
  const t = (call?.transcript ?? "").toLowerCase()
  if (t.includes("pain")) flags.push("pain mentioned")
  if (t.includes("fall")) flags.push("fall risk")
  if (t.includes("dizzy")) flags.push("dizziness")
  const m = (mood ?? "").toLowerCase()
  if (["sad", "lonely", "anxious"].some((w) => m.includes(w))) flags.push("mood concern")
  return flags
}

function fallbackMemoriesExtracted(call: any): any[] {
  return call?.analysis?.memories ?? []
}
