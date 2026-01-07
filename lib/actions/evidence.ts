"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Evidence, EvidenceUpdate, EvidenceAnalysisDetails } from "@/lib/types"

const EVIDENCE_BUCKET = "evidence"

export async function getEvidence(caseId: string): Promise<Evidence[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("evidence")
    .select("*")
    .eq("case_id", caseId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching evidence:", error)
    return []
  }

  return data || []
}

export async function uploadEvidence(
  caseId: string,
  file: File
): Promise<Evidence | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Generate unique file path
  const fileExt = file.name.split(".").pop()
  const fileName = `${user.id}/${caseId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from(EVIDENCE_BUCKET)
    .upload(fileName, file)

  if (uploadError) {
    console.error("Error uploading file:", uploadError)
    return null
  }

  // Create database record
  const { data, error: dbError } = await supabase
    .from("evidence")
    .insert({
      case_id: caseId,
      user_id: user.id,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: fileName,
    })
    .select()
    .single()

  if (dbError) {
    console.error("Error creating evidence record:", dbError)
    // Try to clean up the uploaded file
    await supabase.storage.from(EVIDENCE_BUCKET).remove([fileName])
    return null
  }

  revalidatePath(`/cases/${caseId}`)
  return data
}

export async function deleteEvidence(evidenceId: string): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  // Get the evidence record first
  const { data: evidence, error: fetchError } = await supabase
    .from("evidence")
    .select("*")
    .eq("id", evidenceId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !evidence) {
    console.error("Error fetching evidence for deletion:", fetchError)
    return false
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(EVIDENCE_BUCKET)
    .remove([evidence.storage_path])

  if (storageError) {
    console.error("Error deleting file from storage:", storageError)
    // Continue to delete DB record anyway
  }

  // Delete database record
  const { error: dbError } = await supabase
    .from("evidence")
    .delete()
    .eq("id", evidenceId)
    .eq("user_id", user.id)

  if (dbError) {
    console.error("Error deleting evidence record:", dbError)
    return false
  }

  revalidatePath(`/cases/${evidence.case_id}`)
  return true
}

export async function getEvidenceDownloadUrl(evidenceId: string): Promise<string | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Get the evidence record
  const { data: evidence, error: fetchError } = await supabase
    .from("evidence")
    .select("*")
    .eq("id", evidenceId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !evidence) {
    console.error("Error fetching evidence:", fetchError)
    return null
  }

  // Get signed URL for download
  const { data, error } = await supabase.storage
    .from(EVIDENCE_BUCKET)
    .createSignedUrl(evidence.storage_path, 3600) // 1 hour expiry

  if (error) {
    console.error("Error creating signed URL:", error)
    return null
  }

  return data.signedUrl
}

export async function getAllEvidenceDownloadUrls(caseId: string): Promise<{ fileName: string; url: string; size: number }[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  // Get all evidence records for this case
  const { data: evidenceList, error: fetchError } = await supabase
    .from("evidence")
    .select("*")
    .eq("case_id", caseId)
    .eq("user_id", user.id)

  if (fetchError || !evidenceList) {
    console.error("Error fetching evidence:", fetchError)
    return []
  }

  // Get signed URLs for all files
  const urls = await Promise.all(
    evidenceList.map(async (evidence) => {
      const { data, error } = await supabase.storage
        .from(EVIDENCE_BUCKET)
        .createSignedUrl(evidence.storage_path, 3600)

      if (error || !data) {
        return null
      }

      return {
        fileName: evidence.file_name,
        url: data.signedUrl,
        size: evidence.file_size || 0,
      }
    })
  )

  return urls.filter((u): u is { fileName: string; url: string; size: number } => u !== null)
}

// Get a single evidence record
export async function getEvidenceById(evidenceId: string): Promise<Evidence | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("evidence")
    .select("*")
    .eq("id", evidenceId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching evidence:", error)
    return null
  }

  return data
}

// Update evidence with analysis results
export async function updateEvidenceAnalysis(
  evidenceId: string,
  analysis: {
    summary: string
    details: EvidenceAnalysisDetails
  }
): Promise<Evidence | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("evidence")
    .update({
      analyzed: true,
      analysis_summary: analysis.summary,
      analysis_details: analysis.details,
      analyzed_at: new Date().toISOString(),
    })
    .eq("id", evidenceId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating evidence analysis:", error)
    return null
  }

  // Get case_id for revalidation
  if (data) {
    revalidatePath(`/cases/${data.case_id}`)
  }

  return data
}

// Update user context for evidence
export async function updateEvidenceUserContext(
  evidenceId: string,
  userContext: string
): Promise<Evidence | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("evidence")
    .update({
      user_context: userContext,
    })
    .eq("id", evidenceId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating evidence user context:", error)
    return null
  }

  if (data) {
    revalidatePath(`/cases/${data.case_id}`)
  }

  return data
}

// Update analysis summary (allows user to edit AI summary)
export async function updateEvidenceAnalysisSummary(
  evidenceId: string,
  summary: string
): Promise<Evidence | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("evidence")
    .update({
      analysis_summary: summary,
    })
    .eq("id", evidenceId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating evidence analysis summary:", error)
    return null
  }

  if (data) {
    revalidatePath(`/cases/${data.case_id}`)
  }

  return data
}

// Toggle indexed_for_letter flag
export async function toggleEvidenceIndexed(
  evidenceId: string,
  indexed: boolean
): Promise<Evidence | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("evidence")
    .update({
      indexed_for_letter: indexed,
    })
    .eq("id", evidenceId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error toggling evidence indexed:", error)
    return null
  }

  if (data) {
    revalidatePath(`/cases/${data.case_id}`)
  }

  return data
}

// Get file as base64 for AI analysis
export async function getEvidenceFileBase64(evidenceId: string): Promise<{
  base64: string
  mimeType: string
  fileName: string
} | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Get the evidence record
  const { data: evidence, error: fetchError } = await supabase
    .from("evidence")
    .select("*")
    .eq("id", evidenceId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !evidence) {
    console.error("Error fetching evidence:", fetchError)
    return null
  }

  // Download the file
  const { data: fileData, error: downloadError } = await supabase.storage
    .from(EVIDENCE_BUCKET)
    .download(evidence.storage_path)

  if (downloadError || !fileData) {
    console.error("Error downloading file:", downloadError)
    return null
  }

  // Convert to base64
  const arrayBuffer = await fileData.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString("base64")

  return {
    base64,
    mimeType: evidence.file_type,
    fileName: evidence.file_name,
  }
}

// Batch analyze multiple evidence files
export async function getUnanalyzedEvidence(caseId: string): Promise<Evidence[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("evidence")
    .select("*")
    .eq("case_id", caseId)
    .eq("user_id", user.id)
    .eq("analyzed", false)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching unanalyzed evidence:", error)
    return []
  }

  return data || []
}
