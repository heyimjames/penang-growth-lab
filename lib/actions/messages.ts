"use server"

import { createClient } from "@/lib/supabase/server"
import { CaseMessage, CaseMessageInsert } from "@/lib/types"

export async function getMessagesForCase(caseId: string): Promise<CaseMessage[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("case_messages")
    .select("*")
    .eq("case_id", caseId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching messages:", error)
    throw new Error("Failed to fetch messages")
  }

  return data as CaseMessage[]
}

export async function saveMessage(message: CaseMessageInsert): Promise<CaseMessage> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Ensure the message belongs to the current user
  if (message.user_id !== user.id) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("case_messages")
    .insert(message)
    .select()
    .single()

  if (error) {
    console.error("Error saving message:", error)
    throw new Error("Failed to save message")
  }

  return data as CaseMessage
}

export async function saveMessages(messages: CaseMessageInsert[]): Promise<CaseMessage[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Ensure all messages belong to the current user
  for (const message of messages) {
    if (message.user_id !== user.id) {
      throw new Error("Unauthorized")
    }
  }

  const { data, error } = await supabase
    .from("case_messages")
    .insert(messages)
    .select()

  if (error) {
    console.error("Error saving messages:", error)
    throw new Error("Failed to save messages")
  }

  return data as CaseMessage[]
}

export async function deleteMessagesForCase(caseId: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("case_messages")
    .delete()
    .eq("case_id", caseId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error deleting messages:", error)
    throw new Error("Failed to delete messages")
  }
}
