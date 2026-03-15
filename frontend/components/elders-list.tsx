"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Plus, User, Loader2 } from "lucide-react"
import { useVapi } from "@/components/vapi-call-provider"
import { OutboundCallDialog } from "@/components/outbound-call-dialog"
import type { Elder } from "@/app/types"

interface EldersListProps {
  onAddElder: () => void
  onSelectElder?: (elder: Elder) => void
}

export function EldersList({ onAddElder, onSelectElder }: EldersListProps) {
  const [elders, setElders] = useState<Elder[]>([])
  const [loading, setLoading] = useState(true)
  const [outboundError, setOutboundError] = useState<string | null>(null)
  const { startCall, endCall, isActive, isConnecting, error } = useVapi()

  useEffect(() => {
    fetch("/api/elders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.elders)) setElders(data.elders)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleStartCall = async (elder: Elder) => {
    await startCall(elder)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <span className="text-lg">🧚</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Everly</h1>
              <p className="text-sm text-muted-foreground">Care companion dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <OutboundCallDialog
              elders={elders}
              onError={setOutboundError}
              onSuccess={() => setOutboundError(null)}
              triggerLabel="Call a number"
            />
            <Button onClick={onAddElder} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add elderly
            </Button>
          </div>
        </header>

        {(error || outboundError) && (
          <div className="mb-4 p-3 rounded-[28px] bg-secondary border border-border text-destructive text-sm">
            {error ?? outboundError}
          </div>
        )}

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Your elderly
          </h2>
          {elders.length === 0 ? (
            <div className="paper-card p-8 text-center">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-heading text-foreground font-medium mb-1">No elderly yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add someone you care for to start companion calls.
              </p>
              <Button onClick={onAddElder} variant="outline" className="border-border">
                <Plus className="w-4 h-4 mr-2" />
                Add elderly
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {elders.map((elder) => (
                <li
                  key={elder.id}
                  className="paper-card p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-semibold text-foreground shrink-0 font-heading">
                      {elder.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{elder.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {elder.age} years · {elder.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {onSelectElder && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectElder(elder)}
                      >
                        View
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => handleStartCall(elder)}
                      disabled={isConnecting || isActive}
                    >
                      {isConnecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Phone className="w-4 h-4 mr-1.5" />
                          {isActive ? "On call…" : "Start call"}
                        </>
                      )}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {isActive && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Button
              onClick={endCall}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg rounded-[28px]"
            >
              End call
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
