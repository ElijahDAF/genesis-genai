"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  AlertCircle, 
  Share2, 
  FileText, 
  Plus,
  Phone,
  Heart,
  Clock,
  ArrowLeft,
  Loader2
} from "lucide-react"
import type { ElderData, CaregiverData } from "@/app/types"
import { useVapi } from "@/components/vapi-call-provider"
import type { ElderLike } from "@/components/vapi-call-provider"

interface DashboardProps {
  elder: ElderData
  caregiver: CaregiverData
  onBackToList?: () => void
}

// Mock data for the demo - pre-loaded with Dorothy's persona
const mockCalls = [
  {
    id: 1,
    date: "Today",
    time: "10:14 AM",
    duration: "22 min",
    mood: "happy" as const,
    summary: "Talked about gardening plans for spring. Mentioned wanting to teach Emma how to grow tomatoes.",
  },
  {
    id: 2,
    date: "Tue Mar 11",
    time: "8:47 AM",
    duration: "31 min",
    mood: "neutral" as const,
    summary: "Mentioned Harold's birthday. Seemed lonely. Recalled their first dance in 1963.",
  },
  {
    id: 3,
    date: "Mon Mar 10",
    time: "3:20 PM",
    duration: "18 min",
    mood: "happy" as const,
    summary: "Continued the rural Ontario teaching story. Remembered student names from 1967.",
  },
  {
    id: 4,
    date: "Fri Mar 7",
    time: "11:05 AM",
    duration: "26 min",
    mood: "happy" as const,
    summary: "Asked about Jake's hockey game. Excited he scored his first goal. Laughed a lot.",
  },
]

const mockTopics = [
  { name: "Family", percentage: 82, color: "bg-[var(--sage)]" },
  { name: "Memories", percentage: 71, color: "bg-(--sage-light)" },
  { name: "Gardening", percentage: 45, color: "bg-[var(--amber)]" },
  { name: "Health", percentage: 28, color: "bg-[var(--coral)]" },
]

const mockFamilyMembers = [
  { name: "Emma", relationship: "Granddaughter", initial: "E", color: "bg-[var(--amber)]" },
  { name: "Jake", relationship: "Grandson", initial: "J", color: "bg-(--sage-light)" },
]

