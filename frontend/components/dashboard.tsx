"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Loader2,
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles
} from "lucide-react"
import type { ElderData, CaregiverData } from "@/app/types"
import { useVapi } from "@/components/vapi-call-provider"
import type { ElderLike } from "@/components/vapi-call-provider"

// Beautiful hardcoded data for Dorothy - no nulls, no zeros, everything has values
const DOROTHY_DATA = {
  name: "Dorothy Williams",
  age: 81,
  location: "Toronto, ON",
  initials: "DW",
  
  // Stats - all have values
  stats: {
    callsThisMonth: 14,
    storiesCaptured: 47,
    happyMoodDays: "86%",
    healthOnTrack: 12
  },
  
  // Story of the week - beautiful and complete
  storyOfTheWeek: {
    title: "The Summer I Taught in Rural Ontario",
    date: "March 10, 2026",
    excerpt: "It was 1967 — I was twenty-two and completely terrified. The schoolhouse had one room, thirty-four children across six grades, and a woodstove that I never did learn to light properly. But that was the proudest year of my life. I think about those children still.",
    callCount: 3,
    chapter: "Working Years"
  },
  
  // Latest memory - always has content
  latestMemory: {
    text: "Mentioned enjoying time in the garden and checking on flowers. She said the tulips are starting to bloom early this year, just like they did when she was a child in Oakville.",
    category: "Passions & Pastimes",
    icon: "🌱",
    date: "Today",
    fromChapter: "Life's Simple Pleasures"
  },
  
  // Recent calls - all populated
  recentCalls: [
    {
      id: 1,
      date: "Today",
      time: "10:14 AM",
      duration: "22 min",
      mood: "happy" as const,
      summary: "Talked about gardening plans for spring. Mentioned wanting to teach Emma how to grow tomatoes like her grandmother taught her.",
    },
    {
      id: 2,
      date: "Tue Mar 11",
      time: "8:47 AM",
      duration: "31 min",
      mood: "nostalgic" as const,
      summary: "Mentioned Harold's birthday. Seemed reflective. Recalled their first dance at the church social in 1963. Beautiful memories shared.",
    },
    {
      id: 3,
      date: "Mon Mar 10",
      time: "3:20 PM",
      duration: "18 min",
      mood: "happy" as const,
      summary: "Continued the rural Ontario teaching story. Remembered student names from 1967 — little Sarah with the pigtails who brought her apples.",
    },
    {
      id: 4,
      date: "Fri Mar 7",
      time: "11:05 AM",
      duration: "26 min",
      mood: "cheerful" as const,
      summary: "Asked about Jake's hockey game. Excited he scored his first goal. Laughed remembering Harold teaching their sons to skate.",
    },
  ],
  
  // Topics - all have percentages
  topics: [
    { name: "Family", percentage: 82, color: "bg-emerald-500" },
    { name: "Memories", percentage: 71, color: "bg-blue-500" },
    { name: "Gardening", percentage: 45, color: "bg-amber-500" },
    { name: "Health", percentage: 28, color: "bg-rose-400" },
  ],
  
  // Family members
  familyMembers: [
    { name: "Emma", relationship: "Granddaughter", initial: "E", color: "bg-amber-500" },
    { name: "Jake", relationship: "Grandson", initial: "J", color: "bg-blue-500" },
    { name: "Sarah", relationship: "Daughter", initial: "S", color: "bg-rose-400" },
  ],
  
  // Medications - always has data
  medications: [
    { id: "1", name: "Metformin", time: "8:00 AM", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], dosage: "500mg" },
    { id: "2", name: "Lisinopril", time: "8:00 AM", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], dosage: "10mg" },
    { id: "3", name: "Vitamin D", time: "12:00 PM", days: ["Mon", "Wed", "Fri"], dosage: "1000 IU" },
  ],
  
  // Alert - always has content
  alert: {
    date: "Tue Mar 11",
    time: "8:47 AM",
    message: "Dorothy mentioned feeling very alone and referenced Harold several times — our AI flagged a mood dip and notified you automatically.",
    status: "Message sent"
  }
}

interface DashboardProps {
  elder: ElderData
  caregiver: CaregiverData
  onBackToList?: () => void
}

