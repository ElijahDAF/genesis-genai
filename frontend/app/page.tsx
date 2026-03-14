"use client"

import { useState } from "react"
import { RegistrationFlow } from "@/components/registration-flow"
import { Dashboard } from "@/components/dashboard"
import { EldersList } from "@/components/elders-list"

export type MedicationReminder = {
  id: string
  name: string
  time: string
  days: string[]
}

export type ElderData = {
  firstName: string
  lastName: string
  phone: string
  dateOfBirth: string
  location: string
  relationship: string
  thingsTheyLove: string
  medicationSchedule: MedicationReminder[]
}

export type CaregiverData = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

function calculateAgeFromDOB(dob: string): number {
  if (!dob) return 0
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

export default function Home() {
  const [view, setView] = useState<"list" | "add" | "dashboard">("list")
  const [elderData, setElderData] = useState<ElderData | null>(null)
  const [caregiverData, setCaregiverData] = useState<CaregiverData | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleRegistrationComplete = async (elder: ElderData, caregiver: CaregiverData) => {
    try {
      setIsSaving(true)
      const payload = {
        name: `${elder.firstName} ${elder.lastName}`.trim(),
        age: calculateAgeFromDOB(elder.dateOfBirth),
        phone: elder.phone,
        biography: elder.location
          ? `Lives in ${elder.location}. ${elder.thingsTheyLove || ""}`.trim()
          : elder.thingsTheyLove || "",
        hobbies: elder.thingsTheyLove
          ? elder.thingsTheyLove.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        family_members: {
          caregiver: {
            name: `${caregiver.firstName} ${caregiver.lastName}`.trim(),
            email: caregiver.email,
            phone: caregiver.phone,
            relationship: elder.relationship,
          },
        },
        medications: (elder.medicationSchedule || []).map((med) => ({
          name: med.name,
          time: med.time,
          dosage: "",
        })),
        call_schedule: {
          times: [...new Set((elder.medicationSchedule || []).map((m) => m.time).filter(Boolean))],
          timezone: "America/Toronto",
        },
        personality_notes: elder.thingsTheyLove || "",
        risk_flags: [],
      }
      const response = await fetch("/api/elders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || "Failed to save elder")
      setElderData(elder)
      setCaregiverData(caregiver)
      setView("dashboard")
    } catch (error) {
      console.error("Registration save failed:", error)
      alert(error instanceof Error ? error.message : "Something went wrong while saving")
    } finally {
      setIsSaving(false)
    }
  }

  if (view === "dashboard" && elderData && caregiverData) {
    return (
      <Dashboard
        elder={elderData}
        caregiver={caregiverData}
        onBackToList={() => {
          setView("list")
          setElderData(null)
          setCaregiverData(null)
        }}
      />
    )
  }

  if (view === "add") {
    return (
      <RegistrationFlow
        onComplete={handleRegistrationComplete}
        onBack={() => setView("list")}
      />
    )
  }

  return (
    <EldersList
      onAddElder={() => setView("add")}
    />
  )
}