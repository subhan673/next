"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { cookies } from "next/headers"

type ApiSettings = {
  apiKey: string
  model: string
}

export async function saveApiSettings(settings: ApiSettings) {
  // In a real app, you'd want to store this securely
  // For demo purposes, we'll use cookies (not recommended for API keys in production)
  cookies().set("apiKey", settings.apiKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  cookies().set("model", settings.model, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  return { success: true }
}

export async function sendMessage(message: string) {
  const cookieStore = cookies()
  const apiKey = cookieStore.get("apiKey")?.value
  const model = cookieStore.get("model")?.value || "gpt-4o"

  if (!apiKey) {
    throw new Error("API key not found. Please configure your settings first.")
  }

  try {
    // Using the AI SDK to generate a response
    const { text } = await generateText({
      model: openai(model, { apiKey }),
      prompt: message,
      system: "You are a helpful AI assistant. Provide concise and accurate responses.",
    })

    return text
  } catch (error) {
    console.error("Error generating AI response:", error)
    throw new Error("Failed to generate AI response")
  }
}