//helper function
function formatTime(time: string) {
  if (!time) return time
  if (time.toLowerCase().includes("am") || time.toLowerCase().includes("pm")) return time
  const [hourStr, minutes] = time.split(":")
  const hour = parseInt(hourStr)
  const suffix = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${minutes} ${suffix}`
}

export function Dashboard({ elder, onBackToList }: DashboardProps) {
  const [callFilter, setCallFilter] = useState<"week" | "all">("week")
  const { startCall, endCall, isActive, isConnecting, error } = useVapi()

  const elderLike: ElderLike = {
    name: `${elder.firstName} ${elder.lastName}`.trim(),
    age: (() => {
      if (!elder.dateOfBirth) return 81
      const birthDate = new Date(elder.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      return age
    })(),
    biography: elder.location ? `Lives in ${elder.location}. ${elder.thingsTheyLove || ""}`.trim() : elder.thingsTheyLove || "",
    hobbies: elder.thingsTheyLove ? elder.thingsTheyLove.split(",").map((s) => s.trim()).filter(Boolean) : [],
    medications: (elder.medicationSchedule ?? []).map((m) => ({ name: m.name, time: m.time })),
    personality_notes: elder.thingsTheyLove ?? "",
  }

  // Calculate age from DOB
  const calculateAge = (dob: string) => {
    if (!dob) return 81 // Default for demo
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const age = calculateAge(elder.dateOfBirth)
  const fullName = `${elder.firstName} ${elder.lastName}`
  const initials = `${elder.firstName[0] || "D"}${elder.lastName[0] || "W"}`
  const location = elder.location || "Toronto, ON"
 

  // Calculate meds on track
  const medsOnTrack = elder.medicationSchedule?.length > 0 ? elder.medicationSchedule.length : 3

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {onBackToList && (
              <Button variant="ghost" size="icon" onClick={onBackToList} className="shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-xl font-semibold text-foreground font-heading">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground font-heading">{fullName}</h1>
              <p className="text-sm text-muted-foreground">
                {age} · {location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="sage-pill">
              Active
            </span>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => startCall(elderLike)}
              disabled={isConnecting || isActive}
            >
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Phone className="w-4 h-4 mr-2" />}
              {isActive ? "On call…" : "Start call"}
            </Button>
            <Button variant="outline" className="border-border">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-3 rounded-[28px] bg-secondary border border-border text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard value="14" label="Calls this month" />
          <StatCard value="47" label="Stories captured" />
          <StatCard value="86%" label="Happy mood days" />
          <StatCard value={String(medsOnTrack)} label="Health on track (days)" />
        </div>

          {/* Health Schedule */}
          <div className="paper-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Health Schedule
              </h3>
            </div>
            
            {elder.medicationSchedule && elder.medicationSchedule.length > 0 ? (
              <div className="space-y-3">
                {elder.medicationSchedule.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between bg-background rounded-[28px] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <Clock className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{med.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(med.time)} · {med.days.join(", ")}
                        </p>
                      </div>
                    </div>
                    <span className="sage-pill text-xs">On track</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">No health reminders set up yet</p>
                <p className="text-xs text-muted-foreground">
                  Health reminders can be added during registration
                </p>
              </div>
            )}
          </div>
    
        {/* Alert — styled as a call log row */}
        <div className="paper-card p-4 mb-6 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm mb-1">
              <span className="font-medium text-primary">Alert</span>
              <span className="text-muted-foreground">Tue Mar 11</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">8:47 AM</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {elder.firstName} mentioned feeling very alone and referenced Harold several times — our AI flagged a mood dip and notified you automatically.
            </p>
          </div>
          <span className="shrink-0 sage-pill">
            Message sent
          </span>
        </div>

        {/* Story of the Week */}
        <div className="paper-card p-6 mb-6 bg-secondary/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase font-mono">
              Story of the Week
            </span>
            <span className="text-xs text-muted-foreground">· March 10, 2026</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground font-heading mb-4">
            The Summer I Taught in Rural Ontario
          </h2>
          
          <blockquote className="text-foreground italic mb-4 leading-relaxed">
            &ldquo;It was 1967 — I was twenty-two and completely terrified. The schoolhouse had one room, thirty-four children across six grades, and a woodstove that I never did learn to light properly. But that was the proudest year of my life. I think about those children still.&rdquo;
          </blockquote>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Captured over 3 calls this week</span>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border bg-card hover:bg-secondary">
                <Share2 className="w-4 h-4 mr-2" />
                Share with family
              </Button>
              <Button variant="outline" className="border-border bg-card hover:bg-secondary">
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Calls - Takes 2 columns */}
          <div className="col-span-2 paper-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                Recent Calls
              </h3>
              <div className="flex bg-background rounded-[28px] p-1">
                <button
                  onClick={() => setCallFilter("week")}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    callFilter === "week"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  This week
                </button>
                <button
                  onClick={() => setCallFilter("all")}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    callFilter === "all"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {mockCalls.map((call) => (
                <CallLogItem key={call.id} call={call} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Topics This Month */}
            <div className="paper-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 font-mono">
                Topics This Month
              </h3>
              <div className="space-y-3">
                {mockTopics.map((topic) => (
                  <TopicBar key={topic.name} topic={topic} />
                ))}
              </div>
            </div>

            {/* Family Members */}
            <div className="paper-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 font-mono">
                Family Members
              </h3>
              <div className="space-y-3">
                {mockFamilyMembers.map((member) => (
                  <FamilyMemberItem key={member.name} member={member} />
                ))}
                <button className="w-full py-2 border border-dashed border-border rounded-[28px] text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add family member
                </button>
              </div>
            </div>
          </div>
        </div>

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

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-foreground font-heading">Everly</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Help</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

// Sub-components
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="paper-card p-4">
      <div className="text-2xl font-bold text-foreground font-heading">{value}</div>
      <div className="text-sm text-muted-foreground font-mono">{label}</div>
    </div>
  )
}

function CallLogItem({ call }: { call: typeof mockCalls[0] }) {
  const moodEmoji = {
    happy: { icon: "😊", bg: "bg-chart-1" },
    neutral: { icon: "😐", bg: "bg-secondary" },
    sad: { icon: "😟", bg: "bg-destructive/20" },
  }

  const mood = moodEmoji[call.mood]

  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full ${mood.bg} flex items-center justify-center text-base`}>
        {mood.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">{call.date}</span>
          <span className="text-muted-foreground">{call.time}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{call.duration}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{call.summary}</p>
      </div>
    </div>
  )
}

const topicBarColors = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-primary"]
function TopicBar({ topic }: { topic: typeof mockTopics[0] }) {
  const colorClass = topicBarColors[mockTopics.indexOf(topic) % topicBarColors.length]
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground w-20 font-mono">{topic.name}</span>
      <div className="flex-1 h-2.5 bg-background rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} rounded-full transition-all`}
          style={{ width: `${topic.percentage}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground w-10 text-right">{topic.percentage}%</span>
    </div>
  )
}

function FamilyMemberItem({ member }: { member: typeof mockFamilyMembers[0] }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground font-heading">
          {member.initial}
        </div>
        <span className="text-sm font-medium text-foreground">{member.name}</span>
      </div>
      <span className="text-sm text-muted-foreground font-mono">{member.relationship}</span>
    </div>
  )
}
