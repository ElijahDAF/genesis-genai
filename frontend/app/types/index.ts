export interface Elder {
  id: string
  caregiver_id: string
  name: string
  age: number
  phone: string
  /** Optional location e.g. "Toronto, ON" */
  location?: string
  biography: string
  hobbies: string[]
  family_members: Record<string, any>
  medications: Medication[]
  call_schedule: CallSchedule
  personality_notes: string
  risk_flags: string[]
  created_at: string
}

export interface Medication {
  name: string
  time: string
  dosage?: string
}

export interface CallSchedule {
  times: string[]
  days?: string[]
  timezone?: string
}

export interface CallLog {
  id: string
  elder_id: string
  vapi_call_id: string
  started_at: string
  ended_at: string
  duration_seconds: number
  transcript: string
  summary: string
  mood_score: number
  medication_confirmed: boolean
  memories_extracted: any[]
  concern_flags: string[]
  created_at: string
}

export interface Memory {
  id: string
  elder_id: string
  call_id: string
  memory_text: string
  category: string
  date_mentioned: string
  sentiment: string
  created_at: string
}

/** Form/UI shape for adding an elder (registration flow) */
export interface MedicationReminder {
  id: string
  name: string
  time: string
  days: string[]
  dosage?: string
}

export interface ElderData {
  id: string
  firstName: string
  lastName: string
  phone: string
  dateOfBirth: string
  location: string
  relationship: string
  thingsTheyLove: string
  medicationSchedule: MedicationReminder[]
}

/** Form data for creating a new elder (before saving to DB) */
export interface ElderFormData {
  firstName: string
  lastName: string
  phone: string
  dateOfBirth: string
  location: string
  relationship: string
  thingsTheyLove: string
  medicationSchedule: MedicationReminder[]
}

export interface CaregiverData {
  firstName: string
  lastName: string
  email: string
  phone: string
}
