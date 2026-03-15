"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function DebugPage() {
  const [webhookStatus, setWebhookStatus] = useState<"checking" | "ok" | "error">("checking")
  const [recentCalls, setRecentCalls] = useState<any[]>([])
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      NEXT_PUBLIC_VAPI_PUBLIC_KEY: !!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
      NEXT_PUBLIC_VAPI_ASSISTANT_ID: !!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
    })

    // Fetch recent call logs
    fetchRecentCalls()
  }, [])

  const fetchRecentCalls = async () => {
    try {
      const res = await fetch("/api/elders")
      if (res.ok) {
        const elders = await res.json()
        // Get calls for first elder if exists
        if (elders.length > 0) {
          const callsRes = await fetch(`/api/elders/${elders[0].id}/calls`)
          if (callsRes.ok) {
            const calls = await callsRes.json()
            setRecentCalls(calls.slice(0, 5))
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch calls:", e)
    }
  }

  const testWebhook = async () => {
    try {
      const res = await fetch("/api/debug/webhook-test", { method: "POST" })
      const data = await res.json()
      setWebhookStatus(data.received ? "ok" : "error")
    } catch (e) {
      setWebhookStatus("error")
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold font-heading mb-2">VAPI Debug & Setup</h1>
      <p className="text-muted-foreground mb-8">
        Troubleshoot your VAPI integration and webhook setup.
      </p>

      {/* Quick Start Alert */}
      <Alert className="mb-6 border-primary/50 bg-primary/5">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>New to Everly?</AlertTitle>
        <AlertDescription>
          Make sure you&apos;ve set up the VAPI webhook using ngrok. See the{" "}
          <Link href="/" className="underline">README in the root directory</Link> for detailed instructions.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environment Variables</CardTitle>
            <CardDescription>Check your .env.local configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(envVars).map(([key, isSet]) => (
              <div key={key} className="flex items-center justify-between">
                <code className="text-xs bg-secondary px-2 py-1 rounded">{key}</code>
                {isSet ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
            <div className="flex items-center justify-between">
              <code className="text-xs bg-secondary px-2 py-1 rounded">VAPI_WEBHOOK_URL</code>
              <span className="text-xs text-muted-foreground">Set in VAPI Dashboard</span>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Webhook Status</CardTitle>
            <CardDescription>Test if webhooks can reach your server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${webhookStatus === "ok" ? "bg-green-500" : webhookStatus === "error" ? "bg-red-500" : "bg-yellow-500"}`} />
                <span className="text-sm">
                  {webhookStatus === "ok" ? "Webhook reachable" : webhookStatus === "error" ? "Webhook test failed" : "Not tested"}
                </span>
              </div>
              <Button onClick={testWebhook} variant="outline" size="sm" className="w-full">
                Test Webhook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Setup Instructions</CardTitle>
            <CardDescription>Step-by-step guide to get VAPI working</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">1</span>
                <div>
                  <p className="font-medium">Install ngrok</p>
                  <code className="text-xs bg-secondary px-2 py-1 rounded mt-1 inline-block">brew install ngrok</code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">2</span>
                <div>
                  <p className="font-medium">Configure ngrok with your authtoken</p>
                  <code className="text-xs bg-secondary px-2 py-1 rounded mt-1 inline-block">ngrok config add-authtoken YOUR_TOKEN</code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">3</span>
                <div>
                  <p className="font-medium">Start your dev server</p>
                  <code className="text-xs bg-secondary px-2 py-1 rounded mt-1 inline-block">npm run dev</code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">4</span>
                <div>
                  <p className="font-medium">In a new terminal, start ngrok</p>
                  <code className="text-xs bg-secondary px-2 py-1 rounded mt-1 inline-block">ngrok http 3001</code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">5</span>
                <div>
                  <p className="font-medium">Copy the ngrok URL and set it in VAPI Dashboard</p>
                  <p className="text-muted-foreground mt-1">
                    Go to VAPI Dashboard → Your Assistant → Settings → Webhook URL
                  </p>
                  <code className="text-xs bg-secondary px-2 py-1 rounded mt-1 inline-block">https://YOUR_NGROK_URL/api/webhook/vapi</code>
                </div>
              </li>
            </ol>

            <div className="mt-6 pt-6 border-t">
              <Link 
                href="https://dashboard.vapi.ai" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Open VAPI Dashboard
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Calls */}
        {recentCalls.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Recent Calls</CardTitle>
              <CardDescription>Last 5 calls from your database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentCalls.map((call: any) => (
                  <div key={call.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{new Date(call.started_at).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {call.transcript ? "Has transcript" : "No transcript"} • 
                        {call.summary ? "Has summary" : "No summary"}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${call.ended_at ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {call.ended_at ? "Completed" : "In progress"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