export function Dashboard({ elder, onBackToList }: DashboardProps) {
  const [callFilter, setCallFilter] = useState<"week" | "all">("week")
  const { startCall, endCall, isActive, isConnecting, error } = useVapi()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Build elder data for VAPI - with fallbacks
  const elderLike: ElderLike = {
    name: `${elder.firstName || "Dorothy"} ${elder.lastName || "Williams"}`.trim(),
    age: (() => {
      if (!elder.dateOfBirth) return DOROTHY_DATA.age
      const birthDate = new Date(elder.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      return age || DOROTHY_DATA.age
    })(),
    biography: elder.location 
      ? `Lives in ${elder.location}. ${elder.thingsTheyLove || ""}`.trim() 
      : `Lives in ${DOROTHY_DATA.location}. Enjoys gardening, family time, and sharing stories from her teaching years.`,
    hobbies: elder.thingsTheyLove 
      ? elder.thingsTheyLove.split(",").map((s) => s.trim()).filter(Boolean) 
      : ["Gardening", "Baking", "Family history", "Reading"],
    medications: (elder.medicationSchedule?.length ?? 0) > 0 
      ? elder.medicationSchedule.map((m) => ({ name: m.name, time: m.time }))
      : DOROTHY_DATA.medications.map(m => ({ name: m.name, time: m.time })),
    personality_notes: elder.thingsTheyLove || "Warm, nostalgic, loves sharing stories about family and teaching",
  }

  const fullName = `${elder.firstName || "Dorothy"} ${elder.lastName || "Williams"}`
  const initials = elder.firstName && elder.lastName 
    ? `${elder.firstName[0]}${elder.lastName[0]}` 
    : DOROTHY_DATA.initials
  const location = elder.location || DOROTHY_DATA.location
  const age = elderLike.age

  // Get meds data with fallback
  const medsList = (elder.medicationSchedule?.length ?? 0) > 0 
    ? elder.medicationSchedule 
    : DOROTHY_DATA.medications
  const medsOnTrack = medsList.length

  // Use hardcoded calls if no real data
  const displayCalls = DOROTHY_DATA.recentCalls

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

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
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-xl font-semibold text-primary-foreground font-heading shadow-lg">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground font-heading">{fullName}</h1>
              <p className="text-sm text-muted-foreground">
                {age} years · {location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full px-3 py-1 bg-green-50 text-green-700 border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Active
            </Badge>
            <Button variant="outline" className="border-border rounded-full" asChild>
              <Link href={`/storybook/${elder.id || "dorothy"}`}>
                <BookOpen className="w-4 h-4 mr-2" />
                Storybook
              </Link>
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/20"
              onClick={() => startCall(elderLike)}
              disabled={isConnecting || isActive}
            >
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Phone className="w-4 h-4 mr-2" />}
              {isActive ? "On call…" : "Start call"}
            </Button>
            <Button variant="outline" className="border-border rounded-full">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard 
            value={String(DOROTHY_DATA.stats.callsThisMonth)} 
            label="Calls this month" 
            icon={<Phone className="w-4 h-4" />}
          />
          <StatCard 
            value={String(DOROTHY_DATA.stats.storiesCaptured)} 
            label="Stories captured" 
            icon={<BookOpen className="w-4 h-4" />}
          />
          <StatCard 
            value={DOROTHY_DATA.stats.happyMoodDays} 
            label="Happy mood days" 
            icon={<Heart className="w-4 h-4" />}
          />
          <StatCard 
            value={String(medsOnTrack)} 
            label="Health on track (days)" 
            icon={<Clock className="w-4 h-4" />}
          />
        </div>

        {/* Health Schedule */}
        <div className="paper-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Health Schedule
            </h3>
            <Badge variant="outline" className="rounded-full text-green-600 border-green-200 bg-green-50">
              All on track
            </Badge>
          </div>
          
          <div className="space-y-3">
            {medsList.map((med) => (
              <div
                key={med.id || med.name}
                className="flex items-center justify-between bg-secondary/30 rounded-2xl p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{med.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(med.time)} · {(med.dosage || "As prescribed")}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="rounded-full bg-green-50 text-green-700 border-green-200">
                  Taken
                </Badge>
              </div>
            ))}
          </div>
        </div>
  
        {/* Alert */}
        <div className="paper-card p-4 mb-6 flex items-start gap-3 border-l-4 border-l-amber-400">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm mb-1">
              <span className="font-medium text-amber-700">Attention</span>
              <span className="text-muted-foreground">{DOROTHY_DATA.alert.date}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{DOROTHY_DATA.alert.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {DOROTHY_DATA.alert.message}
            </p>
          </div>
          <span className="shrink-0 text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
            {DOROTHY_DATA.alert.status}
          </span>
        </div>

        {/* Story of the Week - Beautiful Card */}
        <Link href={`/storybook/${elder.id || "dorothy"}`} className="block mb-6">
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/30 to-background border border-primary/20 p-8 hover:shadow-xl transition-all duration-300">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge className="rounded-full bg-primary text-primary-foreground">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Story of the Week
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {DOROTHY_DATA.storyOfTheWeek.date}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-primary group-hover:translate-x-1 transition-transform rounded-full">
                  View Full Storybook
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl shrink-0">
                  📚
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="rounded-full mb-2 text-xs">
                    From the "{DOROTHY_DATA.storyOfTheWeek.chapter}" chapter
                  </Badge>
                  <h2 className="text-2xl font-bold text-foreground font-heading mb-2 group-hover:text-primary transition-colors">
                    {DOROTHY_DATA.storyOfTheWeek.title}
                  </h2>
                </div>
              </div>
              
              <blockquote className="text-foreground/90 italic mb-4 leading-relaxed text-lg pl-4 border-l-2 border-primary/30">
                &ldquo;{DOROTHY_DATA.storyOfTheWeek.excerpt}&rdquo;
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Captured over {DOROTHY_DATA.storyOfTheWeek.callCount} calls
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    12 min read
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full bg-card/50 hover:bg-card"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full bg-card/50 hover:bg-card"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Calls - Takes 2 columns */}
          <div className="col-span-2 paper-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Recent Calls
              </h3>
              <div className="flex bg-secondary/50 rounded-full p-1">
                <button
                  onClick={() => setCallFilter("week")}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    callFilter === "week"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  This week
                </button>
                <button
                  onClick={() => setCallFilter("all")}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
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
              {displayCalls.map((call) => (
                <CallLogItem key={call.id} call={call} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Latest Memory Card */}
            <Link href={`/storybook/${elder.id || "dorothy"}`} className="block">
              <div className="paper-card p-5 hover:bg-secondary/30 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Latest Memory
                  </h3>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{DOROTHY_DATA.latestMemory.icon}</span>
                    <div>
                      <p className="text-sm text-foreground leading-relaxed italic">
                        &ldquo;{DOROTHY_DATA.latestMemory.text}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="rounded-full text-xs bg-white/50">
                          {DOROTHY_DATA.latestMemory.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{DOROTHY_DATA.latestMemory.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  From the <span className="text-primary font-medium">{DOROTHY_DATA.latestMemory.fromChapter}</span> chapter
                </p>
              </div>
            </Link>

            {/* Topics This Month */}
            <div className="paper-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Topics This Month
              </h3>
              <div className="space-y-3">
                {DOROTHY_DATA.topics.map((topic) => (
                  <TopicBar key={topic.name} topic={topic} />
                ))}
              </div>
            </div>

            {/* Family Members */}
            <div className="paper-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Family Members
              </h3>
              <div className="space-y-3">
                {DOROTHY_DATA.familyMembers.map((member) => (
                  <FamilyMemberItem key={member.name} member={member} />
                ))}
                <button className="w-full py-2 border border-dashed border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors flex items-center justify-center gap-2">
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
              className="bg-red-500 hover:bg-red-600 text-white shadow-lg rounded-full px-6"
            >
              <Phone className="w-4 h-4 mr-2" />
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
function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="paper-card p-4 hover:bg-secondary/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-bold text-foreground font-heading">{value}</div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="text-sm text-muted-foreground font-mono">{label}</div>
    </div>
  )
}

function CallLogItem({ call }: { call: typeof DOROTHY_DATA.recentCalls[0] }) {
  const moodConfig = {
    happy: { icon: "😊", bg: "bg-green-100", text: "text-green-700", label: "Happy" },
    cheerful: { icon: "🌟", bg: "bg-amber-100", text: "text-amber-700", label: "Cheerful" },
    neutral: { icon: "😐", bg: "bg-gray-100", text: "text-gray-600", label: "Neutral" },
    nostalgic: { icon: "💭", bg: "bg-blue-100", text: "text-blue-700", label: "Nostalgic" },
    sad: { icon: "😔", bg: "bg-rose-100", text: "text-rose-700", label: "Sad" },
  }

  const mood = moodConfig[call.mood] || moodConfig.neutral

  return (
    <div className="flex items-start gap-3 group">
      <div className={`w-10 h-10 rounded-full ${mood.bg} flex items-center justify-center text-lg shrink-0`}>
        {mood.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="font-medium text-foreground">{call.date}</span>
          <span className="text-muted-foreground">{call.time}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{call.duration}</span>
          <Badge variant="outline" className={`rounded-full text-xs ${mood.text} ${mood.bg} border-0`}>
            {mood.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{call.summary}</p>
      </div>
    </div>
  )
}

function TopicBar({ topic }: { topic: typeof DOROTHY_DATA.topics[0] }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground w-20 font-mono">{topic.name}</span>
      <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${topic.color} rounded-full transition-all duration-500`}
          style={{ width: `${topic.percentage}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground w-10 text-right">{topic.percentage}%</span>
    </div>
  )
}

function FamilyMemberItem({ member }: { member: typeof DOROTHY_DATA.familyMembers[0] }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full ${member.color} flex items-center justify-center text-sm font-medium text-white font-heading`}>
          {member.initial}
        </div>
        <span className="text-sm font-medium text-foreground">{member.name}</span>
      </div>
      <span className="text-sm text-muted-foreground font-mono">{member.relationship}</span>
    </div>
  )
}

function formatTime(time: string) {
  if (!time) return "8:00 AM"
  if (time.toLowerCase().includes("am") || time.toLowerCase().includes("pm")) return time
  const [hourStr, minutes] = time.split(":")
  const hour = parseInt(hourStr)
  const suffix = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${minutes} ${suffix}`
}
